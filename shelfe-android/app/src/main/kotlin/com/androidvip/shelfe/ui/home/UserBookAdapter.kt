package com.androidvip.shelfe.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.ListAdapter
import com.androidvip.shelfe.databinding.ListItemUserBookBinding
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.ui.base.BaseViewHolder
import com.androidvip.shelfe.utils.UserBookDiffCallback

class UserBookAdapter(
    private val viewModel: HomeViewModel
) : ListAdapter<UserBook, BaseViewHolder<*>>(UserBookDiffCallback) {

    inner class UserBookViewHolder(
        private val binding: ListItemUserBookBinding
    ) : BaseViewHolder<UserBook>(binding) {
        override fun bind(item: UserBook, position: Int) {
            binding.userBook = item
            binding.viewModel = viewModel

            binding.executePendingBindings()
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): UserBookViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = ListItemUserBookBinding.inflate(inflater, parent, false)
        return UserBookViewHolder(binding)
    }

    override fun onBindViewHolder(holder: BaseViewHolder<*>, position: Int) {
        if (holder is UserBookViewHolder) {
            holder.bind(getItem(position), position)
        }
    }

    fun updateData(newList: List<UserBook>) {
        submitList(newList)
    }
}
