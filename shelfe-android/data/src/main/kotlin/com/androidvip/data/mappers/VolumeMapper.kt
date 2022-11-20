package com.androidvip.data.mappers

import com.androidvip.data.models.VolumesDTO
import com.androidvip.shelfe.domain.entities.Book
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

// TODO: base mapper with testable function to parse dates and create string lists
class VolumeMapper {
    fun map(from: VolumesDTO): List<Book> {
        if (from.totalItems == 0) return emptyList()

        return from.items?.mapNotNull {
            val volume = it.volumeInfo ?: return@mapNotNull null

            Book(
                id = it.id,
                title = "${volume.title} ${volume.subtitle}",
                publisher = volume.publisher,
                publishedAt = parseDate(volume.publishedDate),
                description = volume.description,
                isbn = runCatching {
                    volume.industryIdentifiers?.first()?.identifier
                }.getOrNull(),
                pageCount = volume.pageCount,
                averageRating = volume.averageRating,
                ratingCount = volume.ratingsCount,
                language = volume.language,
                infoLink = volume.infoLink.orEmpty(),
                authors = volume.authors,
                imageUrls = listOfNotNull(
                    volume.imageLinks?.smallThumbnail,
                    volume.imageLinks?.thumbnail
                ),
                categories = volume.categories
            )
        }.orEmpty()
    }

    private fun JSONObject.getStringList(propName: String): List<String> {
        val array = runCatching {
            getJSONArray(propName)
        }.getOrNull() ?: return emptyList()

        val list = arrayListOf<String>()
        for (i in 0..array.length()) {
            list.add(array.optString(i))
        }
        return list
    }

    private fun parseDate(dateString: String): Date {
        val parser = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
        parser.toLocalizedPattern()
        return runCatching {
            parser.parse(dateString)
        }.getOrDefault(Date())
    }
}
