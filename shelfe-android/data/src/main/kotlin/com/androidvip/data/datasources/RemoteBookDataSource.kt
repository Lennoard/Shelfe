package com.androidvip.data.datasources

import com.androidvip.shelfe.domain.BookStatus
import com.androidvip.shelfe.domain.PathDependable
import com.androidvip.shelfe.domain.datasources.BookDataSource
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.UserNotSignedInException
import com.google.firebase.firestore.CollectionReference
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.tasks.await
import kotlinx.coroutines.withContext

class RemoteBookDataSource(
    private val db: FirebaseFirestore,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : BookDataSource, PathDependable {
    private var rootPath = ""

    override suspend fun getBooks(query: String?): List<UserBook> = checkPathWithContext {
        booksCollection
            .get()
            .await()
            .toObjects(UserBook::class.java).onEach {
                it.statusEnum = BookStatus[it.status]
            }
    }

    override suspend fun getBook(id: String): UserBook? = checkPathWithContext {
        booksCollection
            .document(id)
            .get()
            .await()
            .toObject(UserBook::class.java)?.apply {
                statusEnum = BookStatus[status]
            }
    }

    override suspend fun setBook(book: UserBook) = checkPathWithContext {
        booksCollection.document(book.id).set(book).await()
        Unit
    }

    override suspend fun deleteUserBook(book: UserBook) = checkPathWithContext {
        booksCollection.document(book.id).delete().await()
        Unit
    }

    override fun setRootPath(path: String) {
        rootPath = path
    }

    private suspend fun <T> checkPathWithContext(
        block: suspend CoroutineScope.() -> T
    ) = withContext(dispatcher) {
        if (rootPath.isEmpty()) {
            throw UserNotSignedInException()
        }
        block()
    }

    internal val booksCollection: CollectionReference
        get() {
            return db.collection(USERS_COLLECTION)
                .document(rootPath)
                .collection(BOOKS_COLLECTION)
        }

    private companion object {
        private const val USERS_COLLECTION = "users"
        private const val BOOKS_COLLECTION = "books"
    }
}
