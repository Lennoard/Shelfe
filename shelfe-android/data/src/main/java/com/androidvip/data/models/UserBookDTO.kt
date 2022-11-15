package com.androidvip.data.models

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import com.androidvip.domain.BookStatus
import com.androidvip.domain.entities.Note

@Entity(tableName = "books")
class UserBookDTO(
    @PrimaryKey
    override val id: String,

    @ColumnInfo(name = "user_rating")
    var userRating: Float? = null,

    var progress: Float? = 0F,
    var status: Int = BookStatus.NOT_ADDED.value,

    @ColumnInfo(name = "last_status")
    var lastStatus: Long? = System.currentTimeMillis(),

    var favorite: Boolean = false,

    @ColumnInfo(name = "last_status")
    var lastModified: Long? = System.currentTimeMillis(),

    var notes: List<Note>? = emptyList()
) : BookDTO(id) {
    companion object {
        fun fromBook(book: BookDTO) = UserBookDTO(book.id)
    }
}
