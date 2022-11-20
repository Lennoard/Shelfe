package com.androidvip.shelfe.ui.search

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.ListAdapter
import com.androidvip.shelfe.databinding.ListItemVolumeBinding
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.ui.base.BaseViewHolder
import com.androidvip.shelfe.utils.BookDiffCallback

class VolumeAdapter(
    private val viewModel: SearchViewModel
) : ListAdapter<Book, BaseViewHolder<*>>(BookDiffCallback) {

    inner class BookViewHolder(
        private val binding: ListItemVolumeBinding
    ) : BaseViewHolder<Book>(binding) {
        override fun bind(item: Book, position: Int) {
            binding.book = item
            binding.viewModel = viewModel

            binding.executePendingBindings()
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = ListItemVolumeBinding.inflate(inflater, parent, false)
        return BookViewHolder(binding)
    }

    override fun onBindViewHolder(holder: BaseViewHolder<*>, position: Int) {
        if (holder is BookViewHolder) {
            holder.bind(getItem(position), position)
        }
    }

    fun updateData(newList: List<Book>) {
        submitList(newList)
    }
}
