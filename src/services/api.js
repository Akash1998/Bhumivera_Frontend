import axios from "axios";

// --- CONFIGURATION & SANITIZATION ---
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

// --- INTERCEPTORS ---
api.interceptors.request.use(
    (config) => {
        // Checks both standard and admin tokens
        const token = localStorage.getItem("token") || localStorage.getItem("ms_token") || localStorage.getItem("adminToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Prevent redirect loops on the login page itself
            if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/admin/login')) {
                localStorage.removeItem("token");
                localStorage.removeItem("ms_token");
                localStorage.removeItem("adminToken");
                localStorage.removeItem("user");
                window.dispatchEvent(new Event('auth-expired'));
            }
        }
        return Promise.reject(error);
    }
);

// --- 1. AUTH & USER SERVICE ---
export const auth = {
    login: (data) => api.post('/auth/login', data),
    adminLogin: (data) => api.post('/auth/admin/login', data),
    verify: () => api.get('/auth/verify'),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    verify2FA: (data) => api.post('/auth/2fa/verify', data),
    requestPasswordReset: (data) => api.post('/auth/forgot-password', data),
    verifyResetOtp: (data) => api.post('/auth/verify-otp', data),
    resetPassword: (data) => api.post('/auth/reset-password', data),
    mobileLoginRequest: (mobile) => api.post('/auth/mobile/request-otp', { mobile }),
    mobileLoginVerify: (data) => api.post('/auth/mobile/verify-otp', data),
};

export const users = {
    getAll: () => api.get('/users'),
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data),
    suspend: (id) => api.post(`/users/${id}/suspend`),
    changePassword: (data) => api.put('/users/change-password', data),
    generate2FA: () => api.post('/users/2fa/generate'),
    verifyAndEnable2FA: (data) => api.post('/users/2fa/enable', data),
    disable2FA: (data) => api.post('/users/2fa/disable', data),
};

// --- 2. PRODUCT & INVENTORY SERVICE ---
export const products = {
    getAllActive: (params) => api.get("/products/active", { params }),
    getAllAdmin: () => api.get("/products"),
    getById: (id) => api.get(`/products/${id}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    create: (data) => api.post("/products", data),
    update: (id, data) => api.put(`/products/${id}`, data),
    delete: (id) => api.delete(`/products/${id}`),
    toggleStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
};

export const inventory = {
    getLowStock: () => api.get('/inventory/low-stock'),
    restock: (id, qty) => api.post(`/inventory/${id}/restock`, { qty })
};

// --- 3. SALES & MARKETING ---
export const flashSales = {
    getActive: () => api.get('/flash-sales/active'),
    getAll: () => api.get('/flash-sales'),
    create: (data) => api.post('/flash-sales', data),
};

export const coupons = {
    validate: (code) => api.post("/coupons/validate", { code }),
    getAll: () => api.get("/coupons"),
    create: (data) => api.post("/coupons", data),
    delete: (id) => api.delete(`/coupons/${id}`),
};

// --- 4. ORDER & CART SERVICE ---
export const cart = {
    get: (userId) => api.get(userId ? `/cart/${userId}` : "/cart"),
    add: (data) => api.post("/cart", data),
    update: (userId, data) => api.put(`/cart/${userId}`, data),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete("/cart"),
};

export const orders = {
    getMyOrders: () => api.get("/orders/my"),
    getAllAdmin: () => api.get("/orders"),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post("/orders", data),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

// --- 5. FINANCIALS & ANALYTICS ---
export const wallet = {
    getBalance: () => api.get('/wallet/balance'),
    addFunds: (amount) => api.post('/wallet/add', { amount }),
    getTransactions: () => api.get('/wallet/transactions'),
};

export const analytics = {
    getDashboardStats: () => api.get("/analytics/dashboard"),
    getRevenue: (range) => api.get(`/analytics/revenue`, { params: { range } }),
    getSales: () => api.get("/analytics/sales"),
};

// --- 6. SUPPORT & EXPERIENCE ---
export const reviews = {
    getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
    getPending: () => api.get('/reviews/pending'),
    approve: (id) => api.patch(`/reviews/${id}/approve`),
    submit: (data) => api.post("/reviews", data),
};

export const support = {
    getTickets: () => api.get('/support/tickets'),
    respond: (ticketId, message) => api.post(`/support/tickets/${ticketId}/respond`, { message })
};

// --- 7. SYSTEM & INFRA ---
export const settings = {
    getGlobal: () => api.get('/settings/global'),
    getPublic: () => api.get("/settings/public"),
    updateGlobal: (data) => api.put('/settings/global', data),
};

export const categories = {
    getAll: () => api.get("/categories"),
    create: (data) => api.post("/categories", data),
    update: (id, data) => api.put(`/categories/${id}`, data),
};

export const brands = {
    getAll: () => api.get('/brands'),
    add: (data) => api.post('/brands', data)
};

// --- 8. SPECIALIZED SERVICES (Fitment/Serials) ---
export const fitment = {
    check: (productId, make, model, year) => api.get('/fitment/check', { params: { productId, make, model, year } }),
    getMakes: () => api.get('/fitment/makes'),
};

export const serials = {
    validate: (serial) => api.post("/serials/validate", { serial }),
    generate: (data) => api.post("/serials/generate", data),
};

// --- LEGACY HELPERS (Backward Compatibility) ---
export const fetchProducts = () => products.getAllActive();
export const fetchCategories = () => categories.getAll();
export const fetchPublicSettings = () => settings.getPublic();

export default api;
