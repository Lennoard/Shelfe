package com.androidvip.shelfe.ui.search

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.view.WindowManager
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.core.app.ActivityOptionsCompat
import androidx.core.util.Pair
import androidx.core.view.isVisible
import androidx.recyclerview.widget.GridLayoutManager
import com.androidvip.shelfe.databinding.FragmentSearchBinding
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.ui.base.BaseViewBindingFragment
import com.androidvip.shelfe.ui.details.BookDetailsActivity
import com.androidvip.shelfe.ui.home.HomeViewEffect
import com.androidvip.shelfe.utils.getColorRoles
import com.androidvip.shelfe.utils.hideKeyboard
import org.koin.androidx.viewmodel.ext.android.viewModel

class SearchFragment : BaseViewBindingFragment<FragmentSearchBinding>(
    FragmentSearchBinding::inflate
) {
    private val viewModel: SearchViewModel by viewModel()
    private val volumeAdapter: VolumeAdapter by lazy { VolumeAdapter(viewModel) }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        requireActivity().window.setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_NOTHING)

        with(viewModel) {
            viewState.observe(viewLifecycleOwner, ::renderState)
            viewEffect.observe(viewLifecycleOwner, ::handleViewEffect)
        }

        binding.swipeLayout.apply {
            val roles = getColorRoles()
            setColorSchemeColors(roles.accent)
            setProgressBackgroundColorSchemeColor(roles.accentContainer)
            isEnabled = false
        }

        binding.recyclerView.apply {
            setHasFixedSize(true)
            layoutManager = GridLayoutManager(this.context, recyclerViewColumns)
            adapter = volumeAdapter
        }

        binding.emptyStateBack.setOnClickListener {
            viewModel.reset()
        }

        binding.searchField.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                viewModel.performSearch(binding.searchField.text.toString())
                requireActivity().hideKeyboard()
                return@setOnEditorActionListener true
            }
            false
        }

        requireActivity().onBackPressedDispatcher.addCallback(
            viewLifecycleOwner,
            object :
                OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    viewModel.reset()
                }
            }
        )
    }

    override fun onStop() {
        super.onStop()
        viewModel.onStop()
    }

    private fun renderState(viewState: SearchViewState) {
        binding.swipeLayout.isRefreshing = viewState.isLoading

        binding.emptyStateLayout.isVisible = viewState.showEmptyState
        binding.searchLayout.isVisible = viewState.showSearch
        binding.recyclerView.isVisible = viewState.data.isNotEmpty()

        volumeAdapter.updateData(viewState.data)
    }

    private fun handleViewEffect(viewEffect: HomeViewEffect) {
        when (viewEffect) {
            is HomeViewEffect.NavigateToDetails -> navigateToDetails(
                viewEffect.book,
                viewEffect.sharedElements
            )
            is HomeViewEffect.ShowError -> {
                Toast.makeText(requireContext(), viewEffect.stringRes, Toast.LENGTH_LONG).show()
            }
            is HomeViewEffect.ShowErrorString -> {
                Toast.makeText(requireContext(), viewEffect.error, Toast.LENGTH_LONG).show()
            }

            is HomeViewEffect.Idle -> {}
        }
    }

    private fun navigateToDetails(book: UserBook, sharedElements: Array<Pair<View, String>>) {
        val options: ActivityOptionsCompat = ActivityOptionsCompat.makeSceneTransitionAnimation(
            requireActivity(),
            *sharedElements
        )

        Intent(requireContext(), BookDetailsActivity::class.java).apply {
            putExtra(BookDetailsActivity.EXTRA_BOOK, book)
            startActivity(this, options.toBundle())
        }
    }
}
