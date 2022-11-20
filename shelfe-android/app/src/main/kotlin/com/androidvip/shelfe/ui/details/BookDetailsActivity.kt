package com.androidvip.shelfe.ui.details

import android.annotation.SuppressLint
import android.content.Intent
import android.content.res.ColorStateList
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.transition.Fade
import android.transition.Slide
import android.view.MenuItem
import android.view.View
import android.view.Window
import android.view.inputmethod.EditorInfo
import android.widget.AdapterView
import android.widget.RatingBar.OnRatingBarChangeListener
import android.widget.Toast
import androidx.appcompat.widget.AppCompatTextView
import androidx.appcompat.widget.Toolbar
import androidx.core.content.ContextCompat
import androidx.core.text.parseAsHtml
import androidx.core.view.ViewCompat
import androidx.core.view.forEach
import androidx.core.view.isInvisible
import androidx.core.view.isVisible
import androidx.core.view.plusAssign
import androidx.lifecycle.lifecycleScope
import com.androidvip.common.onError
import com.androidvip.common.onSuccess
import com.androidvip.shelfe.R
import com.androidvip.shelfe.databinding.ActivityBookDetailsBinding
import com.androidvip.shelfe.domain.BookStatus
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.usecases.SetUserBookUseCase
import com.androidvip.shelfe.ui.base.BaseActivity
import com.androidvip.shelfe.utils.AppBarStateChangeListener
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.google.android.material.appbar.AppBarLayout
import com.google.android.material.chip.Chip
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlinx.coroutines.launch
import org.koin.android.ext.android.inject

class BookDetailsActivity : BaseActivity<ActivityBookDetailsBinding>(
    ActivityBookDetailsBinding::inflate
) {
    private lateinit var book: UserBook
    private val setUserBookUseCase: SetUserBookUseCase by inject()

    override fun onCreate(savedInstanceState: Bundle?) {
        with(window) {
            requestFeature(Window.FEATURE_CONTENT_TRANSITIONS)
            enterTransition = Slide()
            exitTransition = Fade()
        }
        super.onCreate(savedInstanceState)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        binding.appBar.addOnOffsetChangedListener(
            object : AppBarStateChangeListener() {
                override fun onStateChanged(appBarLayout: AppBarLayout?, state: State?) {
                    when (state) {
                        State.COLLAPSED -> { binding.appBarContent.isInvisible = true }
                        State.EXPANDED -> { binding.appBarContent.isInvisible = false }
                        else -> {}
                    }
                }
            }
        )

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getSerializableExtra(EXTRA_BOOK, UserBook::class.java)
        } else {
            intent.getSerializableExtra(EXTRA_BOOK) as? UserBook
        }.let {
            if (it == null) {
                Toast.makeText(this, R.string.book_not_found, Toast.LENGTH_SHORT).show()
                finish()
            } else {
                book = it
                populate()
            }
        }
    }

    override fun onBackPressed() {
        supportFinishAfterTransition()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        if (item.itemId == android.R.id.home) {
            onBackPressed()
            return true
        }
        return super.onOptionsItemSelected(item)
    }

    private fun populate() = with(binding) {
        val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())

        ViewCompat.setTransitionName(bookCover, IMAGE_TRANSITION)
        ViewCompat.setTransitionName(authors, AUTHORS_TRANSITION)
        toolbar.getToolbarTitleAsTextView()!!.let {
            ViewCompat.setTransitionName(it, TITLE_TRANSITION)
        }

        supportActionBar?.title = book.title

        authors.text = book.authors.joinToString()
        description.text = book.description.parseAsHtml()
        publisher.text = book.publisher
        publicationDate.text = dateFormat.format(book.publishedAt)
        pageCount.text = book.pageCount.toString()
        language.text = book.language

        book.categories.map {
            Chip(this@BookDetailsActivity).apply { text = it }
        }.forEach {
            chipGroup += it
        }

        Glide.with(bookCover)
            .load(book.imageUrls.firstOrNull())
            .placeholder(R.drawable.placeholder_image)
            .error(R.drawable.no_image)
            .centerCrop()
            .transition(DrawableTransitionOptions.withCrossFade())
            .diskCacheStrategy(DiskCacheStrategy.ALL)
            .into(bookCover)

        val fabIcon = if (book.statusEnum == BookStatus.NOT_ADDED) {
            R.drawable.ic_add
        } else {
            R.drawable.ic_save
        }
        actionButton.setImageResource(fabIcon)
        actionButton.setOnClickListener {
            if (book.statusEnum == BookStatus.NOT_ADDED) {
                book.statusEnum = BookStatus.PLAN_TO_READ
                book.status = BookStatus.PLAN_TO_READ.value
            }
            saveBook()
        }

        supportStartPostponedEnterTransition()
        populateUserContent()
    }

    private fun saveBook() {
        book.lastStatus = Date()
        lifecycleScope.launch {
            val result = setUserBookUseCase(book)
            result.onSuccess {
                val fabIcon = if (book.statusEnum == BookStatus.NOT_ADDED) {
                    R.drawable.ic_add
                } else {
                    R.drawable.ic_save
                }
                binding.actionButton.setImageResource(fabIcon)
                populateUserContent()
            }

            result.onError {
                Toast.makeText(this@BookDetailsActivity, "Error", Toast.LENGTH_SHORT).show()
            }
        }
    }

    @SuppressLint("SetTextI18n")
    private fun populateUserContent() {
        with(binding.userLayout) {
            root.isVisible = book.statusEnum != BookStatus.NOT_ADDED

            progress.max = book.pageCount
            progress.progress = book.progress.toInt()
            addProgress.setOnClickListener {
                book.progress++
                reloadProgress()
            }
            removeProgress.setOnClickListener {
                book.progress--
                reloadProgress()
            }

            reloadProgress()

            editProgress.setOnClickListener { progressField.isVisible = true }
            progressField.setOnEditorActionListener { _, actionId, _ ->
                if (actionId == EditorInfo.IME_ACTION_DONE) {
                    book.progress = progressField.text.toString().toFloat()
                    progressField.isVisible = false
                    reloadProgress()
                    return@setOnEditorActionListener true
                }
                false
            }

            val dateFormat = SimpleDateFormat("dd/MM/yyyy", Locale.getDefault())
            lastStatusText.text = dateFormat.format(book.lastStatus)
            status.setSelection(book.statusEnum.value)
            status.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
                override fun onItemSelected(
                    parent: AdapterView<*>?,
                    view: View?,
                    position: Int,
                    id: Long
                ) {
                    book.statusEnum = BookStatus[position]
                    book.status = BookStatus[position].value
                }

                override fun onNothingSelected(parent: AdapterView<*>?) = Unit
            }

            ratingBar.progress = book.userRating?.toInt() ?: 0
            ratingBar.onRatingBarChangeListener = OnRatingBarChangeListener { _, rating, fromUser ->
                if (fromUser) {
                    book.userRating = rating
                }
            }

            setUpFavorite()

            delete.setOnClickListener {
                handleDeletePressed()
            }

            share.setOnClickListener {
                val sendIntent = Intent().apply {
                    action = Intent.ACTION_SEND
                    type = "text/plain"
                    putExtra(Intent.EXTRA_TEXT, book.infoLink)
                }
                startActivity(sendIntent)
            }
        }
    }

    private fun handleDeletePressed() {
        MaterialAlertDialogBuilder(this)
            .setTitle(android.R.string.dialog_alert_title)
            .setMessage(R.string.remove_book_warning)
            .setPositiveButton(android.R.string.ok) { _, _ ->
                book.statusEnum = BookStatus.NOT_ADDED
                book.status = BookStatus.NOT_ADDED.value
                saveBook()
            }.setNegativeButton(android.R.string.cancel) { _, _ -> }
            .show()
    }

    private fun reloadProgress() {
        book.progress = book.progress.coerceAtMost(book.pageCount.toFloat())
        binding.userLayout.progress.progress = book.progress.toInt()
        binding.userLayout.progressText.text = "${book.progress.toInt()} / ${book.pageCount}"
        binding.userLayout.progressField.setText(book.progress.toInt().toString())
    }

    private fun setUpFavorite() {
        with(binding.userLayout) {
            favorite.apply {
                if (book.favorite) {
                    setColorFilter(Color.parseColor("#FFC400"))
                    backgroundTintList = ColorStateList.valueOf(Color.parseColor("#FFF8E1"))
                } else {
                    setColorFilter(
                        ContextCompat.getColor(this@BookDetailsActivity, R.color.neutral_800)
                    )
                    setBackgroundColor(
                        ContextCompat.getColor(this@BookDetailsActivity, R.color.neutral_50)
                    )
                }

                setOnClickListener {
                    book.favorite = !book.favorite
                    setUpFavorite()
                }
            }
        }
    }

    private fun Toolbar.getToolbarTitleAsTextView(): AppCompatTextView? {
        forEach { if (it is AppCompatTextView) return it }
        return null
    }

    companion object {
        const val EXTRA_BOOK = "book"
        const val TITLE_TRANSITION = "title"
        const val IMAGE_TRANSITION = "image"
        const val AUTHORS_TRANSITION = "authors"
    }
}
