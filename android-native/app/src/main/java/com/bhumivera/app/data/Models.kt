package com.bhumivera.app.data

import com.google.gson.annotations.SerializedName

data class ApiEnvelope<T>(
    val success: Boolean? = null,
    val data: T? = null,
    val message: String? = null,
)

data class Product(
    val id: Int,
    val name: String,
    val slug: String? = null,
    val price: Double? = null,
    @SerializedName("discount_price") val discountPrice: Double? = null,
    val mrp: Double? = null,
    val description: String? = null,
    @SerializedName("short_description") val shortDescription: String? = null,
    val category: String? = null,
    @SerializedName("category_name") val categoryName: String? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
    val image: String? = null,
    val images: List<ProductImage>? = null,
)

data class ProductImage(
    @SerializedName("file_path") val filePath: String? = null,
    @SerializedName("media_type") val mediaType: String? = null,
    val url: String? = null,
)

data class CustomerUser(
    val id: Int? = null,
    val name: String? = null,
    val email: String? = null,
    val role: String? = null,
)

data class LoginRequest(val email: String, val password: String)

data class GoogleLoginRequest(
    val idToken: String,
    val termsAccepted: Boolean,
)

data class TwoFactorRequest(val email: String, val otp: String)

data class LoginResponse(
    val token: String? = null,
    val user: CustomerUser? = null,
    val requires2FA: Boolean = false,
    val email: String? = null,
    val message: String? = null,
)

data class AddCartRequest(
    @SerializedName("productId") val productId: Int,
    val quantity: Int,
)

data class UpdateCartRequest(val quantity: Int)

data class CartResponse(
    val items: List<CartItem> = emptyList(),
    val total: Double = 0.0,
)

data class CartItem(
    val id: Int? = null,
    @SerializedName("product_id") val productId: Int,
    val name: String,
    val quantity: Int,
    @SerializedName("unit_price") val unitPrice: Double? = null,
    val subtotal: Double? = null,
    @SerializedName("image_url") val imageUrl: String? = null,
)
