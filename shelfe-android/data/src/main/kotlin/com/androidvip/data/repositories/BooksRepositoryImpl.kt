package com.androidvip.data.repositories

import com.androidvip.common.ResultWrapper
import com.androidvip.common.getOrDefault
import com.androidvip.shelfe.domain.BookSource
import com.androidvip.shelfe.domain.PathDependable
import com.androidvip.shelfe.domain.datasources.BookDataSource
import com.androidvip.shelfe.domain.datasources.VolumeDataSource
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.BookNotFoundException
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.errors.UserNotSignedInException
import com.androidvip.shelfe.domain.repositories.BooksRepository
import kotlinx.coroutines.CoroutineDispatcher
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.HttpException
import java.io.IOException

class BooksRepositoryImpl(
    private val volumeDataSource: VolumeDataSource,
    private val localBookDataSource: BookDataSource,
    private val remoteBookDataSource: BookDataSource,
    private val dispatcher: CoroutineDispatcher = Dispatchers.IO
) : BooksRepository {
    override suspend fun getBooks(
        query: String?,
        source: BookSource
    ): ResultWrapper<List<UserBook>, TransactionError> = withContext(dispatcher) {
        runCatching {
            when (source) {
                BookSource.GOOGLE_BOOKS -> search(query.orEmpty()).getOrDefault(emptyList()).map {
                    UserBook.fromBook(it)
                }
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

    override fun setUserId(userId: String) {
        (remoteBookDataSource as (PathDependable)).setRootPath(userId)
    }

    private fun handleError(error: Throwable): ResultWrapper.Error<TransactionError> {
        return when (error) {
            is HttpException -> ResultWrapper.Error(TransactionError.NetworkError)
            is IOException -> ResultWrapper.Error(TransactionError.DatabaseError)
            is UserNotSignedInException -> ResultWrapper.Error(TransactionError.UserNotSingedError)
            is BookNotFoundException -> ResultWrapper.Error(TransactionError.BookNotFoundError)
            else -> ResultWrapper.Error(TransactionError.UnknownError(error.message.orEmpty()))
        }
    }
}
