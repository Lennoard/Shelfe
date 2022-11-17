package com.androidvip.common

import java.util.Calendar
import java.util.Date
import java.util.UUID
import java.util.concurrent.ThreadLocalRandom

object DataFactory {
    fun randomString() = UUID.randomUUID().toString()

    fun randomInt(
        origin: Int = 0,
        max: Int = 1000 + 1
    ) = ThreadLocalRandom.current().nextInt(origin, max)

    fun randomLong(origin: Int = 0) = randomInt(origin).toLong()

    fun randomFloat() = randomInt().toFloat()

    fun randomBoolean() = Math.random() < 0.5

    private fun randomCalendar(): Calendar = Calendar.getInstance().apply {
        set(
            Calendar.YEAR,
            randomInt(1970, Calendar.getInstance().get(Calendar.YEAR) + 1)
        )
        set(Calendar.MONTH, randomInt(Calendar.JANUARY, Calendar.DECEMBER + 1))
        set(Calendar.DAY_OF_MONTH, randomInt(1, 29))
        set(Calendar.MILLISECOND, 0)
    }

    fun randomDate(): Date = randomCalendar().time
}
