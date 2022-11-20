package com.androidvip.shelfe.domain.entities

import java.io.Serializable
import java.util.Date

open class Book(
    open var id: String,
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
) : Serializable {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as Book

        if (id != other.id) return false
        if (title != other.title) return false
        if (publisher != other.publisher) return false
        if (publishedAt != other.publishedAt) return false
        if (description != other.description) return false
        if (isbn != other.isbn) return false
        if (pageCount != other.pageCount) return false
        if (language != other.language) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id.hashCode()
        result = 31 * result + title.hashCode()
        result = 31 * result + publisher.hashCode()
        result = 31 * result + publishedAt.hashCode()
        result = 31 * result + description.hashCode()
        result = 31 * result + (isbn?.hashCode() ?: 0)
        result = 31 * result + pageCount
        result = 31 * result + language.hashCode()
        return result
    }
}
