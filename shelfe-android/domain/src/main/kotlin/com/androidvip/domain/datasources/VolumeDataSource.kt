package com.androidvip.domain.datasources

import com.androidvip.domain.entities.Book

interface VolumeDataSource {
    suspend fun search(query: String, startIndex: Int = 0, maxResults: Int = 40): List<Book>
}
