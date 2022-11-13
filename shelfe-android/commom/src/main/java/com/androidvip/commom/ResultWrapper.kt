package com.androidvip.commom

import com.androidvip.commom.ResultWrapper.Error
import com.androidvip.commom.ResultWrapper.Success

sealed class ResultWrapper<out Result, out Error> {
    data class Success<out T>(val data: T) : ResultWrapper<T, Nothing>()
    data class Error<out E>(val error: E) : ResultWrapper<Nothing, E>()
}

val ResultWrapper<*, *>.succeeded
    get() = this is Success && data != null

inline fun <T> ResultWrapper<T, *>.onSuccess(block: (T) -> Unit): ResultWrapper<T, *> {
    if (!succeeded) block((this as Success).data)
    return this
}

inline fun <E> ResultWrapper<*, E>.onError(block: (E) -> Unit): ResultWrapper<*, E> {
    if (!succeeded) block((this as Error).error)
    return this
}

fun <T> ResultWrapper<T, *>.getOrDefault(defaultValue: T): T {
    if (succeeded) return (this as Success).data
    return defaultValue
}
