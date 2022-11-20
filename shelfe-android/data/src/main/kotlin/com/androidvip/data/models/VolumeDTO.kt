package com.androidvip.data.models

data class VolumeDTO(
    var id: String,
    var kind: String = "books#volume",
    var volumeInfo: VolumeInfoDTO? = null
)
