package com.androidvip.shelfe.utils

import androidx.recyclerview.widget.DiffUtil
import com.androidvip.shelfe.domain.entities.UserBook

object UserBookDiffCallback : DiffUtil.ItemCallback<UserBook>() {
    override fun areItemsTheSame(oldItem: UserBook, newItem: UserBook): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: UserBook, newItem: UserBook): Boolean {
        return oldItem == newItem
    }
}
