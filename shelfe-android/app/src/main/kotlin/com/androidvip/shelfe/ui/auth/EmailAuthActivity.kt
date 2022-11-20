package com.androidvip.shelfe.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.inputmethod.EditorInfo
import android.widget.Toast
import com.androidvip.shelfe.MainActivity
import com.androidvip.shelfe.databinding.ActivityEmailAuthBinding
import com.androidvip.shelfe.ui.base.BaseActivity
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class EmailAuthActivity : BaseActivity<ActivityEmailAuthBinding>(
    ActivityEmailAuthBinding::inflate
) {
    private val auth by lazy { Firebase.auth }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        binding.emailField.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                signIn()
                return@setOnEditorActionListener true
            }
            false
        }

        binding.signIn.setOnClickListener { signIn() }
    }

    private fun signIn() {
        val email = binding.emailField.text.toString()
        val password = binding.passwordField.text.toString()

        auth.signInWithEmailAndPassword(email, password).addOnSuccessListener {
            startActivity(Intent(this, MainActivity::class.java))
        }.addOnFailureListener {
            Toast.makeText(this, it.message.orEmpty(), Toast.LENGTH_SHORT).show()
        }
    }
}
