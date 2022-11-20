package com.androidvip.shelfe.ui.home

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import com.androidvip.shelfe.databinding.ListItemUserBookBinding
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.ui.base.BaseViewHolder

class UserBookAdapter(
    private val viewModel: HomeViewModel
) : ListAdapter<UserBook, BaseViewHolder<*>>(ParamDiffCallback()) {

    inner class ParamBrowserViewHolder(
        private val binding: ListItemUserBookBinding
    ) : BaseViewHolder<UserBook>(binding) {
        override fun bind(item: UserBook, position: Int) {
            binding.userBook = item
            binding.viewModel = viewModel

            binding.executePendingBindings()
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ParamBrowserViewHolder {
        val inflater = LayoutInflater.from(parent.context)
        val binding = ListItemUserBookBinding.inflate(inflater, parent, false)
        return ParamBrowserViewHolder(binding)
    }

    override fun onBindViewHolder(holder: BaseViewHolder<*>, position: Int) {
        if (holder is ParamBrowserViewHolder) {
            holder.bind(getItem(position), position)
        }
    }

    fun updateData(newList: List<UserBook>) {
        submitList(newList)
    }
}

class ParamDiffCallback : DiffUtil.ItemCallback<UserBook>() {
    override fun areItemsTheSame(oldItem: UserBook, newItem: UserBook): Boolean {
        return oldItem.id == newItem.id
    }

    override fun areContentsTheSame(oldItem: UserBook, newItem: UserBook): Boolean {
        return oldItem == newItem
    }
}
