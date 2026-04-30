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

export const users = {
    updateProfile: (data) => api.put('/users/profile', data),
    changePassword: (data) => api.put('/users/change-password', data),
    getProfile: () => api.get('/users/profile'),
    updateSecurityQuestion: (data) => api.put('/users/security-question', data),
    generate2FA: () => api.post('/users/2fa/generate'),
    verifyAndEnable2FA: (data) => api.post('/users/2fa/enable', data),
    disable2FA: (data) => api.post('/users/2fa/disable', data),
};

export const products = {
    getAllActive: (params) => api.get("/products/active", { params }),
    getAllAdmin: () => api.get("/products"),
    getById: (id) => api.get(`/products/${id}`),
    getBySlug: (slug) => api.get(`/products/slug/${slug}`),
    create: (data) => api.post("/products", data),
    update: (id, data) => api.put(`/products/${id}`, data),
    toggleStatus: (id, status) => api.patch(`/products/${id}/status`, { status }),
};

export const wallet = {
    getBalance: () => api.get('/wallet/balance'),
    addFunds: (amount) => api.post('/wallet/add', { amount }),
    getTransactions: () => api.get('/wallet/transactions'),
    pay: (orderId) => api.post('/wallet/pay', { orderId }),
};

export const loyalty = {
    getStats: () => api.get('/loyalty/stats'),
    redeem: (points) => api.post('/loyalty/redeem', { points }),
    getHistory: () => api.get('/loyalty/history'),
};

export const cart = {
    get: () => api.get("/cart"),
    add: (data) => api.post("/cart", data),
    updateQuantity: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`),
    clear: () => api.delete("/cart"),
};

export const orders = {
    getMyOrders: () => api.get("/orders/my"),
    getById: (id) => api.get(`/orders/${id}`),
    create: (data) => api.post("/orders", data),
    fastCheckout: (data) => api.post("/orders/fast-checkout", data),
    getAllAdmin: () => api.get("/orders"),
    updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export const addresses = {
    getAll: () => api.get("/addresses"),
    create: (data) => api.post("/addresses", data),
    update: (id, data) => api.put(`/addresses/${id}`, data),
    delete: (id) => api.delete(`/addresses/${id}`),
    setDefault: (id) => api.patch(`/addresses/${id}/default`),
};

export const affiliate = {
    getAllPartners: () => api.get("/affiliate/partners"),
    getAllWithdrawals: () => api.get("/affiliate/withdrawals"),
    getConfig: () => api.get("/affiliate/config"),
    updatePartnerStatus: (id, status) => api.patch(`/affiliate/partners/${id}/status`, { status }),
    approveWithdrawal: (id) => api.patch(`/affiliate/withdrawals/${id}/approve`, { id }),
    updateConfig: (data) => api.put("/affiliate/config", data),
};

export const support = {
    getAllAdmin: () => api.get("/contact"),
    updateStatus: (id, status) => api.patch(`/contact/${id}/status`, { status }),
    delete: (id) => api.delete(`/contact/${id}`),
};

export const settings = {
    get: () => api.get("/settings"),
    getPublic: () => api.get("/settings/public"),
    update: (data) => api.put("/settings", data),
};

export const search = {
    query: (q, limit = 5) => api.get("/search", { params: { q, limit } }),
    syncAll: () => api.post("/search/sync-all")
};

export default api;
