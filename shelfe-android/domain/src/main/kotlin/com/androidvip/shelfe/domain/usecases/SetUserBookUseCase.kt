package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError

interface SetUserBookUseCase {
    suspend operator fun invoke(book: UserBook): ResultWrapper<Unit, TransactionError>
}
