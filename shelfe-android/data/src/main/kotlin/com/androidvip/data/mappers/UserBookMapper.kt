package com.androidvip.data.mappers

import com.androidvip.data.models.BookDTO
import com.androidvip.data.models.UserBookDTO
import com.androidvip.shelfe.domain.BookStatus
import com.androidvip.shelfe.domain.entities.UserBook
import java.util.Date

class UserBookMapper {
    fun map(from: UserBookDTO): UserBook = UserBook(
        id = from.id,
        userRating = from.userRating,
        progress = from.progress ?: 0F,
        statusEnum = BookStatus[from.status],
        status = from.status,
        lastStatus = runCatching { Date(from.lastStatus ?: 0L) }.getOrDefault(Date()),
        favorite = from.favorite,
        lastModified = runCatching { Date(from.lastModified ?: 0L) }.getOrDefault(Date()),
        notes = from.notes,
        statusRank = 0
    ).apply {
        title = from.title.orEmpty()
        publisher = from.publisher.orEmpty()
        publishedAt = runCatching { Date(from.publishedAt ?: 0L) }.getOrDefault(Date())
        description = from.description.orEmpty()
        isbn = from.isbn
        pageCount = from.pageCount ?: 0
        averageRating = from.averageRating ?: 0F
        ratingCount = from.ratingCount ?: 0
        language = from.language ?: "en"
        infoLink = from.infoLink.orEmpty()
        authors = from.authors.orEmpty()
        imageUrls = from.imageUrls.orEmpty()
        categories = from.categories.orEmpty()
    }

    fun unMap(from: UserBook): UserBookDTO {
        val book = BookDTO(
            id = from.id,
            title = from.title,
            publisher = from.publisher,
            publishedAt = from.publishedAt.time,
            description = from.description,
            isbn = from.isbn,
            pageCount = from.pageCount,
            averageRating = from.averageRating,
            ratingCount = from.ratingCount,
            language = from.language,
            infoLink = from.infoLink,
            authors = from.authors,
            imageUrls = from.imageUrls,
            categories = from.categories,
        )

        return UserBookDTO.fromBook(book).apply {
            userRating = from.userRating
            progress = from.progress
            status = from.status
            lastStatus = from.lastStatus.time
            favorite = from.favorite
            lastModified = from.lastModified.time
            notes = from.notes
        }
    }
}
