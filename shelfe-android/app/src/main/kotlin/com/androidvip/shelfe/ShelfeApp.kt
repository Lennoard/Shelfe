package com.androidvip.shelfe

import android.app.Application
import com.androidvip.data.di.dataModule
import com.androidvip.domain.di.domainModule
import com.androidvip.networking.di.networkingModule
import org.koin.android.ext.koin.androidContext
import org.koin.android.ext.koin.androidLogger
import org.koin.core.context.startKoin

class ShelfeApp : Application() {
    override fun onCreate() {
        super.onCreate()

        startKoin {
            androidLogger()
            androidContext(this@ShelfeApp)
            modules(domainModule, dataModule, networkingModule)
        }
    }
}
