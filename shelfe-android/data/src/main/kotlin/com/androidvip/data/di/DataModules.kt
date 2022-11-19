package com.androidvip.data.di

import com.androidvip.data.database.UserBookDatabaseManager
import com.androidvip.data.datasources.LocalBookDataSource
import com.androidvip.data.datasources.RemoteBookDataSource
import com.androidvip.data.datasources.VolumeDataSourceImpl
import com.androidvip.data.endpoints.BooksEndpoint
import com.androidvip.data.mappers.UserBookMapper
import com.androidvip.data.mappers.VolumeMapper
import com.androidvip.data.repositories.BooksRepositoryImpl
import com.androidvip.domain.BookSource
import com.androidvip.domain.datasources.BookDataSource
import com.androidvip.domain.datasources.VolumeDataSource
import com.androidvip.domain.repositories.BooksRepository
import com.androidvip.networking.di.SERVICE_BOOKS_API
import com.androidvip.networking.di.provideEndpoint
import org.koin.android.ext.koin.androidContext
import org.koin.core.qualifier.named
import org.koin.dsl.module

val dataModule = module {
    // Mappers
    factory { UserBookMapper() }
    factory { VolumeMapper() }

    // Endpoints
    factory<BooksEndpoint> {
        provideEndpoint(get(SERVICE_BOOKS_API))
    }

    // Data sources
    factory<BookDataSource>(named(BookSource.LOCAL)) {
        LocalBookDataSource(UserBookDatabaseManager.getInstance(androidContext()), get())
    }
    factory<BookDataSource>(named(BookSource.REMOTE)) { RemoteBookDataSource(get()) }
    factory<VolumeDataSource> { VolumeDataSourceImpl(get(), get()) }

    // Repositories
    single<BooksRepository> {
        BooksRepositoryImpl(get(), get(named(BookSource.LOCAL)), get(named(BookSource.REMOTE)))
    }
}
