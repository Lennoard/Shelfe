package com.androidvip.data.utils

import com.androidvip.common.DataFactory
import com.androidvip.shelfe.domain.BookStatus
import com.androidvip.shelfe.domain.entities.UserBook

object BookStubs {
    fun randomBook(bookId: String) = UserBook(
        id = bookId,
        userRating = DataFactory.randomFloat(),
        progress = DataFactory.randomFloat(),
        statusEnum = BookStatus.DROPPED,
        lastStatus = DataFactory.randomDate(),
        favorite = DataFactory.randomBoolean(),
        lastModified = DataFactory.randomDate(),
        notes = emptyList()
    )
}