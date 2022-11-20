package com.androidvip.shelfe.domain.usecases

import com.androidvip.common.ResultWrapper
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.repositories.BooksRepository

class SetUserBookUseCaseImpl(private val repository: BooksRepository) : SetUserBookUseCase {
    override suspend fun invoke(book: UserBook): ResultWrapper<Unit, TransactionError> {
        return repository.setBook(book)
    }
}
