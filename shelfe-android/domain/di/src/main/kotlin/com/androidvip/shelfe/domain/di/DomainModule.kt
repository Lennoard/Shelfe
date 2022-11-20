package com.androidvip.shelfe.domain.di

import com.androidvip.shelfe.domain.usecases.GetUserBooksUseCase
import com.androidvip.shelfe.domain.usecases.GetUserBooksUseCaseImpl
import com.androidvip.shelfe.domain.usecases.SetUserBookUseCase
import com.androidvip.shelfe.domain.usecases.SetUserBookUseCaseImpl
import org.koin.dsl.module

val domainModule = module {
    // Use cases
    factory<GetUserBooksUseCase> {
        GetUserBooksUseCaseImpl(get())
    }

    factory<SetUserBookUseCase> {
        SetUserBookUseCaseImpl(get())
    }
}
