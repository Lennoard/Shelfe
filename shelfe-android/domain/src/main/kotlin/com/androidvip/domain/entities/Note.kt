package com.androidvip.domain.entities

import java.util.Date

data class Note(
    var notes: String = "",
    var createdAt: Date = Date(),
    var chapter: Int = 1
)
