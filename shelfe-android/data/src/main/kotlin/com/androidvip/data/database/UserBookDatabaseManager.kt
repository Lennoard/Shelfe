package com.androidvip.data.database

import android.content.Context
import androidx.room.Room

object UserBookDatabaseManager {
    @Volatile
    private var INSTANCE: UserBookDatabase? = null

    fun getInstance(context: Context): UserBookDatabase {
        return INSTANCE ?: synchronized(this) {
            INSTANCE ?: buildDatabase(context.applicationContext).also {
                INSTANCE = it
            }
        }
    }

    private fun buildDatabase(applicationContext: Context): UserBookDatabase {
        return Room.databaseBuilder(
            applicationContext,
            UserBookDatabase::class.java,
            "books"
        ).build()
    }
}
