import axios from "axios";

let b = import.meta.env.VITE_BASE_URL || "https://service.Bhumivera.com";
if (b.startsWith("http://") && !b.includes("localhost")) b = b.replace("http://", "https://");
export const BASE_URL = b;

const api = axios.create({ baseURL: `${BASE_URL}/api`, withCredentials: false });

api.interceptors.request.use(c => {
  const url = c.url || "";
  const isAdminCall = url.startsWith("/admin/") ||
    url.startsWith("/orders/all") ||
    url.startsWith("/orders/") && c.method !== "post" && c.method !== "patch" ||
    url.startsWith("/analytics/") ||
    url.startsWith("/inventory/") ||
    url.startsWith("/notifications/admin/") ||
    url.startsWith("/serials/admin/") ||
    url.startsWith("/contact") && c.method === "get" ||
    url.startsWith("/returns") && c.method === "get" && !url.includes("/my") ||
    url.startsWith("/warranty") && c.method === "get" && !url.includes("/my") ||
    url.startsWith("/products") && (c.method === "post" || c.method === "put" || c.method === "delete" || c.method === "patch") ||
    url.startsWith("/products") && c.method === "get" && !url.startsWith("/products/active") && !url.startsWith("/products/slug/") && !url.includes("/qa") && !/\/products\/\d+/.test(url) && !/\/products\/[a-f0-9]{24}/.test(url) ||
    url.startsWith("/categories") && (c.method === "post" || c.method === "put" || c.method === "delete") ||
    url.startsWith("/subcategories") && (c.method === "post" || c.method === "put" || c.method === "delete") ||
    url.startsWith("/coupons") && (c.method === "post" || c.method === "put" || c.method === "delete" || url.includes("/coupons") && c.method === "get" && !url.includes("/public/")) ||
    url.startsWith("/settings") ||
    url.startsWith("/shipping") && c.method !== "get" ||
    url.startsWith("/shipping/zones") && c.method === "get" && !url.includes("/active") ||
    url.startsWith("/tax") && c.method !== "get" ||
    url.startsWith("/flash-sales") && (c.method === "post" || c.method === "put" || c.method === "delete");

  const isWarehouseCall = url.startsWith("/warehouse/") && !url.startsWith("/warehouse/login");

  let token = null;
  if (isAdminCall) {
    token = localStorage.getItem("adminToken");
  } else if (isWarehouseCall) {
    token = localStorage.getItem("warehouseToken") || localStorage.getItem("token");
  } else {
    token = localStorage.getItem("token") || localStorage.getItem("ms_token");
  }
  if (token) c.headers.Authorization = `Bearer ${token}`;
  return c;
}, e => Promise.reject(e));

let _refreshPromise = null;

const _resolveTokenKind = (url = '') => {
  const isAdminUrl = url.startsWith("/admin/") ||
    url.startsWith("/orders/all") ||
    url.startsWith("/analytics/") ||
    url.startsWith("/settings") ||
    url.startsWith("/notifications/admin/");
  const isWarehouseUrl = url.startsWith("/warehouse/");
  const isAuthUrl = url.includes("/auth/");
  if (isAdminUrl || (isAuthUrl && (url.includes("/admin/") || url.includes("/warehouse/")))) return 'admin';
  if (isWarehouseUrl) return 'warehouse';
  return 'user';
};

const _attemptRefresh = async () => {
  if (_refreshPromise) return _refreshPromise;
  _refreshPromise = (async () => {
    try {
      const currentToken = localStorage.getItem("token") || localStorage.getItem("ms_token");
      if (!currentToken) throw new Error("No token to refresh");
      const { data } = await axios.post(`${BASE_URL}/api/auth/refresh`, {}, {
        headers: { Authorization: `Bearer ${currentToken}` }
      });
      if (data?.token) {
        localStorage.setItem("token", data.token);
        if (localStorage.getItem("ms_token")) localStorage.setItem("ms_token", data.token);
      }
      return data?.token || null;
    } finally {
      _refreshPromise = null;
    }
  })();
  return _refreshPromise;
};

api.interceptors.response.use(r => r, async (e) => {
  const status = e.response?.status;
  const url = e.config?.url || "";
  if (status === 403) {
    window.dispatchEvent(new CustomEvent('auth-forbidden', {
      detail: { message: 'Insufficient permissions for this action' }
    }));
  }
  if (status === 401 && url.includes("/auth/")) {
    const kind = _resolveTokenKind(url);

    if (kind === 'admin') {
      localStorage.removeItem("adminToken");
      window.dispatchEvent(new Event('admin-auth-expired'));
      return Promise.reject(e);
    }
    if (kind === 'warehouse') {
      localStorage.removeItem("warehouseToken");
      window.dispatchEvent(new Event('warehouse-auth-expired'));
      return Promise.reject(e);
    }

    const refreshable = !e.config?._retry &&
      (url.includes("/users/") ||
       url.startsWith("/orders/") ||
       url.startsWith("/cart/") ||
       url.startsWith("/addresses/") ||
       url.startsWith("/wallet/") ||
       url.startsWith("/wishlist/") ||
       url.startsWith("/reviews/my") ||
       url.startsWith("/returns/my") ||
       url.startsWith("/warranty/my") ||
       (url.startsWith("/notifications") && !url.includes("/admin/")));

    if (refreshable) {
      try {
        const newToken = await _attemptRefresh();
        if (newToken) {
          e.config._retry = true;
          e.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(e.config);
        }
      } catch {
        // fall through to cleanup below
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("ms_token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event('auth-expired'));
  }
  return Promise.reject(e);
});

export const auth = { login: d => api.post('/auth/login', d), register: d => api.post('/auth/register', d), verifyEmail: d => api.post('/auth/verify-email', { email: d.email, otp: d.otp, securityAnswer: d.securityAnswer }), getProfile: () => api.get('/auth/profile'), updateProfile: d => api.put('/auth/profile', d), verify2FA: d => api.post('/auth/2fa/verify', d), requestPasswordReset: d => api.post('/auth/forgot-password', d), verifyResetOtp: d => api.post('/auth/verify-otp', d), resetPassword: d => api.post('/auth/reset-password', d), verifySecurityQuestion: d => api.post('/auth/security-question/verify', d), adminLogin: d => api.post('/auth/admin/login', d), getAdminProfile: () => api.get('/auth/profile'), sendAdminOtp: email => api.post('/auth/admin/otp/send', { email }), verifyAdminOtp: (email, otp) => api.post('/auth/admin/otp/verify', { email, otp }), mobileLoginRequest: email => api.post('/auth/mobile-login/request', { email }), mobileLoginVerify: d => api.post('/auth/mobile-login/verify', d) };
export const adminLogin = async c => (await api.post("/auth/admin/login", c)).data;
export const search = { query: q => api.get('/products/active', { params: { search: q } }), global: q => api.get('/products', { params: { search: q } }) };
export const users = { updateProfile: d => api.put('/users/profile', d), changePassword: d => api.put('/users/change-password', d), getProfile: () => api.get('/users/profile'), generate2FA: () => api.post('/users/2fa/generate-setup'), verifyAndEnable2FA: d => api.post('/users/2fa/enable', d), disable2FA: () => api.post('/users/2fa/disable'), updateSecurityQuestion: d => api.put('/users/security-question', d) };
export const products = { getAllActive: p => api.get("/products/active", { params: p }), getAllAdmin: () => api.get("/products"), getById: id => api.get(`/products/${id}`), getBySlug: s => api.get(`/products/slug/${s}`), create: d => api.post("/products", d), update: (id, d) => api.put(`/products/${id}`, d), toggleStatus: (id, s) => api.patch(`/products/${id}/status`, { status: s }), getUploadUrl: (f, t) => api.post("/products/presign", { filename: f, fileType: t }), saveImageKeys: (id, k) => api.post(`/products/${id}/images/save`, { imageKeys: k }), deleteImage: (id, i) => api.delete(`/products/${id}/images`, { data: { imageId: i } }), addSerials: (id, s) => api.post(`/serials/${id}/add`, { serials: s }), delete: id => api.delete(`/products/${id}`) };
export const categories = { getAll: () => api.get("/categories"), getById: id => api.get(`/categories/${id}`), create: d => api.post("/categories", d), update: (id, d) => api.put(`/categories/${id}`, d), delete: id => api.delete(`/categories/${id}`) };
export const subcategories = { getAll: () => api.get("/subcategories"), getById: id => api.get(`/subcategories/${id}`), create: d => api.post("/subcategories", d), update: (id, d) => api.put(`/subcategories/${id}`, d), delete: id => api.delete(`/subcategories/${id}`) };
export const cart = { get: () => api.get("/cart"), add: d => api.post("/cart", d), updateQuantity: (id, q) => api.put(`/cart/${id}`, { quantity: q }), remove: id => api.delete(`/cart/${id}`), clear: () => api.delete("/cart") };
export const orders = { getMyOrders: () => api.get("/orders/my"), getById: id => api.get(`/orders/${id}`), create: d => api.post("/orders", d), getAllAdmin: () => api.get("/orders/all"), updateStatus: (id, s) => api.put(`/orders/${id}/status`, { status: s }), delete: id => api.delete(`/orders/${id}`), fastCheckout: d => api.post('/orders', d), cancel: id => api.post(`/orders/${id}/cancel`, {}), trackOrder: id => api.get(`/orders/${id}`) };
export const addresses = { getAll: () => api.get("/addresses"), create: d => api.post("/addresses", d), update: (id, d) => api.put(`/addresses/${id}`, d), delete: id => api.delete(`/addresses/${id}`), setDefault: id => api.patch(`/addresses/${id}/default`) };
export const wishlist = { get: () => api.get("/wishlist"), add: p => api.post("/wishlist", { productId: p }), remove: p => api.delete(`/wishlist/${p}`) };
export const coupons = { getPublicActive: () => api.get("/coupons/public/active"), validate: c => api.post("/coupons/validate", { code: c }), getAllAdmin: () => api.get("/coupons"), create: d => api.post("/coupons", d), update: (id, d) => api.put(`/coupons/${id}`, d), delete: id => api.delete(`/coupons/${id}`) };
export const reviews = { getByProduct: p => api.get(`/reviews/product/${p}`), getMyReviews: () => api.get('/reviews/my'), update: (id, d) => api.put(`/reviews/${id}`, d), deleteOwner: id => api.delete(`/reviews/${id}`), getAllAdmin: () => api.get("/reviews"), submit: d => api.post("/reviews", d), approve: id => api.patch(`/reviews/${id}/approve`), delete: id => api.delete(`/reviews/${id}`) };
export const notifications = { get: () => api.get("/notifications"), markRead: id => api.patch(`/notifications/${id}/read`), markAllRead: () => api.patch("/notifications/read-all"), send: d => api.post("/notifications", d) };
export const analytics = { getDashboard: () => api.get("/analytics/dashboard"), getSales: () => api.get("/analytics/sales"), getProducts: () => api.get("/analytics/products"), getKpis: () => api.get("/analytics/kpis"), getRevenue: () => api.get("/analytics/revenue") };
export const wallet = { getBalance: () => api.get('/wallet/balance'), getHistory: () => api.get('/wallet/history'), pay: d => api.post('/wallet/pay', d) };
export const settings = { get: () => api.get("/settings"), getPublic: () => api.get("/settings/public"), update: d => api.put("/settings", d) };
export const shipping = { getAll: () => api.get("/shipping"), create: d => api.post("/shipping", d), update: (id, d) => api.put(`/shipping/${id}`, d), delete: id => api.delete(`/shipping/${id}`) };
export const returns = { getMyReturns: () => api.get("/returns/my"), submit: d => api.post("/returns", d), getAllAdmin: () => api.get("/returns"), updateStatus: (id, s) => api.patch(`/returns/${id}/status`, { status: s }) };
export const inventory = { get: () => api.get("/inventory"), updateStock: (p, q) => api.patch(`/inventory/${p}`, { quantity: q }) };
export const warranty = { register: d => api.post("/warranty/register", d), getMyWarranties: () => api.get("/warranty/my"), getAllAdmin: () => api.get("/warranty"), updateStatus: (id, s) => api.patch(`/warranty/${id}/status`, { status: s }) };
export const serials = { validate: s => api.post("/serials/validate", { serial: s }), getAllAdmin: () => api.get("/serials/admin/all"), getByProduct: p => api.get(`/serials/${p}`), getStats: p => api.get(`/serials/${p}/stats`), generate: d => api.post("/serials/generate", d), addManual: (p, d) => api.post(`/serials/${p}/add`, d), update: (p, s, d) => api.patch(`/serials/${p}/${s}`, d), delete: (p, s) => api.delete(`/serials/${p}/${s}`) };
export const contact = { submit: d => api.post("/contact", d), getAllAdmin: () => api.get("/contact"), delete: id => api.delete(`/contact/${id}`) };
export const adminManagement = { getAllUsers: () => api.get("/admin/users"), getUserDetails: id => api.get(`/admin/users/${id}`), updateUserStatus: (id, s) => api.patch(`/admin/users/${id}/status`, { status: s }), getAllOrders: () => api.get("/orders/all"), updateOrderStatus: (id, d) => api.put(`/orders/${id}/status`, d) };
export const affiliate = { getAllPartners: () => api.get("/affiliate/partners"), getAllWithdrawals: () => api.get("/affiliate/withdrawals"), getConfig: () => api.get("/affiliate/config"), updatePartnerStatus: (id, s) => api.patch(`/affiliate/partners/${id}/status`, { status: s }), approveWithdrawal: id => api.patch(`/affiliate/withdrawals/${id}/approve`), updateConfig: d => api.put("/affiliate/config", d) };
export const flashSales = { getAll: () => api.get("/flash-sales"), getAllAdmin: () => api.get("/flash-sales"), getActive: () => api.get("/flash-sales/active"), create: d => api.post("/flash-sales", d), update: (id, d) => api.put(`/flash-sales/${id}`, d), delete: id => api.delete(`/flash-sales/${id}`) };
export const support = { getAllAdmin: () => api.get("/contact"), updateStatus: (id, s) => api.patch(`/contact/${id}/status`, { status: s }), delete: id => api.delete(`/contact/${id}`) };
export const loyalty = { getSystemConfig: () => api.get("/settings"), updateSystemConfig: d => api.put("/settings", d), getMembers: () => api.get("/admin/users"), adjustPoints: (u, d) => api.patch(`/admin/users/${u}/status`, d) };
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
