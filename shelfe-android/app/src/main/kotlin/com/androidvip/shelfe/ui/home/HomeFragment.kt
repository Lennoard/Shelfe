package com.androidvip.shelfe.ui.home

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.core.app.ActivityOptionsCompat
import androidx.recyclerview.widget.GridLayoutManager
import com.androidvip.shelfe.databinding.FragmentHomeBinding
import com.androidvip.shelfe.domain.entities.UserBook
import com.androidvip.shelfe.ui.base.BaseViewBindingFragment
import com.androidvip.shelfe.ui.details.BookDetailsActivity
import com.androidvip.shelfe.utils.ViewState
import com.androidvip.shelfe.utils.getColorRoles
import org.koin.androidx.viewmodel.ext.android.viewModel
import androidx.core.util.Pair as PairUtil

class HomeFragment :
    BaseViewBindingFragment<FragmentHomeBinding>(FragmentHomeBinding::inflate) {

    private val userBookAdapter: UserBookAdapter by lazy { UserBookAdapter(viewModel) }
    private val viewModel: HomeViewModel by viewModel()

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        with(viewModel) {
            viewState.observe(viewLifecycleOwner, ::renderState)
            viewEffect.observe(viewLifecycleOwner, ::handleViewEffect)
        }

        binding.swipeLayout.apply {
            val roles = getColorRoles()
            setColorSchemeColors(roles.accent)
            setProgressBackgroundColorSchemeColor(roles.accentContainer)
            setOnRefreshListener {
                refresh()
            }
        }

        binding.recyclerView.apply {
            setHasFixedSize(true)
            layoutManager = GridLayoutManager(this.context, recyclerViewColumns)
            adapter = userBookAdapter
        }
    }

    override fun onStart() {
        super.onStart()
        refresh()
    }

    private fun refresh() {
        viewModel.requestUserBooks()
    }

    private fun renderState(viewState: ViewState<UserBook>) {
        binding.swipeLayout.isRefreshing = viewState.isLoading
        userBookAdapter.updateData(viewState.data)
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
            HomeViewEffect.Idle -> { }
        }
    }

    private fun navigateToDetails(book: UserBook, sharedElements: Array<PairUtil<View, String>>) {
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
