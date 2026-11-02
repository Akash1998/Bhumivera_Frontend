package com.bhumivera.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import com.bhumivera.app.data.BhumiveraService
import com.bhumivera.app.data.SessionStore
import com.bhumivera.app.ui.BhumiveraApp
import com.bhumivera.app.ui.BhumiveraTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val sessionStore = SessionStore(applicationContext)
        val service = BhumiveraService.create(sessionStore)

        setContent {
            BhumiveraTheme {
                BhumiveraApp(service, sessionStore)
            }
        }
    }
}
