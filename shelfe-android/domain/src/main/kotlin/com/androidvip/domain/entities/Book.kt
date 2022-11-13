package com.androidvip.domain.entities

import java.util.Date

open class Book(
    open val id: String,
    val title: String = "",
    val publisher: String = "",
    val publishedAt: Date = Date(),
    val description: String = "",
    val isbn: String? = "",
    val pageCount: Int = 0,
    val averageRating: Float = 0F,
    val ratingCount: Int = 0,
    val language: String = "en",
    val infoLink: String = "",
    val authors: List<String> = emptyList(),
    val imageUrls: List<String> = emptyList(),
    val categories: List<String> = emptyList()
)
