package com.androidvip.data.repositories

import com.androidvip.commom.ResultWrapper
import com.androidvip.commom.getOrDefault
import com.androidvip.domain.BookSource
import com.androidvip.domain.datasources.BookDataSource
import com.androidvip.domain.datasources.VolumeDataSource
import com.androidvip.domain.entities.Book
import com.androidvip.domain.entities.UserBook
import com.androidvip.domain.errors.BookNotFoundException
import com.androidvip.domain.errors.TransactionError
import com.androidvip.domain.repositories.BooksRepository
import java.io.IOException
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.HttpException

class BooksRepositoryImpl(
    private val volumeDataSource: VolumeDataSource,
    private val localBookDataSource: BookDataSource,
    private val remoteBookDataSource: BookDataSource,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : BooksRepository {
    override suspend fun getBooks(
        query: String?,
        source: BookSource
    ): ResultWrapper<List<Book>, TransactionError> = withContext(dispatcher) {
        runCatching {
            when (source) {
                BookSource.GOOGLE_BOOKS -> search("").getOrDefault(emptyList())
                BookSource.LOCAL -> localBookDataSource.getBooks(query)
                BookSource.REMOTE -> remoteBookDataSource.getBooks(query)
            }.let { data ->
                ResultWrapper.Success(data)
            }
        }.getOrElse { error ->
            handleError(error)
        }
    }

    override suspend fun getBook(
        id: String,
        source: BookSource
    ): ResultWrapper<UserBook?, TransactionError> = withContext(dispatcher) {
        runCatching {
            when (source) {
                BookSource.GOOGLE_BOOKS -> {
                    val book = search(id).getOrDefault(emptyList()).firstOrNull()
                        ?: throw BookNotFoundException()
                    UserBook.fromBook(book)
                }
                BookSource.LOCAL -> localBookDataSource.getBook(id)
                BookSource.REMOTE -> remoteBookDataSource.getBook(id)
            }.let { data ->
                ResultWrapper.Success(data)
            }
        }.getOrElse { error ->
            handleError(error)
        }
    }

    override suspend fun setBook(
        book: UserBook
    ): ResultWrapper<Unit, TransactionError> = withContext(dispatcher) {
        runCatching {
            localBookDataSource.setBook(book).also { remoteBookDataSource.setBook(book) }
            ResultWrapper.Success(Unit)
        }.getOrElse { error ->
            handleError(error)
        }
    }

    override suspend fun deleteUserBook(
        book: UserBook
    ): ResultWrapper<Unit, TransactionError> = withContext(dispatcher) {
        runCatching {
            localBookDataSource.deleteUserBook(book).also {
                remoteBookDataSource.deleteUserBook(book)
            }
            ResultWrapper.Success(Unit)
        }.getOrElse { error ->
            handleError(error)
        }
    }

    override suspend fun search(
        query: String,
        startIndex: Int,
        maxResults: Int
    ): ResultWrapper<List<Book>, TransactionError> = withContext(dispatcher) {
        runCatching {
            val books = volumeDataSource.search(query, startIndex, maxResults)
            ResultWrapper.Success(books)
        }.getOrElse { error ->
            handleError(error)
        }
    }

    private fun handleError(error: Throwable): ResultWrapper.Error<TransactionError> {
        return when (error) {
            is HttpException -> ResultWrapper.Error(TransactionError.NetworkError)
            is IOException -> ResultWrapper.Error(TransactionError.DatabaseError)
            is BookNotFoundException -> ResultWrapper.Error(TransactionError.BookNotFoundError)
            else -> ResultWrapper.Error(TransactionError.UnknownError(error.message.orEmpty()))
        }
    }
}
