package com.androidvip.shelfe.utils

import androidx.recyclerview.widget.DiffUtil
import com.androidvip.shelfe.domain.entities.Book

object BookDiffCallback : DiffUtil.ItemCallback<Book>() {
    override fun areItemsTheSame(oldItem: Book, newItem: Book): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: Book, newItem: Book): Boolean {
        return oldItem == newItem
    }
}
