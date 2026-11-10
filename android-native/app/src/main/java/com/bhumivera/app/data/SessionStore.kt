package com.bhumivera.app.data

import android.content.Context
import androidx.core.content.edit
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey

class SessionStore(context: Context) {
    private val preferences = EncryptedSharedPreferences.create(
        context,
        "bhumivera_native_session",
        MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

    fun token(): String? = preferences.getString(TOKEN_KEY, null)

    fun saveToken(token: String) {
        preferences.edit(commit = true) { putString(TOKEN_KEY, token) }
        check(preferences.getString(TOKEN_KEY, null) == token) {
            "Could not securely save the sign-in session."
        }
    }

    fun clear() {
        val hadToken = preferences.contains(TOKEN_KEY)
        preferences.edit(commit = true) { remove(TOKEN_KEY) }
        check(!hadToken || !preferences.contains(TOKEN_KEY)) {
            "Could not clear the sign-in session."
        }
    }

    private companion object {
        const val TOKEN_KEY = "customer_token"
    }
}
