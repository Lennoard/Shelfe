package com.androidvip.shelfe

import android.content.Intent
import android.os.Bundle
import android.view.MenuItem
import androidx.core.view.WindowCompat
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.AppBarConfiguration
import androidx.navigation.ui.setupWithNavController
import com.androidvip.shelfe.databinding.ActivityMainBinding
import com.androidvip.shelfe.ui.auth.EmailAuthActivity
import com.androidvip.shelfe.ui.base.BaseActivity
import com.google.firebase.auth.ktx.auth
import com.google.firebase.ktx.Firebase

class MainActivity : BaseActivity<ActivityMainBinding>(ActivityMainBinding::inflate) {
    private val auth by lazy { Firebase.auth }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        WindowCompat.setDecorFitsSystemWindows(window, false)

        if (auth.currentUser == null) {
            startActivity(Intent(this, EmailAuthActivity::class.java))
            return finish()
        }

        setSupportActionBar(binding.toolbar)
        setUpNavigation()
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        when (item.itemId) {
            android.R.id.home -> finish()

            R.id.action_exit -> {
                moveTaskToBack(true)
                finish()
            }
        }

        return false
    }

    override fun onSupportNavigateUp(): Boolean {
        return navHost.navController.navigateUp() || super.onSupportNavigateUp()
    }

    private fun setUpNavigation() = with(binding) {
        val navController = navHost.navController
        val defaultIds = setOf(R.id.navigationHome, R.id.navigationSearch)
        val appBarConfiguration = AppBarConfiguration(defaultIds)

        toolbar.setupWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }

    private val navHost: NavHostFragment
        get() = supportFragmentManager.findFragmentById(R.id.navHostFragment) as NavHostFragment
}
