package com.androidvip.data.datasources

import com.androidvip.common.DataFactory
import com.androidvip.data.database.UserBookDatabase
import com.androidvip.data.mappers.UserBookMapper
import com.androidvip.data.utils.BookStubs
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.Assert
import org.junit.Before
import org.junit.Test

class LocalBookDataSourceTest {
    private lateinit var dataSource: LocalBookDataSource
    private val db: UserBookDatabase = mockk(relaxed = true)
    private val mapper: UserBookMapper = UserBookMapper()

    @Before
    fun setUp() {
        dataSource = LocalBookDataSource(db, mapper)
    }

    @Test
    fun `given (empty database) when (get books) then (return empty list)`() = runBlocking {
        // Given
        coEvery { db.userBookDao().getAll() } returns null

        // When
        val result = dataSource.getBooks("")

        // Then
        Assert.assertTrue(result.isEmpty())
    }

    @Test
    fun `given (one book in database) when (get books) then (return singleton list)`() = runBlocking {
        // Given
        val bookId = DataFactory.randomString()
        coEvery {
            db.userBookDao().getAll()
        } returns listOf(mapper.unMap(BookStubs.randomBook(bookId)))

        // When
        val result = dataSource.getBooks("")

        // Then
        Assert.assertTrue(result.size == 1)
        Assert.assertEquals(bookId, result.first().id)
        coVerify {
            db.userBookDao().getAll()
        }
    }

    @Test
    fun `given (book in database, book id) when (get book) then (return book)`() = runBlocking {
        // Given
        val bookId = DataFactory.randomString()
        coEvery {
            db.userBookDao().getById(bookId)
        } returns listOf(mapper.unMap(BookStubs.randomBook(bookId)))

        // When
        val result = dataSource.getBook(bookId)

        // Then
        Assert.assertNotNull(result)
        coVerify {
            db.userBookDao().getById(bookId)
        }
    }

    @Test
    fun `given (no book in database, book id) when (get book) then (return null)`() = runBlocking {
        // Given
        val bookId = DataFactory.randomString()
        coEvery { db.userBookDao().getById(bookId) } returns null

        // When
        val result = dataSource.getBook(bookId)

        // Then
        Assert.assertNull(result)
        coVerify { db.userBookDao().getById(bookId) }
    }
}
