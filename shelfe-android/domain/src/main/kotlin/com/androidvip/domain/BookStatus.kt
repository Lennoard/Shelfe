package com.androidvip.domain

enum class BookStatus(val value: Int) {
    NOT_ADDED(-1),
    DROPPED(0),
    READING(1),
    ON_HOLD(2),
    FINISHED(3),
    PLAN_TO_READ(4);

    companion object {
        operator fun get(value: Int): BookStatus {
            return values().find {
                it.value == value
            } ?: NOT_ADDED
        }
    }
}
