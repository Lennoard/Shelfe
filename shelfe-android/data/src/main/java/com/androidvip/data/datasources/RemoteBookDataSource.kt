package com.androidvip.data.datasources

import com.androidvip.domain.PathDependable
import com.androidvip.domain.datasources.BookDataSource
import com.androidvip.domain.entities.Book
import com.androidvip.domain.errors.UserNotSignedInException
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

    override suspend fun getBooks(query: String?): List<Book> = checkPathWithContext {
        booksCollection
            .get()
            .await()
            .toObjects(Book::class.java)
    }

    override suspend fun getBook(id: String): Book? = checkPathWithContext {
        booksCollection
            .document(id)
            .get()
            .await()
            .toObject(Book::class.java)
    }

    override suspend fun setBook(book: Book) = checkPathWithContext {
        booksCollection.document(book.id).set(book).await()
        Unit
    }

    override suspend fun deleteUserBook(book: Book) = checkPathWithContext {
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

    private val booksCollection: CollectionReference
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
