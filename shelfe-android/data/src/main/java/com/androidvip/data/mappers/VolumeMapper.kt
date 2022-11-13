package com.androidvip.data.mappers

import com.androidvip.data.models.VolumesDTO
import com.androidvip.domain.entities.Book
import java.util.Date

// TODO: base mapper with testable function to parse dates and create string lists
class VolumeMapper {
    // TODO
    fun map(from: VolumesDTO): List<Book> {
        return from.items.map {
            Book(
                id = "",
                title = "",
                publisher = "",
                publishedAt = Date(),
                description = "",
                isbn = null,
                pageCount = 0,
                averageRating = 5F,
                ratingCount = 0,
                language = "en",
                infoLink = "",
                authors = emptyList(),
                imageUrls = emptyList(),
                categories = emptyList()
            )
        }
    }
}
