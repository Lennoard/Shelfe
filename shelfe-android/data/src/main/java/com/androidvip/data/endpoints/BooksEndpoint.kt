package com.androidvip.data.endpoints

import com.androidvip.data.models.VolumesDTO
import retrofit2.http.GET
import retrofit2.http.Query

interface BooksEndpoint {

    @GET("volumes")
    suspend fun searchVolumes(
        @Query("q") query: String,
        @Query("startIndex") startIndex: Int = 0,
        @Query("maxResults") maxResults: Int = 1
    ): VolumesDTO
}
