package com.androidvip.domain.entities

import java.util.Date

open class Book(
    open val id: String,
    var title: String = "",
    var publisher: String = "",
    var publishedAt: Date = Date(),
    var description: String = "",
    var isbn: String? = "",
    var pageCount: Int = 0,
    var averageRating: Float = 0F,
    var ratingCount: Int = 0,
    var language: String = "en",
    var infoLink: String = "",
    var authors: List<String> = emptyList(),
    var imageUrls: List<String> = emptyList(),
    var categories: List<String> = emptyList()
)
