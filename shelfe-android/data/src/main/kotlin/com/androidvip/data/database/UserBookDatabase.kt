package com.androidvip.data.database

import androidx.room.Database
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.androidvip.data.access.UserBookDAO
import com.androidvip.data.models.UserBookDTO
import com.androidvip.data.utils.Converters

const val DATABASE_VERSION = 1

@Database(entities = [UserBookDTO::class], version = DATABASE_VERSION, exportSchema = true)
@TypeConverters(Converters::class)
abstract class UserBookDatabase : RoomDatabase() {
    abstract fun userBookDao(): UserBookDAO
}
