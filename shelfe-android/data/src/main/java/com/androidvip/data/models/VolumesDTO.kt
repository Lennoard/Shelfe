package com.androidvip.data.models

import org.json.JSONObject

data class VolumesDTO(
    val items: List<JSONObject>,
    val kind: String,
    val totalItems: Int
)
