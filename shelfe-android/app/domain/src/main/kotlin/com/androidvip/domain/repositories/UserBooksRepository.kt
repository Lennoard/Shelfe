package com.androidvip.domain.repositories

import com.androidvip.domain.entities.UserBook

interface UserBooksRepository {
    // TODO: sealed class result
    suspend fun getUserBooks(): List<UserBook>
    suspend fun getUserBook(bookId: String): UserBook?
    suspend fun setUserBook(userBook: UserBook)
    suspend fun deleteUserBook(userBook: UserBook)
}
