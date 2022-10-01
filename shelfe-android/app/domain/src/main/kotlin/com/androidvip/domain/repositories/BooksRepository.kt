package com.androidvip.domain.repositories

import com.androidvip.domain.entities.Book

interface BooksRepository {
    // TODO: sealed class result
    suspend fun search(query: String, startIndex: Int = 0, maxResults: Int = 40): List<Book>
    suspend fun getBook(bookId: String): Book?
}
