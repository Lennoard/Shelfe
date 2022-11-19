package com.androidvip.data.datasources

import com.androidvip.data.endpoints.BooksEndpoint
import com.androidvip.data.mappers.VolumeMapper
import com.androidvip.domain.datasources.VolumeDataSource
import com.androidvip.domain.entities.Book

class VolumeDataSourceImpl(
    private val endpoint: BooksEndpoint,
    private val volumeMapper: VolumeMapper
) : VolumeDataSource {
    override suspend fun search(query: String, startIndex: Int, maxResults: Int): List<Book> {
        val volumeData = endpoint.searchVolumes(query, startIndex, maxResults)
        return volumeMapper.map(volumeData)
    }
}
