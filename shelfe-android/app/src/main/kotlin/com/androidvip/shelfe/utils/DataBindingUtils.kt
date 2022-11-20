package com.androidvip.shelfe.utils

import android.annotation.SuppressLint
import androidx.appcompat.widget.AppCompatImageView
import androidx.appcompat.widget.AppCompatTextView
import androidx.databinding.BindingAdapter
import com.androidvip.shelfe.R
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.entities.UserBook
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@BindingAdapter("binding:bookImageUrl")
fun AppCompatImageView.setBookImage(book: Book) {
    val url = book.imageUrls.firstOrNull()
    Glide.with(this)
        .load(url)
        .placeholder(R.drawable.placeholder_image)
        .centerCrop()
        .error(R.drawable.no_image)
        .transition(DrawableTransitionOptions.withCrossFade())
        .diskCacheStrategy(DiskCacheStrategy.ALL)
        .into(this)
}

@BindingAdapter("binding:bookAuthors")
fun AppCompatTextView.setBookAuthors(authors: List<String>) {
    text = authors.joinToString()
}

@BindingAdapter("binding:bookDate")
fun AppCompatTextView.setBookDate(date: Date) {
    val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
    text = dateFormat.format(date)
}

@SuppressLint("SetTextI18n")
@BindingAdapter("binding:progressText")
fun AppCompatTextView.setProgressText(userBook: UserBook) {
    text = "${userBook.progress.toInt()} / ${userBook.pageCount}"
}
