package com.androidvip.data.mappers

import com.androidvip.data.models.VolumesDTO
import com.androidvip.domain.entities.Book
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import org.json.JSONObject

// TODO: base mapper with testable function to parse dates and create string lists
class VolumeMapper {
    fun map(from: VolumesDTO): List<Book> {
        return from.items.map {
            val volume = it.getJSONObject("volume")

            Book(
                id = it.optString("id"),
                title = "${volume.optString("title")} ${volume.optString("subtitle")}",
                publisher = volume.optString("publisher"),
                publishedAt = parseDate(volume.optString("publishedDate")),
                description = volume.optString("description"),
                isbn = runCatching {
                    volume.optJSONArray("industryIdentifiers")
                        ?.getJSONObject(0)
                        ?.optString("identifier")
                }.getOrNull(),
                pageCount = volume.optInt("pageCount"),
                averageRating = volume.optDouble("averageRating", 0.0).toFloat(),
                ratingCount = volume.optInt("ratingsCount", 0),
                language = volume.optString("language"),
                infoLink = volume.optString("infoLink"),
                authors = volume.getStringList("authors"),
                imageUrls = volume.getStringList("imageLinks"),
                categories = volume.getStringList("categories")
            )
        }
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
        return runCatching {
            parser.parse(dateString)
        }.getOrDefault(Date())
    }
}
