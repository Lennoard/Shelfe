package com.androidvip.networking

enum class ServiceEnum {
    BOOKS_API;

    val baseUrl: String
        get() = when (this) {
            BOOKS_API -> "https://www.googleapis.com/books/v1/"
        }
}
