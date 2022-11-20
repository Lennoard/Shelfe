package com.androidvip.shelfe.ui.home

import android.view.View
import androidx.annotation.StringRes
import com.androidvip.shelfe.domain.entities.UserBook
import androidx.core.util.Pair as PairUtil

sealed interface HomeViewEffect {
    class ShowError(@StringRes val stringRes: Int) : HomeViewEffect
    class ShowErrorString(val error: String) : HomeViewEffect
    class NavigateToDetails(
        val userBook: UserBook,
        val sharedElements: Array<PairUtil<View, String>>
    ) : HomeViewEffect
}
