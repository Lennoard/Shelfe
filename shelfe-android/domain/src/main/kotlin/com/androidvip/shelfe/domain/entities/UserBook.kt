package com.androidvip.shelfe.domain.entities

import com.androidvip.shelfe.domain.BookStatus
import java.io.Serializable
import java.util.Date

data class UserBook(
    override var id: String = "",
    var userRating: Float? = null,
    var progress: Float = 0F,
    var statusEnum: BookStatus = BookStatus.NOT_ADDED,
    var status: Int = BookStatus.NOT_ADDED.value,
    var lastStatus: Date = Date(),
    var favorite: Boolean = false,
    var lastModified: Date = Date(),
    var notes: List<Note>? = emptyList(),
    var statusRank: Int = 0
) : Book(id), Serializable {
    companion object {
        fun fromBook(book: Book) = UserBook(book.id)
    }
}
