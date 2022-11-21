package com.androidvip.shelfe.ui.settings

import android.content.Intent
import android.os.Bundle
import android.view.View
import androidx.lifecycle.lifecycleScope
import com.androidvip.shelfe.R
import com.androidvip.shelfe.databinding.FragmentSettingsBinding
import com.androidvip.shelfe.ui.auth.EmailAuthActivity
import com.androidvip.shelfe.ui.base.BaseViewBindingFragment
import com.bumptech.glide.Glide
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase
import kotlinx.coroutines.launch
import kotlinx.coroutines.tasks.await

class SettingsFragment : BaseViewBindingFragment<FragmentSettingsBinding>(
    FragmentSettingsBinding::inflate
) {
    private val auth by lazy { Firebase.auth }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        val user = auth.currentUser ?: return

        binding.email.text = user.email
        binding.username.text = user.displayName
        binding.userTitle.text = user.displayName
            ?: user.email?.split("@")?.firstOrNull().orEmpty()

        user.photoUrl?.let { uri ->
            Glide.with(binding.userPicture)
                .load(uri)
                .centerCrop()
                .error(R.drawable.avatar)
                .into(binding.userPicture)
        }

        binding.signOut.setOnClickListener {
            auth.signOut()
            startActivity(Intent(requireActivity(), EmailAuthActivity::class.java))
            requireActivity().finish()
        }

        binding.deleteAccount.setOnClickListener {
            MaterialAlertDialogBuilder(requireContext())
                .setTitle(android.R.string.dialog_alert_title)
                .setMessage(R.string.delete_account_warning)
                .setPositiveButton(android.R.string.ok) { _, _ ->
                    deleteUser(user)
                }.setNegativeButton(android.R.string.cancel) { _, _ -> }
                .show()
        }
    }

    private fun deleteUser(user: FirebaseUser) {
        lifecycleScope.launch {
            user.delete().await()
            startActivity(Intent(requireActivity(), EmailAuthActivity::class.java))
            requireActivity().finish()
        }
    }
}
