import axios from "axios";

let envBaseUrl = import.meta.env.VITE_BASE_URL || "https://service.anritvox.com";
if (envBaseUrl.startsWith("http://") && !envBaseUrl.includes("localhost")) {
    envBaseUrl = envBaseUrl.replace("http://", "https://");
}
export const BASE_URL = envBaseUrl;
const API_BASE_URL = `${BASE_URL}/api`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || localStorage.getItem("ms_token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (!error.config.url.includes('/auth/login')) {
                localStorage.removeItem("token");
                localStorage.removeItem("ms_token");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event('auth-expired'));
            }
        }
        return Promise.reject(error);
    }
);

// --- AUTH SERVICE ---
export const auth = {
    login: (data) => api.post('/auth/login', data),
    mobileLoginRequest: (mobile) => api.post('/auth/mobile/request-otp', { mobile }),
    mobileLoginVerify: (data) => api.post('/auth/mobile/verify-otp', data),
    adminLogin: (data) => api.post('/auth/admin/login', data),
    getAdminProfile: () => api.get('/auth/profile'),
    register: (data) => api.post('/auth/register', data),
    verifyEmail: (data) => api.post('/auth/verify-email', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    verify2FA: (data) => api.post('/auth/2fa/verify', data),
    requestPasswordReset: (data) => api.post('/auth/forgot-password', data),
    verifyResetOtp: (data) => api.post('/auth/verify-otp', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    verifySecurityQuestion: (data) => api.post('/auth/security-question/verify', data),
};

// --- USER SERVICE ---
export const users = {
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
    getProfile: () => api.get('/users/profile'),
    updateSecurityQuestion: (data) => api.put('/users/security-question', data),
    generate2FA: () => api.post('/users/2fa/generate'),
    verifyAndEnable2FA: (data) => api.post('/users/2fa/enable', data),
    disable2FA: (data) => api.post('/users/2fa/disable', data),
};

// --- PRODUCT SERVICE ---
export const products = {
    getAllActive: (params) => api.get("/products/active", { params }),
    getAllAdmin: () => api.get("/products"),
    getById: (id) => api.get(`/products/${id}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    create: (data) => api.post("/products", data),
    update: (id, data) => api.put(`/products/${id}`, data),
    toggleStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
    getUploadUrl: (filename, fileType) => api.post("/products/presign", { filename, fileType }),
    saveImageKeys: (id, imageKeys) => api.post(`/products/${id}/images/save`, { imageKeys }),
    deleteImage: (id, imageId) => api.delete(`/products/${id}/images`, { data: { imageId } }),
    addSerials: (id, serials) => api.post(`/serials/${id}/add`, { serials }),
    delete: (id) => api.delete(`/products/${id}`),
    getFitment: (id) => api.get(`/products/${id}/fitment`),
    updateFitment: (id, data) => api.put(`/products/${id}/fitment`, data),
};

// --- WALLET SERVICE ---
export const wallet = {
    getBalance: () => api.get('/wallet/balance'),
    addFunds: (amount) => api.post('/wallet/add', { amount }),
    getTransactions: () => api.get('/wallet/transactions'),
    pay: (orderId) => api.post('/wallet/pay', { orderId }),
    getAdminSummary: () => api.get('/admin/wallet/summary'),
    adjustBalance: (userId, data) => api.patch(`/admin/users/${userId}/wallet`, data),
};

// --- LOYALTY SERVICE ---
export const loyalty = {
    getStats: () => api.get('/loyalty/stats'),
    redeem: (points) => api.post('/loyalty/redeem', { points }),
    getHistory: () => api.get('/loyalty/history'),
    getSystemConfig: () => api.get("/settings/loyalty"),
    updateSystemConfig: (data) => api.put("/settings/loyalty", data),
    getMembers: () => api.get("/admin/loyalty/members"),
    adjustPoints: (userId, data) => api.patch(`/admin/users/${userId}/loyalty`, data),
};

// --- CATEGORY SERVICE ---
export const categories = {
    getAll: () => api.get("/categories"),
    getById: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post("/categories", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// --- SUBCATEGORY SERVICE ---
export const subcategories = {
    getAll: () => api.get("/subcategories"),
    getById: (id) => api.get(`/subcategories/${id}`),
    create: (data) => api.post("/subcategories", data),
    update: (id, data) => api.put(`/subcategories/${id}`, data),
    delete: (id) => api.delete(`/subcategories/${id}`),
};

// --- CART SERVICE ---
export const cart = {
    get: () => api.get("/cart"),
    add: (data) => api.post("/cart", data),
    updateQuantity: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete("/cart"),
};

// --- ORDER SERVICE ---
export const orders = {
    getMyOrders: () => api.get("/orders/my"),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post("/orders", data),
    fastCheckout: (data) => api.post("/orders/fast-checkout", data),
    getAllAdmin: () => api.get("/orders"),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
    delete: (id) => api.delete(`/orders/${id}`),
};

// --- ADDRESS SERVICE ---
export const addresses = {
    getAll: () => api.get("/addresses"),
    create: (data) => api.post("/addresses", data),
    update: (id, data) => api.put(`/addresses/${id}`, data),
    delete: (id) => api.delete(`/addresses/${id}`),
    setDefault: (id) => api.patch(`/addresses/${id}/default`),
};

// --- WISHLIST SERVICE ---
export const wishlist = {
    get: () => api.get("/wishlist"),
    add: (productId) => api.post("/wishlist", { productId }),
    remove: (productId) => api.delete(`/wishlist/${productId}`),
};

// --- COUPON SERVICE ---
export const coupons = {
    validate: (code) => api.post("/coupons/validate", { code }),
    getAllAdmin: () => api.get("/coupons"),
    create: (data) => api.post("/coupons", data),
    update: (id, data) => api.put(`/coupons/${id}`, data),
    delete: (id) => api.delete(`/coupons/${id}`),
};

// --- REVIEW SERVICE ---
export const reviews = {
    getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
    getAllAdmin: () => api.get("/reviews"),
    submit: (data) => api.post("/reviews", data),
    approve: (id) => api.patch(`/reviews/${id}/approve`),
    delete: (id) => api.delete(`/reviews/${id}`),
};

// --- NOTIFICATION SERVICE ---
export const notifications = {
    get: () => api.get("/notifications"),
    markRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllRead: () => api.patch("/notifications/read-all"),
    send: (data) => api.post("/notifications", data),
};

// --- ANALYTICS SERVICE ---
export const analytics = {
    getDashboard: () => api.get("/analytics/dashboard"),
    getSales: () => api.get("/analytics/sales"),
    getProducts: () => api.get("/analytics/products"),
    getKpis: () => api.get("/analytics/kpis"),
    getRevenue: () => api.get("/analytics/revenue"),
    getTraffic: () => api.get("/analytics/traffic"),
    getRetention: () => api.get("/analytics/retention"),
};

// --- SETTINGS SERVICE ---
export const settings = {
    get: () => api.get("/settings"),
    getPublic: () => api.get("/settings/public"),
    update: (data) => api.put("/settings", data),
    getSeo: () => api.get("/settings/seo"),
    updateSeo: (data) => api.put("/settings/seo", data),
    getShipping: () => api.get("/settings/shipping"),
    updateShipping: (data) => api.put("/settings/shipping", data),
    getTax: () => api.get("/settings/tax"),
    updateTax: (data) => api.put("/settings/tax", data),
    getEmail: () => api.get("/settings/email"),
    updateEmail: (data) => api.put("/settings/email", data),
    getSms: () => api.get("/settings/sms"),
    updateSms: (data) => api.put("/settings/sms", data),
    getSecurity: () => api.get("/settings/security"),
    updateSecurity: (data) => api.put("/settings/security", data),
};

// --- SEARCH SERVICE ---
export const search = {
    query: (q, limit = 5) => api.get("/search", { params: { q, limit } }),
    syncAll: () => api.post("/search/sync-all")
};

// --- INFRASTRUCTURE SERVICE ---
export const infra = {
    getLogs: () => api.get("/infra/logs"),
    getDbStatus: () => api.get("/infra/db/status"),
    runBackup: () => api.post("/infra/db/backup"),
    getApiKeys: () => api.get("/infra/api-keys"),
    updateWebhooks: (data) => api.put("/infra/webhooks", data),
    clearCache: () => api.post("/infra/cache/clear"),
};

// --- CONTENT SERVICE ---
export const content = {
    getPages: () => api.get("/content/pages"),
    updatePage: (id, data) => api.put(`/content/pages/${id}`, data),
    getTranslations: () => api.get("/content/translations"),
    updateTranslations: (data) => api.put("/content/translations", data),
    getAds: () => api.get("/content/ads"),
    updateAds: (id, data) => api.put(`/content/ads/${id}`, data),
};

// --- FITMENT SERVICE ---
export const fitment = {
    check: (productId, make, model, year) => api.get('/fitment/check', { params: { productId, make, model, year } }),
    getByProduct: (productId) => api.get(`/fitment/product/${productId}`),
    getMakes: () => api.get('/fitment/makes'),
    getModels: (make) => api.get('/fitment/models', { params: { make } }),
    uploadExcel: (productId, formData) => api.post('/fitment/upload-excel', formData, { headers: { 'Content-Type': 'multipart/form-data' }, params: { productId } }),
    addManual: (data) => api.post('/fitment/manual', data),
    delete: (id) => api.delete(`/fitment/${id}`),
    clearAll: (productId) => api.delete(`/fitment/product/${productId}/all`),
};

// --- WARRANTY & SERIALS ---
export const warranty = {
    register: (data) => api.post("/warranty/register", data),
    getMyWarranties: () => api.get("/warranty/my"),
    getAllAdmin: () => api.get("/warranty"),
    updateStatus: (id, status) => api.patch(`/warranty/${id}/status`, { status }),
};

export const serials = {
    validate: (serial) => api.post("/serials/validate", { serial }),
    getAllAdmin: () => api.get("/serials/admin/all"),
    getByProduct: (productId) => api.get(`/serials/${productId}`),
    getStats: (productId) => api.get(`/serials/${productId}/stats`),
    generate: (data) => api.post("/serials/generate", data),
    addManual: (productId, data) => api.post(`/serials/${productId}/add`, data),
    update: (productId, serialId, data) => api.patch(`/serials/${productId}/${serialId}`, data),
    delete: (productId, serialId) => api.delete(`/serials/${productId}/${serialId}`),
};

// --- LEGACY & BACKWARD COMPATIBILITY HELPERS ---
export const fetchProductQA = (productId) => api.get(`/products/${productId}/qa`);
export const submitProductQuestion = (productId, data) => api.post(`/products/${productId}/qa`, data);
export const fetchCart = () => cart.get();
export const addToCartAPI = (productId, quantity) => cart.add({ productId, quantity });
export const removeFromCartAPI = (productId) => cart.remove(productId);
export const clearCartAPI = () => cart.clear();
export const fetchPublicSettings = () => settings.getPublic();
export const fetchProducts = () => products.getAllActive();
export const fetchCategories = () => categories.getAll();
export const submitContact = (data) => api.post("/contact", data);
export const fetchAddressesAPI = async () => {
    const res = await addresses.getAll();
    return res.data;
};
export const saveAddressAPI = async (data) => {
    const res = await addresses.create(data);
    return res.data.addresses || res.data;
};
export const placeOrderAPI = async (data) => {
    const res = await orders.create(data);
    return res.data;
};

export default api;
