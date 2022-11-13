package com.androidvip.domain.datasources

import com.androidvip.domain.entities.Book

interface BookDataSource {
    suspend fun getBooks(query: String?): List<Book>
    suspend fun getBook(id: String): Book?
    suspend fun setBook(book: Book)
    suspend fun deleteUserBook(book: Book)
}
