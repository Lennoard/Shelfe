package com.androidvip.domain.entities

import com.androidvip.domain.BookStatus
import java.util.Date

class UserBook(
    override val id: String,
    var userRating: Float? = null,
    var progress: Float = 0F,
    var status: BookStatus = BookStatus.NOT_ADDED,
    var lastStatus: Date = Date(),
    var favorite: Boolean = false,
    var lastModified: Date = Date(),
    var notes: List<Note>? = emptyList(),
    var statusRank: Int = 0
) : Book(id) {
    companion object {
        fun fromBook(book: Book) = UserBook(book.id)
    }
}
