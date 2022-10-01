package com.androidvip.domain.entities

import java.util.Date

interface BookInterface {
    val id: String
    val title: String
    val publisher: String
    val publishedAt: Date
    val description: String
    val isbn: String?
    val pageCount: Int
    val averageRating: Float
    val ratingCount: Int
    val language: String
    val infoLink: String
    val authors: List<String>
    val imageUrls: List<String>
    val categories: List<String>
}
