package com.androidvip.domain.entities

import java.util.Date

data class Book(
    override val id: String,
    override val title: String = "",
    override val publisher: String = "",
    override val publishedAt: Date = Date(),
    override val description: String = "",
    override val isbn: String? = "",
    override val pageCount: Int = 0,
    override val averageRating: Float = 0F,
    override val ratingCount: Int = 0,
    override val language: String = "en",
    override val infoLink: String = "",
    override val authors: List<String> = emptyList(),
    override val imageUrls: List<String> = emptyList(),
    override val categories: List<String> = emptyList()
) : BookInterface
