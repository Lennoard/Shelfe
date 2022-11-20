package com.androidvip.shelfe.utils

import android.app.Activity
import android.view.View
import android.view.inputmethod.InputMethodManager
import androidx.annotation.AttrRes
import com.google.android.material.color.ColorRoles
import com.google.android.material.color.MaterialColors

fun View.getColorRoles(@AttrRes colorAttrRes: Int = androidx.appcompat.R.attr.colorPrimary): ColorRoles {
    val color = MaterialColors.getColor(this, colorAttrRes)
    return MaterialColors.getColorRoles(context, color)
}

fun Activity.hideKeyboard(): Boolean {
    return (getSystemService(Activity.INPUT_METHOD_SERVICE) as InputMethodManager)
        .hideSoftInputFromWindow((currentFocus ?: View(this)).windowToken, 0)
}
