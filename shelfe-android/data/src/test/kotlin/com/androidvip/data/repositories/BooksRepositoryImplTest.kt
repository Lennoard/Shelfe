package com.androidvip.data.repositories

import com.androidvip.common.DataFactory
import com.androidvip.common.getOrNull
import com.androidvip.common.onError
import com.androidvip.data.datasources.LocalBookDataSource
import com.androidvip.data.datasources.RemoteBookDataSource
import com.androidvip.data.datasources.VolumeDataSourceImpl
import com.androidvip.shelfe.domain.BookSource
import com.androidvip.shelfe.domain.errors.BookNotFoundException
import com.androidvip.shelfe.domain.errors.TransactionError
import io.mockk.called
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.Assert
import org.junit.Before
import org.junit.Test

class BooksRepositoryImplTest {
    private lateinit var repository: BooksRepositoryImpl
    private val localDataSource: LocalBookDataSource = mockk(relaxed = true)
    private val remoteDataSource: RemoteBookDataSource = mockk(relaxed = true)
    private val volumeDataSource: VolumeDataSourceImpl = mockk(relaxed = true)

    @Before
    fun setUp() {
        repository = BooksRepositoryImpl(volumeDataSource, localDataSource, remoteDataSource)
    }

    @Test
    fun `given (no query, local source) when (get books) then (return data from local source)`() =
        runBlocking {
            // Given
            val query: String? = null
            val source = BookSource.LOCAL
            coEvery { localDataSource.getBooks(query) } returns emptyList()

            // When
            val result = repository.getBooks(query, source)

            // Then
            Assert.assertNotNull(result.getOrNull())
            coVerify(exactly = 1) { localDataSource.getBooks(query) }
            coVerify {
                remoteDataSource wasNot called
                volumeDataSource wasNot called
            }
        }

    @Test
    fun `given (query, remote source, throws error) when (get books) then (return error result)`() =
        runBlocking {
            // Given
            val query = DataFactory.randomString()
            val source = BookSource.REMOTE
            coEvery { remoteDataSource.getBooks(query) } throws BookNotFoundException()

            // When
            val result = repository.getBooks(query, source)

            // Then
            result.onError { error ->
                Assert.assertTrue(error is TransactionError.BookNotFoundError)
            }
            coVerify(exactly = 1) { remoteDataSource.getBooks(query) }
            coVerify {
                localDataSource wasNot called
                volumeDataSource wasNot called
            }
        }
}
