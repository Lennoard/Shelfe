package com.androidvip.domain.repositories

import com.androidvip.commom.ResultWrapper
import com.androidvip.domain.BookSource
import com.androidvip.domain.entities.Book
import com.androidvip.domain.entities.UserBook
import com.androidvip.domain.errors.TransactionError

interface BooksRepository {
    suspend fun getBooks(
        query: String? = null,
        source: BookSource
    ): ResultWrapper<List<Book>, TransactionError>
    suspend fun getBook(id: String, source: BookSource): ResultWrapper<UserBook?, TransactionError>
    suspend fun setBook(book: UserBook): ResultWrapper<Unit, TransactionError>
    suspend fun deleteUserBook(book: UserBook): ResultWrapper<Unit, TransactionError>
    suspend fun search(
        query: String,
        startIndex: Int = 0,
        maxResults: Int = 40
    ): ResultWrapper<List<Book>, TransactionError>
}
