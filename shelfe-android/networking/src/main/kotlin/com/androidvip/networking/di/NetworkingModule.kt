package com.androidvip.networking.di

import com.androidvip.networking.ServiceEnum
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import org.koin.core.qualifier.named
import org.koin.dsl.module
import retrofit2.Converter
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

val SERVICE_BOOKS_API = named(ServiceEnum.BOOKS_API)

val networkingModule = module {
    factory { GsonBuilder().setLenient().create() }
    factory<Converter.Factory> { GsonConverterFactory.create(get()) }
    factory { HttpLoggingInterceptor().setLevel(HttpLoggingInterceptor.Level.BODY) }
    factory { provideHttpClient(get()) }
    factory(SERVICE_BOOKS_API) {
        provideRetrofit(ServiceEnum.BOOKS_API.baseUrl, get(), get())
    }
}

private fun provideRetrofit(
    baseUrl: String,
    okHttpClient: OkHttpClient,
    converterFactory: Converter.Factory
): Retrofit {
    return Retrofit.Builder()
        .baseUrl(baseUrl)
        .client(okHttpClient)
        .addConverterFactory(converterFactory)
        .build()
}

private fun provideHttpClient(loggingInterceptor: HttpLoggingInterceptor): OkHttpClient {
    val httpClientBuilder = OkHttpClient().newBuilder()
        .writeTimeout(20L, TimeUnit.SECONDS)
        .readTimeout(20L, TimeUnit.SECONDS)
        .connectTimeout(30L, TimeUnit.SECONDS)

    return httpClientBuilder
        .addNetworkInterceptor(loggingInterceptor)
        .build()
}

inline fun <reified T> provideEndpoint(retrofit: Retrofit): T {
    return retrofit.create(T::class.java)
}
