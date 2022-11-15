package com.androidvip.data.utils

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Date

class Converters {
    @TypeConverter
    fun fromList(value: List<String>) = Gson().toJson(value)

    @TypeConverter
    fun toList(value: String): List<String> {
        val type = object : TypeToken<List<String>>() {}.type
        return Gson().fromJson(value, type)
    }

    @TypeConverter
    fun fromTimestamp(value: Long?): Date? = runCatching {
        Date(value!!)
    }.getOrNull()

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? = date?.time
}
