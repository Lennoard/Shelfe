package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.errors.TransactionError

interface SearchBooksUseCase {
    suspend operator fun invoke(query: String): ResultWrapper<List<Book>, TransactionError>
}
