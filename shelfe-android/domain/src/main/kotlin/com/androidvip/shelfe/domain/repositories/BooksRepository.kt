package com.androidvip.shelfe.domain.repositories

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.BookSource
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError

interface BooksRepository {
    suspend fun getBooks(
        query: String? = null,
        source: BookSource
    ): ResultWrapper<List<UserBook>, TransactionError>
    suspend fun getBook(id: String, source: BookSource): ResultWrapper<UserBook?, TransactionError>
    suspend fun setBook(book: UserBook): ResultWrapper<Unit, TransactionError>
    suspend fun deleteUserBook(book: UserBook): ResultWrapper<Unit, TransactionError>
    suspend fun search(
        query: String,
        startIndex: Int = 0,
        maxResults: Int = 40
    ): ResultWrapper<List<Book>, TransactionError>

    fun setUserId(userId: String)
}
