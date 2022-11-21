package com.androidvip.shelfe.ui.search

import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.androidvip.common.onError
import com.androidvip.common.onSuccess
import com.androidvip.shelfe.R
import com.androidvip.shelfe.domain.entities.Book
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.usecases.SearchBooksUseCase
import com.androidvip.shelfe.ui.details.BookDetailsActivity
import com.androidvip.shelfe.ui.home.HomeViewEffect
import kotlinx.coroutines.launch
import androidx.core.util.Pair as PairUtil

class SearchViewModel(private val searchBooksUseCase: SearchBooksUseCase) : ViewModel() {
    private val _viewState = MutableLiveData<SearchViewState>()
    val viewState: LiveData<SearchViewState> = _viewState

    private val _viewEffect = MutableLiveData<HomeViewEffect>()
    val viewEffect: LiveData<HomeViewEffect> = _viewEffect

    fun performSearch(query: String) {
        viewModelScope.launch {
            updateState { isLoading = true }

            val result = searchBooksUseCase(query)

            result.onError(::handleError)
            result.onSuccess { books ->
                updateState {
                    isLoading = false
                    data = books
                    showEmptyState = books.isEmpty()
                    showSearch = false
                }
            }
        }
    }

    private fun handleError(error: TransactionError) {
        updateState { isLoading = false }

        when (error) {
            TransactionError.BookNotFoundError -> _viewEffect.postValue(
                HomeViewEffect.ShowError(R.string.book_not_found)
            )
            TransactionError.DatabaseError -> _viewEffect.postValue(
                HomeViewEffect.ShowError(R.string.database_error)
            )
            TransactionError.NetworkError -> _viewEffect.postValue(
                HomeViewEffect.ShowError(R.string.network_error)
            )
            TransactionError.UserNotSingedError -> _viewEffect.postValue(
                HomeViewEffect.ShowError(R.string.please_sign_in)
            )
            is TransactionError.UnknownError -> _viewEffect.postValue(
                HomeViewEffect.ShowErrorString(error.message)
            )
        }
    }

    fun doWhenBookClicked(book: Book, itemLayout: View) {
        val sharedElements = arrayOf<PairUtil<View, String>>(
            PairUtil(itemLayout.findViewById(R.id.title), BookDetailsActivity.TITLE_TRANSITION),
            PairUtil(itemLayout.findViewById(R.id.bookCover), BookDetailsActivity.IMAGE_TRANSITION),
            PairUtil(itemLayout.findViewById(R.id.authors), BookDetailsActivity.AUTHORS_TRANSITION)
        )

        _viewEffect.postValue(
            HomeViewEffect.NavigateToDetails(UserBook.fromBook(book), sharedElements)
        )
    }

    private fun updateState(state: SearchViewState.() -> Unit) {
        _viewState.value = currentViewState.apply(state)
    }

    fun reset() {
        updateState {
            isLoading = false
            data = emptyList()
            showEmptyState = false
            showSearch = true
        }
    }

    fun onStop() {
        _viewEffect.postValue(HomeViewEffect.Idle)
    }

    private val currentViewState: SearchViewState
        get() = viewState.value ?: SearchViewState()
}
