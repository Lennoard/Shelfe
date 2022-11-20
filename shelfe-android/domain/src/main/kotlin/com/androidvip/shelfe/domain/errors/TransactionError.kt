package com.androidvip.shelfe.domain.errors

sealed interface TransactionError {
    object NetworkError : TransactionError
    object DatabaseError : TransactionError
    object BookNotFoundError : TransactionError
    object UserNotSingedError : TransactionError
    class UnknownError(val message: String) : TransactionError
}
