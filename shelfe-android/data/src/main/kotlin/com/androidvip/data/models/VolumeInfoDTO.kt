package com.androidvip.data.models

data class VolumeInfoDTO(
    var title: String = "",
    var subtitle: String = "",
    var authors: List<String> = emptyList(),
    var categories: List<String> = emptyList(),
    var description: String = "",
    var publisher: String = "",
    var publishedDate: String = "2022/02/02",
    var industryIdentifiers: List<IndustryIdentifiers>? = emptyList(),
    var pageCount: Int = 0,
    var ratingsCount: Int = 0,
    var averageRating: Float = 0F,
    var imageLinks: ImageLinksDTO? = ImageLinksDTO(),
    var language: String = "en",
    var infoLink: String? = ""
)
