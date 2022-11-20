package com.androidvip.shelfe.utils

import android.view.View
import androidx.annotation.AttrRes
import com.google.android.material.color.ColorRoles
import com.google.android.material.color.MaterialColors

fun View.getColorRoles(@AttrRes colorAttrRes: Int = androidx.appcompat.R.attr.colorPrimary): ColorRoles {
    val color = MaterialColors.getColor(this, colorAttrRes)
    return MaterialColors.getColorRoles(context, color)
}
