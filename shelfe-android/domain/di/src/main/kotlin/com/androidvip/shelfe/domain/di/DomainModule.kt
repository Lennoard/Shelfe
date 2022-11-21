package com.androidvip.shelfe.domain.di

import com.androidvip.shelfe.domain.usecases.GetRemoteUserBooksUseCase
import com.androidvip.shelfe.domain.usecases.GetRemoteUserBooksUseCaseImpl
import com.androidvip.shelfe.domain.usecases.SearchBooksUseCase
import com.androidvip.shelfe.domain.usecases.SearchBooksUseCaseImpl
import com.androidvip.shelfe.domain.usecases.SetUserBookUseCase
import com.androidvip.shelfe.domain.usecases.SetUserBookUseCaseImpl
import org.koin.dsl.module

val domainModule = module {
    // Use cases
    factory<GetRemoteUserBooksUseCase> {
        GetRemoteUserBooksUseCaseImpl(get())
    }

    factory<SetUserBookUseCase> {
        SetUserBookUseCaseImpl(get())
    }

    factory<SearchBooksUseCase> {
        SearchBooksUseCaseImpl(get())
    }
}
