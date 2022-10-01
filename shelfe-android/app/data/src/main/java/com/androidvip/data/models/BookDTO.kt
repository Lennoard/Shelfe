package com.androidvip.data.models

import org.json.JSONObject

data class BookDTO(
    val items: List<JSONObject>,
    val kind: String,
    val totalItems: Int
)
