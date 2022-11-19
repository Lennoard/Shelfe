package com.androidvip.data.access

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import com.androidvip.data.models.UserBookDTO

@Dao
interface UserBookDAO {
    @Query("SELECT * FROM books")
    suspend fun getAll(): List<UserBookDTO>?

    @Query("SELECT * FROM books WHERE id=:bookId")
    suspend fun getById(bookId: String): List<UserBookDTO?>?

    @Insert
    suspend fun insert(book: UserBookDTO)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReplacing(book: UserBookDTO)

    @Update
    suspend fun update(book: UserBookDTO)

    @Delete
    suspend fun delete(user: UserBookDTO)
}
