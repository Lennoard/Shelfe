package com.androidvip.shelfe.domain.datasources

import com.androidvip.shelfe.domain.entities.UserBook

interface BookDataSource {
    suspend fun getBooks(query: String?): List<UserBook>
    suspend fun getBook(id: String): UserBook?
    suspend fun setBook(book: UserBook)
    suspend fun deleteUserBook(book: UserBook)
}
