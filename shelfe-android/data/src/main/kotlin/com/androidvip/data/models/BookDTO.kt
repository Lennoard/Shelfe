package com.androidvip.data.models

import androidx.room.ColumnInfo
import androidx.room.PrimaryKey

open class BookDTO(
    @PrimaryKey
    open val id: String,

    var title: String? = "",
    var publisher: String? = "",

    @ColumnInfo(name = "published_at")
    var publishedAt: Long? = System.currentTimeMillis(),

    var description: String? = "",
    var isbn: String? = "",

    @ColumnInfo(name = "page_count")
    var pageCount: Int? = 0,

    @ColumnInfo(name = "average_rating")
    var averageRating: Float? = 0F,

    @ColumnInfo(name = "rating_count")
    var ratingCount: Int? = 0,

    var language: String? = "en",

    @ColumnInfo(name = "info_link")
    var infoLink: String? = null,

    var authors: List<String>? = emptyList(),

    @ColumnInfo(name = "image_urls")
    var imageUrls: List<String>? = emptyList(),

    var categories: List<String>? = emptyList()

)
