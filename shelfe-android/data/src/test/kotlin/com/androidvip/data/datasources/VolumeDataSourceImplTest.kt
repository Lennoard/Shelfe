package com.androidvip.data.datasources

import com.androidvip.common.DataFactory
import com.androidvip.data.endpoints.BooksEndpoint
import com.androidvip.data.mappers.VolumeMapper
import com.androidvip.data.models.VolumesDTO
import io.mockk.coEvery
import io.mockk.coVerifyOrder
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import org.junit.Assert
import org.junit.Before
import org.junit.Test

class VolumeDataSourceImplTest {
    private lateinit var dataSource: VolumeDataSourceImpl
    private val mapper: VolumeMapper = mockk(relaxed = true)
    private val endpoint: BooksEndpoint = mockk(relaxed = true)

    @Before
    fun setUp() {
        dataSource = VolumeDataSourceImpl(endpoint, mapper)
    }

    @Test
    fun `given (query, max, start, empty response) when (searched) then (return empty book list)`() = runBlocking {
        // Given
        val query = "q=harryPotter"
        val max = DataFactory.randomInt(1, 30)
        val start = DataFactory.randomInt(max = 30)
        val sampleResponse = VolumesDTO(
            items = listOf(),
            kind = "volumes",
            totalItems = 0
        )
        coEvery { endpoint.searchVolumes(query, max, start) } returns sampleResponse

        // When
        val result = dataSource.search(query, max, start)

        // Then
        Assert.assertTrue(result.isEmpty())
        coVerifyOrder {
            endpoint.searchVolumes(query, max, start)
            mapper.map(sampleResponse)
        }
    }
}
