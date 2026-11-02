package com.bhumivera.app.data

import com.bhumivera.app.BuildConfig
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.DELETE
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Query
import java.util.concurrent.TimeUnit

interface BhumiveraService {
    @GET("products/active")
    suspend fun activeProducts(@Query("search") search: String? = null): ApiEnvelope<List<Product>>

    @GET("products/slug/{slug}")
    suspend fun productBySlug(@Path("slug") slug: String): ApiEnvelope<Product>

    @GET("products/{identifier}")
    suspend fun productById(@Path("identifier") identifier: Int): ApiEnvelope<Product>

    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): LoginResponse

    @POST("auth/google")
    suspend fun googleLogin(@Body request: GoogleLoginRequest): LoginResponse

    @POST("auth/2fa/verify")
    suspend fun verifyTwoFactor(@Body request: TwoFactorRequest): LoginResponse

    @POST("auth/logout")
    suspend fun logout()

    @GET("cart")
    suspend fun cart(): CartResponse

    @POST("cart")
    suspend fun addToCart(@Body request: AddCartRequest): CartResponse

    @PUT("cart/{productId}")
    suspend fun updateCartItem(
        @Path("productId") productId: Int,
        @Body request: UpdateCartRequest,
    ): CartResponse

    @DELETE("cart/{productId}")
    suspend fun removeCartItem(@Path("productId") productId: Int): CartResponse

    companion object {
        fun create(sessionStore: SessionStore): BhumiveraService {
            val authInterceptor = Interceptor { chain ->
                val request = chain.request().newBuilder().apply {
                    sessionStore.token()?.let { header("Authorization", "Bearer $it") }
                }.build()
                chain.proceed(request)
            }
            val client = OkHttpClient.Builder()
                .addInterceptor(authInterceptor)
                .connectTimeout(20, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .build()

            return Retrofit.Builder()
                .baseUrl("${BuildConfig.BACKEND_BASE_URL}/api/")
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(BhumiveraService::class.java)
        }
    }
}
