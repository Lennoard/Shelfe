package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError

interface GetUserBooksUseCase {
    suspend operator fun invoke(userId: String): ResultWrapper<List<UserBook>, TransactionError>
}
