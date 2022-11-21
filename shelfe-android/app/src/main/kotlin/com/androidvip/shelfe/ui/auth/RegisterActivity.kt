package com.androidvip.shelfe.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import com.androidvip.shelfe.MainActivity
import com.androidvip.shelfe.R
import com.androidvip.shelfe.databinding.ActivityRegisterBinding
import com.androidvip.shelfe.ui.base.BaseActivity
import com.google.android.material.snackbar.Snackbar
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class RegisterActivity : BaseActivity<ActivityRegisterBinding>(
    ActivityRegisterBinding::inflate
) {
    private val auth by lazy { Firebase.auth }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.emailField.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                checkInputs()
                return@setOnEditorActionListener true
            }
            false
        }

        binding.signIn.setOnClickListener { checkInputs() }
    }

    private fun checkInputs() {
        val email = binding.emailField.text.toString()
        val password = binding.passwordField.text.toString()
        val passwordConfirm = binding.confirmPasswordField.text.toString()

        if (password != passwordConfirm) {
            Snackbar.make(binding.root, R.string.passwords_dont_match, Snackbar.LENGTH_SHORT)
                .show()
            return
        }

        signIn(email, password)
    }

    private fun signIn(email: String, password: String) {
        auth.createUserWithEmailAndPassword(email, password).addOnSuccessListener {
            startActivity(Intent(this, MainActivity::class.java))
        }.addOnFailureListener {
            Snackbar.make(binding.root, it.message.orEmpty(), Snackbar.LENGTH_LONG)
                .show()
        }
    }
}
