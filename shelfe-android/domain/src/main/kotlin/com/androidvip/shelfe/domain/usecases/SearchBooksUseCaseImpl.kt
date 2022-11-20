package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.repositories.BooksRepository

class SearchBooksUseCaseImpl(private val repository: BooksRepository) : SearchBooksUseCase {
    override suspend fun invoke(query: String): ResultWrapper<List<Book>, TransactionError> {
        return repository.search(query)
    }
}
