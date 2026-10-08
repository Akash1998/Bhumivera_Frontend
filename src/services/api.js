import axios from "axios";
import { notifyOperation } from "../utils/operationFeedback";

let b = import.meta.env.VITE_BASE_URL || "https://service.Bhumivera.com";
if (b.startsWith("http://") && !b.includes("localhost")) b = b.replace("http://", "https://");
export const BASE_URL = b;

const api = axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: true });

const isMutation = method => ['post', 'put', 'patch', 'delete'].includes(String(method || '').toLowerCase());

const getOperationLabel = url => {
  const path = String(url || '').split('?')[0].replace(/\/+$/, '');
  if (/^\/orders\/[^/]+\/status$/.test(path)) return 'Order status and tracking';
  if (/^\/orders\/[^/]+\/cancel$/.test(path)) return 'Order cancellation';
  if (path.startsWith('/orders')) return 'Order';
  if (path.startsWith('/cart')) return 'Cart';
  if (path.startsWith('/wishlist')) return 'Wishlist';
  if (path.startsWith('/addresses')) return 'Address';
  if (path.startsWith('/coupons')) return 'Coupon';
  if (path.startsWith('/settings/cart-rules')) return 'Cart rule';
  if (path.startsWith('/settings')) return 'Settings';
  if (path.startsWith('/products')) return 'Product';
  if (path.startsWith('/categories')) return 'Category';
  if (path.startsWith('/subcategories')) return 'Subcategory';
  if (path.startsWith('/users/profile')) return 'Profile';
  if (path.startsWith('/users')) return 'Account';
  if (path.startsWith('/returns')) return 'Return request';
  if (path.startsWith('/warranty')) return 'Warranty request';
  if (path.startsWith('/shipping')) return 'Shipping settings';
  if (path.startsWith('/inventory')) return 'Inventory';
  if (path.startsWith('/serials')) return 'Serial number';
  if (path.startsWith('/flash-sales')) return 'Flash sale';
  if (path.startsWith('/notifications')) return 'Notification';
  if (path.startsWith('/reviews')) return 'Review';
  if (path.startsWith('/contact')) return 'Contact request';
  if (path.startsWith('/newsletter')) return 'Subscription';
  if (path.startsWith('/wallet')) return 'Wallet operation';
  const segment = path.split('/').filter(Boolean).find(part => !/^\d+$/.test(part));
  return segment
    ? segment.replace(/[-_]/g, ' ').replace(/\b\w/g, letter => letter.toUpperCase())
    : 'Operation';
};

const getSuccessMessage = response => {
  const config = response.config || {};
  if (config.successMessage) return config.successMessage;
  if (/^\/orders\/[^/]+\/status$/.test(String(config.url || '').split('?')[0])) {
    let body = config.data;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch { body = {}; }
    }
    return body?.trackingNumber || body?.courier
      ? 'Order status and tracking details updated successfully.'
      : 'Order status updated successfully.';
  }
  const serverMessage = response.data?.message;
  if (typeof serverMessage === 'string' && serverMessage.trim().length > 3) return serverMessage.trim();
  const method = String(config.method || '').toLowerCase();
  const label = getOperationLabel(config.url);
  if (method === 'delete') return `${label} deleted successfully.`;
  if (method === 'post') return `${label} completed successfully.`;
  return `${label} updated successfully.`;
};

const shouldNotifyMutation = config => isMutation(config?.method) &&
  config?.notify !== false &&
  !/\/auth\/(login|register|verify-email|login-request-otp|mobile-login|admin\/login|admin\/request-otp|admin\/verify-otp|admin\/forgot-password|admin\/verify-reset-otp|admin\/reset-password|forgot-password|verify-otp|reset-password|2fa\/verify)(\/|$)/.test(config?.url || '') &&
  !/\/coupons\/validate(\/|$)/.test(config?.url || '');

const notifyMutationFailure = error => {
  const config = error.config || {};
  if (!shouldNotifyMutation(config) || axios.isCancel(error)) return;
  const serverMessage = error.response?.data?.message || error.normalized?.message;
  const label = getOperationLabel(config.url);
  const message = typeof serverMessage === 'string' && serverMessage.trim()
    ? serverMessage.trim()
    : `Could not complete ${label.toLowerCase()}. Please try again.`;
  notifyOperation('error', message);
};

api.interceptors.request.use(c => {
  const url = c.url || "";
  const isAdminCall = c.adminAuth === true || url.startsWith("/admin/") ||
    url === "/auth/profile" ||
    url === "/reviews" && c.method === "get" ||
    url.startsWith("/serials/admin/") ||
    url.startsWith("/warehouse/admin/") ||
    url.startsWith("/users/loyalty/tiers") ||
    url.startsWith("/logs/") ||
    url.startsWith("/flash-sales/admin") ||
    url.startsWith("/orders/all") ||
    url.startsWith("/orders/") && (c.method === "put" || c.method === "delete") ||
    url.startsWith("/analytics/") ||
    url.startsWith("/inventory/") ||
    url.startsWith("/notifications/admin/") ||
    url.startsWith("/returns/admin/") ||
    url.startsWith("/serials/admin/") ||
    url.startsWith("/contact") && c.method === "get" && !url.startsWith("/contact/my") ||
    url.startsWith("/returns") && c.method === "get" && !url.includes("/my") ||
    url.startsWith("/warranty") && c.method === "get" && !url.includes("/my") ||
    url.startsWith("/products") && (c.method === "post" || c.method === "put" || c.method === "delete" || c.method === "patch") ||
    url.startsWith("/products") && c.method === "get" && !url.startsWith("/products/active") && !url.startsWith("/products/slug/") && !url.includes("/qa") && !/\/products\/\d+/.test(url) && !/\/products\/[a-f0-9]{24}/.test(url) ||
    url.startsWith("/categories") && (c.method === "post" || c.method === "put" || c.method === "delete") ||
    url.startsWith("/subcategories") && (c.method === "post" || c.method === "put" || c.method === "delete") ||
    url.startsWith("/coupons") && !url.startsWith("/coupons/validate") && (c.method === "post" || c.method === "put" || c.method === "delete" || url.includes("/coupons") && c.method === "get" && !url.includes("/public/")) ||
    url.startsWith("/settings") ||
    url.startsWith("/shipping") && c.method !== "get" ||
    url.startsWith("/shipping/zones") && c.method === "get" && !url.includes("/active") ||
    url.startsWith("/contact") && c.method !== "post" && !url.startsWith("/contact/my") ||
    url.startsWith("/tax") && c.method !== "get" ||
    url.startsWith("/flash-sales") && (c.method === "post" || c.method === "put" || c.method === "patch" || c.method === "delete");

  const isWarehouseCall = url.startsWith("/warehouse/") && !url.startsWith("/warehouse/login");

  let token = null;
  if (isAdminCall) {
    token = localStorage.getItem("adminToken");
  } else if (isWarehouseCall) {
    token = localStorage.getItem("warehouseToken") || localStorage.getItem("adminToken") || localStorage.getItem("token");
  } else {
    token = localStorage.getItem("token") || localStorage.getItem("ms_token");
  }
  if (token) c.headers.Authorization = `Bearer ${token}`;
  return c;
}, e => Promise.reject(e));

const _refreshPromises = { user: null, admin: null };

const isPathOrChild = (url, path) => url === path || url.startsWith(`${path}/`);

const _resolveTokenKind = (url = '', method = '', adminAuth = false) => {
  if (adminAuth) return 'admin';
  const isAdminUrl = url.startsWith("/admin/") ||
    url === "/auth/profile" ||
    url === "/reviews" && method === 'get' ||
    url.startsWith("/contact") && method !== 'post' && !url.startsWith("/contact/my") ||
    url.startsWith("/serials/admin/") ||
    url.startsWith("/warehouse/admin/") ||
    url.startsWith("/logs/") ||
    url.startsWith("/flash-sales/admin") ||
    (url.startsWith("/flash-sales/") && !url.startsWith("/flash-sales/active")) ||
    url.startsWith("/orders/all") ||
    url.startsWith("/orders/") && (method === 'put' || method === 'delete') ||
    url.startsWith("/analytics/") ||
    url.startsWith("/settings") ||
    url.startsWith("/notifications/admin/") ||
    url.startsWith("/returns/admin/");
  const isWarehouseUrl = url.startsWith("/warehouse/");
  const isAuthUrl = url.includes("/auth/");
  if (isAdminUrl || (isAuthUrl && (url.includes("/admin/") || url.includes("/warehouse/")))) return 'admin';
  if (isWarehouseUrl) return 'warehouse';
  return 'user';
};

const _attemptRefresh = async (kind = 'user') => {
  if (_refreshPromises[kind]) return _refreshPromises[kind];
  _refreshPromises[kind] = (async () => {
    try {
      const currentToken = kind === 'admin'
        ? localStorage.getItem("adminToken")
        : localStorage.getItem("token") || localStorage.getItem("ms_token");
      if (!currentToken) throw new Error("No token to refresh");
      const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (data?.token) {
        if (kind === 'admin') {
          localStorage.setItem("adminToken", data.token);
        } else {
          localStorage.setItem("token", data.token);
          if (localStorage.getItem("ms_token")) localStorage.setItem("ms_token", data.token);
        }
      }
      return data?.token || null;
    } finally {
      _refreshPromises[kind] = null;
    }
  })();
  return _refreshPromises[kind];
};

api.interceptors.response.use(response => {
  if (shouldNotifyMutation(response.config)) {
    notifyOperation('success', getSuccessMessage(response));
  }
  return response;
}, async (e) => {
  const retryConfig = e.config;
  const requestMethod = String(retryConfig?.method || '').toLowerCase();
  const serviceUnavailableRetries = Number(retryConfig?._serviceUnavailableRetries) || 0;
  if (
    e.response?.status === 503 &&
    ['get', 'head'].includes(requestMethod) &&
    retryConfig &&
    serviceUnavailableRetries < 2
  ) {
    const retryAfterHeader = Number(e.response.headers?.['retry-after']);
    const retryDelaySeconds = Number.isFinite(retryAfterHeader) && retryAfterHeader > 0
      ? Math.min(retryAfterHeader, 15)
      : 2 ** serviceUnavailableRetries;
    retryConfig._serviceUnavailableRetries = serviceUnavailableRetries + 1;
    await new Promise(resolve => setTimeout(resolve, retryDelaySeconds * 1000));
    return api.request(retryConfig);
  }

  const errorData = e.response?.data || {};
  e.normalized = {
    code: errorData.code || (e.response ? `HTTP_${e.response.status}` : 'NETWORK_ERROR'),
    message: errorData.message || errorData.error || e.message || 'Request failed.',
    userAction: errorData.userAction || (e.response?.status === 401 ? 'Sign in and try again.' : 'Try again later.'),
    status: e.response?.status || 0,
    details: errorData.details,
  };
  const status = e.response?.status;
  const url = e.config?.url || "";
  if (status === 401) {
    const isCredentialSubmission = /^\/auth\/(login|register|verify-email|login-request-otp|2fa\/verify|forgot-password|verify-otp|reset-password|mobile-login(?:\/|$)|security-question\/|admin\/(login|request-otp|verify-otp|forgot-password|verify-reset-otp|reset-password|change-password))(\/|$)/.test(url);
    if (isCredentialSubmission) {
      notifyMutationFailure(e);
      return Promise.reject(e);
    }

    const kind = _resolveTokenKind(url, e.config?.method, e.config?.adminAuth);

    if (kind === 'admin') {
      if (!e.config?._retry) {
        try {
          const newToken = await _attemptRefresh('admin');
          if (newToken) {
            e.config._retry = true;
            e.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(e.config);
          }
        } catch (refreshError) {
          if (refreshError.response?.status !== 401 && refreshError.message !== "No token to refresh") {
            e.normalized = {
              ...e.normalized,
              message: refreshError.response?.data?.message || refreshError.message || e.normalized.message,
            };
            notifyMutationFailure(e);
            return Promise.reject(e);
          }
        }
      }
      window.dispatchEvent(new Event('admin-auth-expired'));
      notifyMutationFailure(e);
      return Promise.reject(e);
    }
    if (kind === 'warehouse') {
      localStorage.removeItem("warehouseToken");
      notifyMutationFailure(e);
      return Promise.reject(e);
    }

    const refreshable = !e.config?._retry &&
      (url.includes("/auth/profile") ||
       url.includes("/users/profile") ||
       url.startsWith("/settings/public") ||
       url.includes("/users/") ||
       isPathOrChild(url, "/orders") ||
       isPathOrChild(url, "/cart") ||
       isPathOrChild(url, "/addresses") ||
       isPathOrChild(url, "/wallet") ||
       url.startsWith("/wishlist/") ||
       url === "/wishlist" ||
       url.startsWith("/reviews/my") ||
       url.startsWith("/returns/my") ||
       url.startsWith("/returns/eligibility") ||
       url.startsWith("/warranty/my") ||
       (url.startsWith("/notifications") && !url.includes("/admin/")));

    if (refreshable) {
      try {
        const newToken = await _attemptRefresh('user');
        if (newToken) {
          e.config._retry = true;
          e.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(e.config);
        }
      } catch (_refreshErr) {
        if (_refreshErr.response?.status === 401) {
          e.response.data = { ...e.response.data, ..._refreshErr.response.data };
        } else if (_refreshErr.response || _refreshErr.message !== "No token to refresh") {
          notifyMutationFailure(e);
          return Promise.reject(e);
        }
      }
    }

    if (localStorage.getItem("token") || localStorage.getItem("ms_token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("ms_token");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event('auth-expired'));
    } else if (refreshable && !url.startsWith("/settings/public")) {
      window.dispatchEvent(new Event('auth-expired'));
    }
  }
  notifyMutationFailure(e);
  return Promise.reject(e);
});

export const auth = { login: d => api.post('/auth/login', d), logout: () => api.post('/auth/logout'), adminLogout: () => { const t = localStorage.getItem('adminToken'); return axios.post(`${BASE_URL}/api/auth/logout`, {}, t ? { headers: { Authorization: `Bearer ${t}` } } : {}).catch(() => ({ data: {} })); }, register: d => api.post('/auth/register', d), verifyEmail: d => api.post('/auth/verify-email', { email: d.email, otp: d.otp, securityAnswer: d.securityAnswer }), getProfile: () => api.get('/auth/profile'), updateProfile: d => api.put('/auth/profile', d), verify2FA: d => api.post('/auth/2fa/verify', d), requestPasswordReset: d => api.post('/auth/forgot-password', d), verifyResetOtp: d => api.post('/auth/verify-otp', d), resetPassword: d => api.post('/auth/reset-password', d), verifySecurityQuestion: d => api.post('/auth/security-question/verify', d), adminLogin: d => api.post('/auth/admin/login', d), changeAdminPassword: d => api.post('/auth/admin/change-password', d, { adminAuth: true }), getAdminProfile: () => api.get('/auth/profile'), sendAdminOtp: (email, password) => api.post('/auth/admin/request-otp', { email, password }), verifyAdminOtp: (email, otp) => api.post('/auth/admin/verify-otp', { email, otp }), mobileLoginRequest: email => api.post('/auth/mobile-login/request', { email }), mobileLoginVerify: d => api.post('/auth/mobile-login/verify', d), verifyPremiumResetOtp: d => api.post('/auth/verify-reset-otp', d), verifySecurityQuestionForReset: d => api.post('/auth/security-question/verify-for-reset', d), resetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/reset-password', { newPassword }, { headers: { Authorization: `Bearer ${resetJwt}` } }), adminForgotPassword: d => api.post('/auth/admin/forgot-password', d), adminVerifyResetOtp: d => api.post('/auth/admin/verify-reset-otp', d), adminResetPasswordBearer: (resetJwt, newPassword) => api.post('/auth/admin/reset-password', { newPassword }, { headers: { Authorization: `Bearer ${resetJwt}` } }) };
export const adminLogin = async c => (await api.post("/auth/admin/login", c)).data;
export const search = { query: q => api.get('/products/active', { params: { search: q } }), global: q => api.get('/products', { params: { search: q } }) };
export const users = { updateProfile: d => api.put('/users/profile', d), changePassword: d => api.post('/users/change-password', d), getProfile: () => api.get('/users/profile'), generate2FA: () => api.post('/users/2fa/generate-setup'), verifyAndEnable2FA: d => api.post('/users/2fa/enable', d), disable2FA: () => api.post('/users/2fa/disable'), updateSecurityQuestion: d => api.put('/users/security-question', d) };
export const products = { getAllActive: p => api.get("/products/active", { params: p }), getAllAdmin: () => api.get("/products"), getById: id => api.get(`/products/${id}`), getBySlug: s => api.get(`/products/slug/${s}`), create: (d, options) => api.post("/products", d, options), update: (id, d, options) => api.put(`/products/${id}`, d, options), toggleStatus: (id, s) => api.patch(`/products/${id}/status`, { status: s }), getUploadUrl: (f, t, options) => api.post("/products/presign", { filename: f, fileType: t }, options), saveImageKeys: (id, k, options) => api.post(`/products/${id}/images/save`, { imageKeys: k }, options), deleteImage: (id, image, options = {}) => api.delete(`/products/${id}/images`, { ...options, data: typeof image === 'object' ? { imageId: image.id, imagePath: image.file_path } : { imageId: image } }), addSerials: (id, s) => api.post(`/serials/${id}/add`, { serials: s }), delete: id => api.delete(`/products/${id}`) };
export const categories = { getAll: () => api.get("/categories"), getById: id => api.get(`/categories/${id}`), create: d => api.post("/categories", d), update: (id, d) => api.put(`/categories/${id}`, d), delete: id => api.delete(`/categories/${id}`) };
export const subcategories = { getAll: () => api.get("/subcategories"), getById: id => api.get(`/subcategories/${id}`), create: d => api.post("/subcategories", d), update: (id, d) => api.put(`/subcategories/${id}`, d), delete: id => api.delete(`/subcategories/${id}`) };
export const cart = { get: () => api.get("/cart"), add: d => api.post("/cart", d), updateQuantity: (id, q) => api.put(`/cart/${id}`, { quantity: q }), remove: id => api.delete(`/cart/${id}`), clear: () => api.delete("/cart"), claimAbandonedCoupon: () => api.post('/cart/abandoned-coupon') };
export const cartRules = {
  list: () => api.get('/settings/cart-rules/list'),
  getLoyaltyTiers: () => api.get('/settings/cart-rules/loyalty-tiers'),
  get: id => api.get(`/settings/cart-rules/${id}`),
  create: data => api.post('/settings/cart-rules/create', data),
  update: (id, data) => api.put(`/settings/cart-rules/${id}`, data),
  remove: id => api.delete(`/settings/cart-rules/${id}`),
  toggle: (id, status) => api.patch(`/settings/cart-rules/${id}/toggle`, { status }),
  preview: subtotal => api.get('/settings/cart-rules/preview', { params: { subtotal } }),
};
export const orders = { getMyOrders: () => api.get("/orders/my"), getById: id => api.get(`/orders/${id}`), create: d => api.post("/orders", d), getAllAdmin: () => api.get("/orders/all"), updateStatus: (id, s) => api.put(`/orders/${id}/status`, { status: s }), delete: id => api.delete(`/orders/${id}`), fastCheckout: d => api.post('/orders', d), cancel: id => api.post(`/orders/${id}/cancel`, {}), trackOrder: id => api.get(`/orders/${id}`) };
export const addresses = { getAll: () => api.get("/addresses"), create: d => api.post("/addresses", d), update: (id, d) => api.put(`/addresses/${id}`, d), delete: id => api.delete(`/addresses/${id}`), setDefault: id => api.patch(`/addresses/${id}/default`) };
export const wishlist = { get: () => api.get("/wishlist"), add: p => api.post("/wishlist", { productId: p }), remove: (p, options) => api.delete(`/wishlist/${p}`, options) };
export const coupons = { getPublicActive: () => api.get("/coupons/public/active"), validate: (c, orderTotal = 0) => api.post("/coupons/validate", { code: c, orderTotal }), getAllAdmin: () => api.get("/coupons"), create: d => api.post("/coupons", d), update: (id, d) => api.put(`/coupons/${id}`, d), delete: id => api.delete(`/coupons/${id}`) };
export const reviews = {
  getByProduct: productId => api.get(`/reviews/product/${productId}`),
  getPublicStories: () => api.get('/reviews/public-stories'),
  getMyReviews: () => api.get('/reviews/my'),
  update: (id, data) => api.put(`/reviews/${id}`, data),
  deleteOwner: id => api.delete(`/reviews/${id}`),
  getAllAdmin: () => api.get('/reviews', { adminAuth: true }),
  submit: data => api.post('/reviews', data),
  createUploadUrl: data => api.post('/reviews/upload-url', data),
  createAdminUploadUrl: data => api.post('/reviews/admin/upload-url', data, { adminAuth: true }),
  updateAdmin: (id, data) => api.put(`/reviews/admin/${id}`, data, { adminAuth: true }),
  approve: id => api.put(`/reviews/${id}/approve`, {}, { adminAuth: true }),
  delete: id => api.delete(`/reviews/${id}`, { adminAuth: true })
};
export const recommendations = {
  recordProductView: productId => api.post('/recommendations/view', { product_id: productId }, { notify: false }),
  getForYou: productId => api.get('/recommendations/for-you', { params: { product_id: productId } })
};
export const notifications = { get: () => api.get("/notifications"), getAllAdmin: () => api.get("/notifications/admin/all"), markRead: id => api.patch(`/notifications/${id}/read`), markAllRead: () => api.patch("/notifications/read-all"), delete: id => api.delete(`/notifications/${id}`), createBroadcast: data => api.post("/notifications/admin/create", data), send: d => api.post("/notifications", d) };
export const analytics = {
  getDashboard: (period = '30d') => api.get('/analytics/dashboard', { params: { period } }),
  getSales: (period = '30d') => api.get('/analytics/sales', { params: { period } }),
  getProducts: (period = '30d') => api.get('/analytics/products', { params: { period } }),
  getKpis: (period = '30d') => api.get('/analytics/kpis', { params: { period } }),
  getRevenue: (period = '30d') => api.get('/analytics/revenue', { params: { period } })
};
export const wallet = { getBalance: () => api.get('/wallet/balance'), getHistory: () => api.get('/wallet/history'), pay: d => api.post('/wallet/pay', d) };
export const settings = { get: () => api.get("/settings"), getPublic: () => api.get("/settings/public"), update: d => api.put("/settings", d) };
export const clientErrors = { getAllAdmin: limit => api.get('/logs/client', { params: { limit } }) };
export const newsletter = { subscribe: (email, source = 'site') => api.post('/newsletter/subscribe', { email, source }, { timeout: 5000 }) };
export const reportClientError = error => {
  const source = typeof error?.source === 'string' ? error.source.split(/[?#]/, 1)[0] : null;
  return axios.post(`${BASE_URL}/api/client-log`, {
    message: String(error?.message || error || 'Unknown client error').slice(0, 2000),
    source: source?.slice(0, 500) || null,
    lineNumber: Number.isInteger(error?.lineNumber) ? error.lineNumber : null,
    columnNumber: Number.isInteger(error?.columnNumber) ? error.columnNumber : null,
    pageUrl: typeof window === 'undefined' ? null : window.location.pathname,
    stack: typeof error?.stack === 'string' ? error.stack.slice(0, 8000) : null,
  }, { timeout: 3000 }).catch(() => null);
};
export const shipping = { getAll: () => api.get("/shipping"), create: d => api.post("/shipping", d), update: (id, d) => api.put(`/shipping/${id}`, d), delete: id => api.delete(`/shipping/${id}`) };
export const returns = { getMyReturns: () => api.get("/returns/my"), getEligibility: () => api.get("/returns/eligibility"), createUploadUrl: data => api.post('/returns/upload-url', data), submit: d => api.post("/returns", d), getAllAdmin: () => api.get("/returns/admin/all"), updateStatus: (id, data) => api.put(`/returns/admin/${id}`, typeof data === 'string' ? { status: data } : data) };
export const inventory = { get: () => api.get("/inventory"), updateStock: (p, q) => api.patch(`/inventory/${p}`, { quantity: q }) };
export const warranty = { register: d => api.post("/warranty/register", d), getMyWarranties: () => api.get("/warranty/my"), getAllAdmin: () => api.get("/warranty"), updateStatus: (id, s) => api.patch(`/warranty/${id}/status`, { status: s }) };
export const gamification = { spin: data => api.post('/gamification/spin', data) };
export const impact = {
  getPublic: () => api.get('/impact/public'),
  getAdminContributions: () => api.get('/impact/admin/contributions', { adminAuth: true }),
  collectContribution: (id, collectionReference) => api.patch(`/impact/admin/contributions/${id}/collected`, { collectionReference }, { adminAuth: true }),
  getAdminUpdates: () => api.get('/impact/admin/updates', { adminAuth: true }),
  createUpdate: data => api.post('/impact/admin/updates', data, { adminAuth: true }),
};
export const serials = { validate: s => api.post("/serials/validate", { serial: s }), getAllAdmin: () => api.get("/serials/admin/all"), getByProduct: p => api.get(`/serials/${p}`), getStats: p => api.get(`/serials/${p}/stats`), generate: d => api.post("/serials/generate", d), addManual: (p, d) => api.post(`/serials/${p}/add`, d), update: (p, s, d) => api.patch(`/serials/${p}/${s}`, d), delete: (p, s) => api.delete(`/serials/${p}/${s}`) };
export const contact = {
  submit: d => api.post("/contact", d),
  getMine: () => api.get("/contact/my"),
  reply: (id, message) => api.post(`/contact/${id}/replies`, { message }),
  getAllAdmin: () => api.get("/contact"),
  delete: id => api.delete(`/contact/${id}`)
};
export const adminManagement = { getAllUsers: () => api.get("/admin/users"), getUserDetails: id => api.get(`/admin/users/${id}`), updateUserStatus: (id, s) => api.patch(`/admin/users/${id}/status`, { status: s }), getAllOrders: () => api.get("/orders/all"), updateOrderStatus: (id, d) => api.put(`/orders/${id}/status`, d) };
export const affiliate = { getAllPartners: () => api.get("/affiliate/partners"), getAllWithdrawals: () => api.get("/affiliate/withdrawals"), getConfig: () => api.get("/affiliate/config"), updatePartnerStatus: (id, s) => api.patch(`/affiliate/partners/${id}/status`, { status: s }), approveWithdrawal: id => api.patch(`/affiliate/withdrawals/${id}/approve`), updateConfig: d => api.put("/affiliate/config", d) };
export const flashSales = { getAll: () => api.get("/flash-sales"), getAllAdmin: () => api.get("/flash-sales"), getActive: () => api.get("/flash-sales/active"), create: d => api.post("/flash-sales", d), update: (id, d) => api.put(`/flash-sales/${id}`, d), delete: id => api.delete(`/flash-sales/${id}`) };
export const support = {
  getAllAdmin: () => api.get('/contact'),
  updateStatus: (id, s, adminReply) => api.patch(`/contact/${id}/status`, { status: String(s).replaceAll('-', '_'), ...(adminReply ? { admin_reply: adminReply } : {}) }),
  delete: id => api.delete(`/contact/${id}`)
};
export const loyalty = { getSystemConfig: () => api.get("/settings"), updateSystemConfig: d => api.put("/settings", d), getMembers: () => api.get("/admin/users"), adjustPoints: (u, d) => api.patch(`/admin/users/${u}/status`, d) };
export const loyaltyTiers = {
  list: () => api.get('/users/loyalty/tiers'),
  create: data => api.post('/users/loyalty/tiers', data),
  update: (id, data) => api.put(`/users/loyalty/tiers/${id}`, data),
  remove: id => api.delete(`/users/loyalty/tiers/${id}`),
};
export const fetchProductQA = p => api.get(`/products/${p}/qa`);
export const submitProductQuestion = (p, d) => api.post(`/products/${p}/qa`, d);
export const fetchCart = () => cart.get();
export const addToCartAPI = (p, q) => cart.add({ productId: p, quantity: q });
export const removeFromCartAPI = p => cart.remove(p);
export const clearCartAPI = () => cart.clear();
export const fetchPublicSettings = () => settings.getPublic();
export const fetchProducts = () => products.getAllActive();
export const fetchCategories = () => categories.getAll();
export const submitContact = d => contact.submit(d);
export const fetchAddressesAPI = async () => (await addresses.getAll()).data;
export const saveAddressAPI = async d => { const r = await addresses.create(d); return r.data.addresses || r.data; };
export const placeOrderAPI = async d => (await orders.create(d)).data;
export default api;
