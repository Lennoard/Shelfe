package com.androidvip.data.models

import androidx.room.ColumnInfo
import androidx.room.PrimaryKey

open class BookDTO(
    @PrimaryKey
    open val id: String,

    val title: String? = "",
    val publisher: String? = "",

    @ColumnInfo(name = "published_at")
    val publishedAt: Long? = System.currentTimeMillis(),

    val description: String? = "",
    val isbn: String? = "",

    @ColumnInfo(name = "page_count")
    val pageCount: Int? = 0,

    @ColumnInfo(name = "average_rating")
    val averageRating: Float? = 0F,

    @ColumnInfo(name = "rating_count")
    val ratingCount: Int? = 0,

    val language: String? = "en",

    @ColumnInfo(name = "info_link")
    val infoLink: String? = null,

    val authors: List<String>? = emptyList(),

    @ColumnInfo(name = "image_urls")
    val imageUrls: List<String>? = emptyList(),

    val categories: List<String>? = emptyList()

)
