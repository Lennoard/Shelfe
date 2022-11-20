package com.androidvip.shelfe.utils

import com.google.android.material.appbar.AppBarLayout
import kotlin.math.abs

abstract class AppBarStateChangeListener : AppBarLayout.OnOffsetChangedListener {

    enum class State {
        EXPANDED, COLLAPSED, IDLE
    }

    private var currentState = State.IDLE

    override fun onOffsetChanged(appBarLayout: AppBarLayout, i: Int) {
        if (i == 0 && currentState != State.EXPANDED) {
            onStateChanged(appBarLayout, State.EXPANDED)
            currentState = State.EXPANDED
        } else if (abs(i) >= appBarLayout.totalScrollRange && currentState != State.COLLAPSED) {
            onStateChanged(appBarLayout, State.COLLAPSED)
            currentState = State.COLLAPSED
        } else if (currentState != State.IDLE) {
            onStateChanged(appBarLayout, State.IDLE)
            currentState = State.IDLE
        }
    }

    abstract fun onStateChanged(
        appBarLayout: AppBarLayout?,
        state: State?
    )
}
