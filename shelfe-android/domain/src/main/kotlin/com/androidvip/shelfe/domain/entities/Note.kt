package com.androidvip.shelfe.domain.entities

import java.io.Serializable
import java.util.Date

class Note(
    var notes: String = "",
    var createdAt: Date = Date(),
    var chapter: Int = 1
) : Serializable
