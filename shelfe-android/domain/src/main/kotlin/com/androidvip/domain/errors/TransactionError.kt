package com.androidvip.domain.errors

sealed interface TransactionError {
    object NetworkError : TransactionError
    object DatabaseError : TransactionError
    object BookNotFoundError : TransactionError
    class UnknownError(message: String) : TransactionError
}
