package com.androidvip.shelfe.di

import com.androidvip.shelfe.ui.home.HomeViewModel
import com.androidvip.shelfe.ui.search.SearchViewModel
import org.koin.androidx.viewmodel.dsl.viewModel
import org.koin.dsl.module

val presentationModule = module {
    viewModel { HomeViewModel(get()) }
    viewModel { SearchViewModel(get()) }
}
