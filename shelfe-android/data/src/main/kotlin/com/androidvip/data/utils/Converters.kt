package com.androidvip.data.utils

import androidx.room.TypeConverter
import com.androidvip.shelfe.domain.entities.Note
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

class Converters {
    @TypeConverter
    fun fromList(value: List<String>) = Gson().toJson(value)

    @TypeConverter
    fun toList(value: String): List<String> {
        val type = object : TypeToken<List<String>>() {}.type
        return Gson().fromJson(value, type)
    }

    @TypeConverter
    fun fromNote(value: List<Note?>?): String? {
        val type = object : TypeToken<List<Note>>() {}.type
        return kotlin.runCatching {
            Gson().toJson(value, type)
        }.getOrDefault("[]")
    }

    @TypeConverter
    fun toNote(value: String): List<Note>? {
        val type = object : TypeToken<List<Note>>() {}.type
        return Gson().fromJson<List<Note>>(value, type)
    }
}
