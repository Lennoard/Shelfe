package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.BookSource
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.repositories.BooksRepository

class GetUserBooksUseCaseImpl(private val repository: BooksRepository) : GetUserBooksUseCase {
    override suspend operator fun invoke(
        userId: String
    ): ResultWrapper<List<UserBook>, TransactionError> {
        repository.setUserId(userId)
        return repository.getBooks(null, BookSource.REMOTE)
    }
}
