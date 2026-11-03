/**
 * BhumiVera Enterprise Storage Engine (Synchronized API Layer)
 * - Directly synced with Server SQLite ACID Database
 * - Zero 5MB LocalStorage Quota Limitations
 * - Atomic Concurrency Safe POS Transactions
 */

const BVStore = (() => {
    let state = {
        i: [],  // Items
        c: [],  // Customers
        s: [],  // Sales
        l: [],  // Logs
        p: [],  // Payment Proofs
        cfg: {
            storeName: 'BhumiVera Enterprises',
            tagline: 'Rooted in nature. Made for your everyday',
            address: '1628/1, Madarsa Road, Kashmere Gate, Delhi, 110006',
            phone: '+91 98765 43210',
            email: 'billing@bhumivera.com',
            website: 'www.bhumivera.com',
            gstin: '07AAAAA0000A1Z5',
            upiId: 'bhumivera@okhdfcbank',
            currency: '₹',
            taxRate: 0,
            cats: ['General', 'Electronics', 'Spares', 'Accessories', 'Raw Material', 'Packaging'],
            uoms: ['Pcs', 'Kg', 'Box', 'Ltr', 'Mtr', 'Pkt'],
            logo: '../assets/logo.png'
        }
    };

    let isInitialized = false;

    const API_BASE = (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1')
        ? 'https://service.bhumivera.com'
        : '';

    async function api(url, options = {}) {
        const defaultHeaders = { 'Content-Type': 'application/json' };
        const targetUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;
        const res = await fetch(targetUrl, {
            ...options,
            credentials: 'include',
            headers: options.body instanceof FormData ? {} : { ...defaultHeaders, ...(options.headers || {}) }
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.error || 'API Request failed');
        }
        return data;
    }

    async function syncAll() {
        try {
            const [itemsRes, custRes, salesRes, configRes, proofsRes, logsRes] = await Promise.all([
                api('/api/inventory/items').catch(() => ({ items: [] })),
                api('/api/customers').catch(() => ({ customers: [] })),
                api('/api/pos/sales').catch(() => ({ sales: [] })),
                api('/api/admin/config').catch(() => ({ config: {} })),
                api('/api/customers/proofs/all').catch(() => ({ proofs: [] })),
                api('/api/admin/logs').catch(() => ({ logs: [] }))
            ]);

            state.i = itemsRes.items || [];
            state.c = custRes.customers || [];
            state.s = salesRes.sales || [];
            state.p = proofsRes.proofs || [];
            state.l = logsRes.logs || [];
            if (configRes.config && Object.keys(configRes.config).length > 0) {
                state.cfg = { ...state.cfg, ...configRes.config };
            }
            isInitialized = true;
            return state;
        } catch (err) {
            console.error('Initial sync error:', err);
            return state;
        }
    }

    return {
        // Asynchronous & Synchronous Initializers
        async sync() {
            return await syncAll();
        },

        load() {
            if (!isInitialized) {
                syncAll();
            }
            return state;
        },

        getData() {
            return state;
        },

        // --- INVENTORY ITEM CRUD ---
        getItems() {
            return state.i;
        },

        getItemById(id) {
            return state.i.find(item => item.id == id);
        },

        getItemByBarcode(barcode) {
            if (!barcode) return null;
            const term = barcode.trim().toLowerCase();
            return state.i.find(item =>
                (item.barcode && item.barcode.toLowerCase() === term) ||
                (item.sku && item.sku.toLowerCase() === term)
            );
        },

        async saveItem(itemData) {
            if (itemData.id) {
                // Update
                await api(`/api/inventory/items/${itemData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(itemData)
                });
                const idx = state.i.findIndex(x => x.id == itemData.id);
                if (idx !== -1) {
                    state.i[idx] = { ...state.i[idx], ...itemData };
                }
            } else {
                // Create
                const res = await api('/api/inventory/items', {
                    method: 'POST',
                    body: JSON.stringify(itemData)
                });
                const newItem = {
                    id: res.id,
                    ...itemData,
                    qty: parseFloat(itemData.qty) || 0,
                    costPrice: parseFloat(itemData.costPrice) || 0,
                    price: parseFloat(itemData.price) || 0,
                    minStock: parseFloat(itemData.minStock) || 5,
                    uom: itemData.uom || 'Pcs',
                    soldQty: 0
                };
                state.i.push(newItem);
            }
            return true;
        },

        async deleteItem(id) {
            await api(`/api/inventory/items/${id}`, { method: 'DELETE' });
            state.i = state.i.filter(x => x.id != id);
            return true;
        },

        async quickAdjustStock(itemId, deltaQty, reason = 'Quick Adjustment') {
            const res = await api('/api/inventory/adjust', {
                method: 'POST',
                body: JSON.stringify({ itemId, deltaQty, reason })
            });
            const item = state.i.find(x => x.id == itemId);
            if (item) item.qty = res.newQty;
            return res.newQty;
        },

        // --- CUSTOMER & KHATA LEDGER ---
        getCustomers() {
            return state.c;
        },

        getCustomerById(id) {
            return state.c.find(c => c.id == id);
        },

        async saveCustomer(custData) {
            if (custData.id) {
                await api(`/api/customers/${custData.id}`, {
                    method: 'PUT',
                    body: JSON.stringify(custData)
                });
                const idx = state.c.findIndex(c => c.id == custData.id);
                if (idx !== -1) {
                    state.c[idx] = { ...state.c[idx], ...custData };
                }
            } else {
                const res = await api('/api/customers', {
                    method: 'POST',
                    body: JSON.stringify(custData)
                });
                state.c.push({
                    id: res.id,
                    ...custData,
                    wallet: parseFloat(custData.wallet) || 0,
                    creditLimit: parseFloat(custData.creditLimit) || 50000,
                    createdAt: new Date().toISOString()
                });
            }
            return true;
        },

        async deleteCustomer(id) {
            await api(`/api/customers/${id}`, { method: 'DELETE' });
            state.c = state.c.filter(c => c.id != id);
            return true;
        },

        async recordKhataTransaction(customerId, type, amount, note, proofFile = null) {
            let body;
            if (proofFile instanceof File || proofFile instanceof Blob) {
                body = new FormData();
                body.append('type', type);
                body.append('amount', amount);
                body.append('note', note || '');
                body.append('proofFile', proofFile);
            } else {
                body = JSON.stringify({ type, amount, note });
            }

            const res = await api(`/api/customers/${customerId}/khata`, {
                method: 'POST',
                body
            });

            const cust = state.c.find(c => c.id == customerId);
            if (cust) {
                cust.wallet = res.newBalance;
            }

            if (type === 'RECEIVE_PAYMENT') {
                state.p.unshift({
                    id: Date.now(),
                    t: new Date().toISOString(),
                    cust: cust ? cust.name : 'Customer',
                    amt: parseFloat(amount),
                    note: note || 'Khata Payment',
                    src: res.proofUrl || null
                });
            }

            return res.newBalance;
        },

        // --- SALES & POS (ATOMIC BACKEND SAFE) ---
        getSales() {
            return state.s;
        },

        async processSale(salePayload) {
            const res = await api('/api/pos/sale', {
                method: 'POST',
                body: JSON.stringify({
                    customerId: salePayload.customer ? salePayload.customer.id : null,
                    items: salePayload.items,
                    extraCharges: salePayload.extraCharges,
                    discount: salePayload.discount,
                    taxRate: salePayload.taxRate,
                    paidAmount: salePayload.paidAmount,
                    paymentMode: salePayload.paymentMode
                })
            });

            const saleRecord = res.sale;
            state.s.unshift(saleRecord);

            // Deduct stock in local cache
            saleRecord.items.forEach(cartItem => {
                const item = state.i.find(x => x.id == cartItem.id);
                if (item) {
                    item.qty = Math.max(0, (item.qty || 0) - cartItem.q);
                    item.soldQty = (item.soldQty || 0) + cartItem.q;
                }
            });

            // Update local customer wallet balance
            if (salePayload.customer) {
                const cust = state.c.find(c => c.id == salePayload.customer.id);
                if (cust) {
                    cust.wallet = saleRecord.newBal;
                }
            }

            return saleRecord;
        },

        async cancelSale(saleId) {
            await api(`/api/pos/sales/${saleId}/cancel`, { method: 'POST' });
            const sale = state.s.find(s => s.id == saleId);
            if (sale) {
                sale.status = 'cancelled';
                // Restock locally
                sale.items.forEach(soldItem => {
                    const item = state.i.find(x => x.id == soldItem.id);
                    if (item) {
                        item.qty = (item.qty || 0) + soldItem.q;
                        item.soldQty = Math.max(0, (item.soldQty || 0) - soldItem.q);
                    }
                });
            }
            return true;
        },

        // --- STOCK ADJUSTMENT & RETURNS ---
        async adjustStockItem(itemId, qty, reason) {
            await this.quickAdjustStock(itemId, -qty, reason);
            return true;
        },

        async processReturn(customerId, itemId, qty, mode) {
            await api('/api/inventory/return', {
                method: 'POST',
                body: JSON.stringify({ customerId, itemId, qty, conditionMode: mode })
            });
            if (mode === 'GOOD') {
                const item = state.i.find(x => x.id == itemId);
                if (item) item.qty += qty;
            }
            return true;
        },

        // --- SYSTEM CONFIG & LOGS ---
        getConfig() {
            return state.cfg;
        },

        async updateConfig(newCfg) {
            await api('/api/admin/config', {
                method: 'PUT',
                body: JSON.stringify(newCfg)
            });
            state.cfg = { ...state.cfg, ...newCfg };
            return state.cfg;
        },

        setLogo(url) {
            state.cfg.logo = url;
        },

        getLogs() {
            return state.l;
        },

        getProofs() {
            return state.p;
        }
    };
})();

if (typeof window !== 'undefined') {
    window.BVStore = BVStore;
    BVStore.load();
}
