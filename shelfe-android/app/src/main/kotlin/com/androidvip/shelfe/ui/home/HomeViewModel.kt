package com.androidvip.shelfe.ui.home

import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.androidvip.common.onError
import com.androidvip.common.onSuccess
import com.androidvip.shelfe.R
import com.androidvip.shelfe.domain.BookStatus
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.domain.errors.TransactionError
import com.androidvip.shelfe.domain.usecases.GetRemoteUserBooksUseCase
import com.androidvip.shelfe.ui.details.BookDetailsActivity
import com.androidvip.shelfe.utils.ViewState
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.launch
import androidx.core.util.Pair as PairUtil

class HomeViewModel(private val getUserBooksUseCase: GetRemoteUserBooksUseCase) : ViewModel() {
    private val _viewState = MutableLiveData<ViewState<UserBook>>()
    val viewState: LiveData<ViewState<UserBook>> = _viewState

    private val _viewEffect = MutableLiveData<HomeViewEffect>()
    val viewEffect: LiveData<HomeViewEffect> = _viewEffect

    fun requestUserBooks() {
        viewModelScope.launch {
            updateState { isLoading = true }

            val result = getUserBooksUseCase(Firebase.auth.currentUser?.uid.orEmpty())

            result.onError(::handleTransactionError)
            result.onSuccess { books ->
                updateState {
                    isLoading = false
                    data = books.filterNot {
                        it.statusEnum == BookStatus.NOT_ADDED
                    }
                }
            }
        }
    }

    private fun handleTransactionError(error: TransactionError) {
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

    fun doWhenBookClicked(book: UserBook, itemLayout: View) {
        val sharedElements = arrayOf<PairUtil<View, String>>(
            PairUtil(itemLayout.findViewById(R.id.title), BookDetailsActivity.TITLE_TRANSITION),
            PairUtil(itemLayout.findViewById(R.id.bookCover), BookDetailsActivity.IMAGE_TRANSITION),
            PairUtil(itemLayout.findViewById(R.id.authors), BookDetailsActivity.AUTHORS_TRANSITION)
        )

        _viewEffect.postValue(HomeViewEffect.NavigateToDetails(book, sharedElements))
    }

    private fun updateState(state: ViewState<UserBook>.() -> Unit) {
        _viewState.value = currentViewState.apply(state)
    }

    private val currentViewState: ViewState<UserBook>
        get() = viewState.value ?: ViewState()
}
