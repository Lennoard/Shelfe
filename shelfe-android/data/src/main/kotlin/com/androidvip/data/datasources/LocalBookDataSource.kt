package com.androidvip.data.datasources

import com.androidvip.data.access.UserBookDAO
import com.androidvip.data.database.UserBookDatabase
import com.androidvip.data.mappers.UserBookMapper
import com.androidvip.shelfe.domain.datasources.BookDataSource
import com.androidvip.shelfe.domain.entities.UserBook
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class LocalBookDataSource(
    private val db: UserBookDatabase,
    private val mapper: UserBookMapper,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : BookDataSource {

    override suspend fun getBooks(query: String?): List<UserBook> = withContext(dispatcher) {
        dao.getAll()?.map { mapper.map(it) }.orEmpty()
    }

    override suspend fun getBook(id: String): UserBook? = withContext(dispatcher) {
        dao.getById(id)?.mapNotNull { bookDTO ->
            bookDTO?.let { mapper.map(it) }
        }.orEmpty().firstOrNull()
    }

    override suspend fun setBook(book: UserBook) = withContext(dispatcher) {
        dao.insertReplacing(mapper.unMap(book))
    }

    override suspend fun deleteUserBook(book: UserBook) = withContext(dispatcher) {
        dao.delete(mapper.unMap(book))
    }

    private val dao: UserBookDAO
        get() = db.userBookDao()
}
