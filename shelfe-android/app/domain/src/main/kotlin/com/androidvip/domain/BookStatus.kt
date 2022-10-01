package com.androidvip.domain

enum class BookStatus(val value: Int) {
    NotAdded(-1),
    Dropped(0),
    Reading(1),
    OnHold(2),
    Finished(3),
    PlanToRead(4);

    companion object {
        operator fun get(value: Int): BookStatus {
            return values().find {
                it.value == value
            } ?: NotAdded
        }
    }
}
