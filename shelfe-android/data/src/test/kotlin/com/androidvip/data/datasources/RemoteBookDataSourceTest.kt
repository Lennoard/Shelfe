package com.androidvip.data.datasources

import com.androidvip.common.DataFactory
import com.androidvip.data.utils.BookStubs
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.UserNotSignedInException
import com.google.firebase.firestore.FirebaseFirestore
import io.mockk.coEvery
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.tasks.await
import org.junit.Assert
import org.junit.Before
import org.junit.Test

class RemoteBookDataSourceTest {
    private lateinit var dataSource: RemoteBookDataSource
    private val firestore: FirebaseFirestore = mockk(relaxed = true)

    @Before
    fun setUp() {
        dataSource = RemoteBookDataSource(firestore)
    }

    @Test
    fun `given (book id, no root path) when (get book by id) then (throw user not signed in exception)`() =
        runBlocking {
            // Given
            val bookId = DataFactory.randomString()
            dataSource.setRootPath("")

            // Then
            Assert.assertThrows(UserNotSignedInException::class.java) {
                // When
                runBlocking { dataSource.getBook(bookId) }
            }
            Unit
        }

    @Test
    fun `given (book id, root path, no book in data base) when (get book by id) then (return null)`() =
        runBlocking {
            // Given
            val bookId = DataFactory.randomString()
            dataSource.setRootPath(DataFactory.randomString())
            coEvery {
                firestore.collection("users")
                    .document(bookId)
                    .collection("books")
                    .document(bookId)
                    .get()
                    .await()
                    .toObject(UserBook::class.java)
            } returns null

            // When
            val result = dataSource.getBook(bookId)

            // Then
            Assert.assertNull(result)
            verify { firestore.collection(any()) }
        }

    @Test
    fun `given (book id, root path) when (get book by id) then (return book)`() =
        runBlocking {
            // Given
            val bookId = DataFactory.randomString()
            dataSource.setRootPath(DataFactory.randomString())
            coEvery {
                dataSource.booksCollection
                    .document(bookId)
                    .get()
                    .await()
                    .toObject(UserBook::class.java)
            } returns BookStubs.randomBook(bookId)

            // When
            val result = dataSource.getBook(bookId)

            // Then
            Assert.assertNotNull(result)
            Assert.assertEquals(bookId, result?.id)
            verify { firestore.collection(any()) }
        }

    fun `given (root path) when (get books) then (return book list)`() =
        runBlocking {
            // Given
            val listSize = DataFactory.randomInt(origin = 1, max = 50)
            dataSource.setRootPath(DataFactory.randomString())
            val list = (0 until listSize).map { index ->
                BookStubs.randomBook(bookId = index.toString())
            }

            coEvery {
                dataSource.booksCollection
                    .get()
                    .await()
                    .toObjects(UserBook::class.java)
            } returns list

            // When
            val result = dataSource.getBooks(null)

            // Then
            Assert.assertTrue(result.isNotEmpty())
            Assert.assertEquals(listSize, result.size)
        }
}
