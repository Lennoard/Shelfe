package com.androidvip.data.utils

import com.androidvip.common.DataFactory
import com.androidvip.domain.BookStatus
import com.androidvip.domain.entities.UserBook

object BookStubs {
    fun randomBook(bookId: String) = UserBook(
        id = bookId,
        userRating = DataFactory.randomFloat(),
        progress = DataFactory.randomFloat(),
        status = BookStatus.DROPPED,
        lastStatus = DataFactory.randomDate(),
        favorite = DataFactory.randomBoolean(),
        lastModified = DataFactory.randomDate(),
        notes = emptyList()
    )
}