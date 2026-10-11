import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, FileText, Plus, Printer, RefreshCw, Save, Search, Trash2 } from 'lucide-react';
import api from '../../services/api';

const ADMIN = { adminAuth: true };
const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const today = () => localDate(new Date());
const monthStart = date => `${date.slice(0, 7)}-01`;
const emptyExpense = {
  incurred_on: today(), vendor_name: '', supplier_gstin: '', document_reference: '',
  category: 'Operating expense', description: '', taxable_value: '', cgst: '',
  sgst: '', igst: '', total: '', itc_eligible: false,
};

const datePresets = preset => {
  const now = new Date();
  const end = localDate(now);
  if (preset === 'month') return { from: monthStart(end), to: end };
  if (preset === 'quarter') {
    const quarterIndex = Math.floor(((now.getMonth() - 3 + 12) % 12) / 3);
    const quarterMonth = (3 + quarterIndex * 3) % 12;
    const quarterYear = now.getFullYear() - (now.getMonth() < 3 ? 1 : 0);
    const from = localDate(new Date(quarterYear, quarterMonth, 1));
    return { from, to: end };
  }
  const fiscalStartYear = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  return { from: `${fiscalStartYear}-04-01`, to: `${fiscalStartYear + 1}-03-31` };
};

const rupees = value => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export default function GSTAccounting() {
  const [period, setPeriod] = useState(() => datePresets('month'));
  const [profile, setProfile] = useState({
    legal_name: '', gstin: '', address: '', state_code: '19', state_name: 'West Bengal',
    email: '', phone: '', invoice_prefix: 'BV', shipping_sac: '', shipping_gst_rate: '',
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [auditEvents, setAuditEvents] = useState([]);
  const [report, setReport] = useState(null);
  const [expenseForm, setExpenseForm] = useState(null);
  const [productSearch, setProductSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const requestParams = useMemo(() => ({ params: period, ...ADMIN }), [period]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileResponse, productsResponse, ordersResponse, documentsResponse, expensesResponse, reportResponse, auditResponse] = await Promise.all([
        api.get('/gst/profile', ADMIN),
        api.get('/gst/products', { params: { search: productSearch }, ...ADMIN }),
        api.get('/gst/orders-to-invoice', ADMIN),
        api.get('/gst/documents', requestParams),
        api.get('/gst/expenses', requestParams),
        api.get('/gst/reports', requestParams),
        api.get('/gst/audit', requestParams),
      ]);
      if (profileResponse.data) setProfile(current => ({ ...current, ...profileResponse.data }));
      setProducts(productsResponse.data || []);
      setOrders(ordersResponse.data || []);
      setDocuments(documentsResponse.data || []);
      setExpenses(expensesResponse.data || []);
      setReport(reportResponse.data || null);
      setAuditEvents(auditResponse.data || []);
    } catch (loadError) {
      setError(loadError.normalized?.message || loadError.response?.data?.message || 'Could not load GST and accounting data.');
    } finally {
      setLoading(false);
    }
  }, [productSearch, requestParams]);

  useEffect(() => { loadData(); }, [loadData]);

  const saveProfile = async event => {
    event.preventDefault();
    setBusy('profile');
    setError('');
    setMessage('');
    try {
      const response = await api.put('/gst/profile', profile, ADMIN);
      setProfile(current => ({ ...current, ...response.data }));
      setMessage('GST business profile saved.');
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save the GST profile.');
    } finally {
      setBusy('');
    }
  };

  const saveProductTax = async product => {
    setBusy(`product-${product.id}`);
    setError('');
    setMessage('');
    try {
      await api.put(`/gst/products/${product.id}/tax`, {
        gst_hsn_code: product.gst_hsn_code,
        gst_rate: product.gst_rate,
      }, ADMIN);
      setMessage(`GST classification saved for ${product.name}. New orders will keep this tax snapshot.`);
      await loadData();
    } catch (saveError) {
      setError(saveError.response?.data?.message || `Could not save GST classification for ${product.name}.`);
    } finally {
      setBusy('');
    }
  };

  const issueInvoice = async order => {
    if (!window.confirm(`Issue and permanently lock the tax invoice for order #${order.id}? Verify the customer state and HSN/GST rates first.`)) return;
    setBusy(`order-${order.id}`);
    setError('');
    setMessage('');
    try {
      await api.post(`/gst/orders/${order.id}/invoice`, {}, ADMIN);
      setMessage(`Tax invoice issued for order #${order.id}. Issued documents cannot be edited or deleted.`);
      await loadData();
    } catch (issueError) {
      setError(issueError.response?.data?.message || 'Could not issue invoice.');
    } finally {
      setBusy('');
    }
  };

  const saveExpense = async event => {
    event.preventDefault();
    setBusy('expense');
    setError('');
    setMessage('');
    const payload = {
      ...expenseForm,
      taxable_value: Number(expenseForm.taxable_value || 0),
      cgst: Number(expenseForm.cgst || 0),
      sgst: Number(expenseForm.sgst || 0),
      igst: Number(expenseForm.igst || 0),
      total: Number(expenseForm.total || 0),
    };
    try {
      if (expenseForm.id) await api.put(`/gst/expenses/${expenseForm.id}`, payload, ADMIN);
      else await api.post('/gst/expenses', payload, ADMIN);
      setExpenseForm(null);
      setMessage('Expense saved.');
      await loadData();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Could not save expense.');
    } finally {
      setBusy('');
    }
  };

  const archiveExpense = async expense => {
    if (!window.confirm(`Archive expense ${expense.document_reference || `#${expense.id}`}? It will no longer be included in reports but remains stored.`)) return;
    setBusy(`expense-${expense.id}`);
    try {
      await api.delete(`/gst/expenses/${expense.id}`, ADMIN);
      setMessage('Expense archived; its record remains stored.');
      await loadData();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Could not archive expense.');
    } finally {
      setBusy('');
    }
  };

  const issueCreditNote = async document => {
    const reason = window.prompt(`Issue a full-value credit note against ${document.document_number}. Enter the reason:`);
    if (reason === null) return;
    setBusy(`credit-${document.id}`);
    setError('');
    setMessage('');
    try {
      await api.post(`/gst/documents/${document.id}/credit-note`, { reason }, ADMIN);
      setMessage(`Credit note issued for ${document.document_number}.`);
      await loadData();
    } catch (creditError) {
      setError(creditError.response?.data?.message || 'Could not issue credit note.');
    } finally {
      setBusy('');
    }
  };

  const printDocument = async id => {
    setBusy(`print-${id}`);
    try {
      const { data } = await api.get(`/gst/documents/${id}`, ADMIN);
      const lines = data.line_items.map(line => `
        <tr><td>${escapeHtml(line.description)}</td><td>${escapeHtml(line.hsn_sac || '')}</td>
        <td>${escapeHtml(line.quantity)}</td><td>${escapeHtml(line.gst_rate)}%</td>
        <td class="num">${rupees(line.taxable_value)}</td><td class="num">${rupees(line.cgst)}</td>
        <td class="num">${rupees(line.sgst)}</td><td class="num">${rupees(line.igst)}</td>
        <td class="num">${rupees(line.total)}</td></tr>`).join('');
      const seller = data.seller_snapshot;
      const buyer = data.buyer_snapshot;
      const address = buyer.address || {};
      const buyerAddress = typeof address === 'string'
        ? escapeHtml(address)
        : [
          address.street_address || address.address_line1 || address.address_line_1,
          address.line2 || address.address_line2 || address.address_line_2,
          [address.city, address.state, address.postal_code || address.pincode].filter(Boolean).join(', '),
          address.country,
        ].filter(Boolean).map(escapeHtml).join('<br>');
      const popup = window.open('', '_blank');
      if (!popup) throw new Error('Allow pop-ups for this site to print the invoice.');
      popup.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(data.document_number)}</title>
        <style>body{font:14px Arial,sans-serif;color:#17221c;margin:36px}header{display:flex;justify-content:space-between;border-bottom:2px solid #18794e;padding-bottom:16px}h1{margin:0 0 8px;font-size:24px}h2{font-size:15px;margin:20px 0 8px}.muted{color:#52615a}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #cdd8d1;padding:8px;text-align:left}th{background:#eff5f1}.num{text-align:right}.totals{margin:20px 0 0 auto;width:300px}.totals div{display:flex;justify-content:space-between;padding:5px}.grand{font-weight:bold;border-top:2px solid #18794e;margin-top:8px}.notice{border-top:1px solid #ccd5cf;margin-top:32px;padding-top:12px;font-size:11px;color:#52615a}@media print{button{display:none}body{margin:14mm}}</style>
        </head><body><header><div><h1>${escapeHtml(data.document_type === 'credit_note' ? 'CREDIT NOTE' : 'TAX INVOICE')}</h1>
        <div><b>${escapeHtml(seller.legal_name)}</b></div><div>${escapeHtml(seller.address)}</div>
        <div>GSTIN: ${escapeHtml(seller.gstin)} | ${escapeHtml(seller.state_name)}</div></div>
        <div><b>Document No.</b> ${escapeHtml(data.document_number)}<br>
        <b>Date</b> ${escapeHtml(String(data.issue_date).slice(0, 10))}<br>
        <b>Order</b> #${escapeHtml(data.order_id)}<br>
        <b>Place of supply</b> ${escapeHtml(buyer.place_of_supply)} (${escapeHtml(data.place_of_supply_code)})</div></header>
        <div class="grid"><section><h2>Bill to</h2><div><b>${escapeHtml(buyer.name)}</b></div>
        <div>${buyerAddress}</div><div>${escapeHtml(buyer.phone || '')}</div><div>${buyer.gstin ? `GSTIN: ${escapeHtml(buyer.gstin)}` : 'Unregistered recipient'}</div></section>
        <section><h2>Original invoice / transaction</h2><div>Reference: ${escapeHtml(data.document_type === 'credit_note' ? data.original_document_number : data.document_number)}</div>
        <div>Payment status is recorded in the order system.</div></section></div>
        <table><thead><tr><th>Description</th><th>HSN/SAC</th><th>Qty</th><th>Rate</th><th>Taxable</th><th>CGST</th><th>SGST</th><th>IGST</th><th>Total</th></tr></thead><tbody>${lines}</tbody></table>
        <div class="totals"><div><span>Taxable value</span><b>${rupees(data.taxable_value)}</b></div>
        <div><span>CGST</span><b>${rupees(data.cgst)}</b></div><div><span>SGST</span><b>${rupees(data.sgst)}</b></div>
        <div><span>IGST</span><b>${rupees(data.igst)}</b></div><div class="grand"><span>Total</span><b>${rupees(data.total)}</b></div></div>
        <div class="notice">Computer-generated document. This is not an IRP-registered e-invoice and does not contain an IRN or signed QR code. If IRP reporting applies to this transaction, complete registration through an authorized IRP/GSP flow before treating it as a compliant e-invoice. Verify particulars with your CA.</div>
        <script>window.onload=()=>window.print()</script></body></html>`);
      popup.document.close();
    } catch (printError) {
      setError(printError.message || printError.response?.data?.message || 'Could not open invoice for printing.');
    } finally {
      setBusy('');
    }
  };

  const exportWorkbook = async () => {
    setBusy('export');
    setError('');
    try {
      const response = await api.get('/gst/reports/export.xlsx', {
        params: period, responseType: 'blob', ...ADMIN,
      });
      const url = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Bhumivera_GST_Working_Papers_${period.from}_${period.to}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError.response?.data?.message || 'Could not export the CA workbook.');
    } finally {
      setBusy('');
    }
  };

  const updateProduct = (id, field, value) => setProducts(current => current.map(product =>
    product.id === id ? { ...product, [field]: value } : product
  ));

  return (
    <div className="space-y-6 p-4 md:p-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-black text-white"><FileText className="text-emerald-400" /> GST & Books</h2>
          <p className="mt-1 text-sm text-slate-400">Invoices, tax classifications, expenses, and CA working papers.</p>
        </div>
        <button type="button" onClick={loadData} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm text-white disabled:opacity-50">
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </header>

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
        This module creates records and CA working papers; it does not file returns or register invoices with the IRP. An IRN/signed QR workflow requires IRP/GSP integration where legally applicable. Issued documents are locked. Product GST classifications and ITC eligibility must be verified with your CA.
      </div>
      {error && <div role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>}
      {message && <div role="status" className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{message}</div>}

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <h3 className="mb-4 text-lg font-bold text-white">GST business profile</h3>
        <form onSubmit={saveProfile} className="grid gap-4 md:grid-cols-2">
          {[
            ['legal_name', 'Legal name', true], ['gstin', 'GSTIN', true],
            ['address', 'Registered business address', true], ['state_name', 'Registered state', true],
            ['state_code', 'GST state code', true], ['invoice_prefix', 'Invoice prefix', true],
            ['email', 'Business email', false], ['phone', 'Business phone', false],
            ['shipping_sac', 'Shipping SAC', false], ['shipping_gst_rate', 'Shipping GST rate (%)', false],
          ].map(([key, label, required]) => (
            <label key={key} className={key === 'address' ? 'md:col-span-2' : ''}>
              <span className="mb-1 block text-xs font-semibold text-slate-400">{label}</span>
              <input required={required} value={profile[key] ?? ''} onChange={event => setProfile(current => ({ ...current, [key]: event.target.value }))}
                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-white outline-none focus:border-emerald-400" />
            </label>
          ))}
          <div className="flex items-center gap-2 md:col-span-2">
            <button disabled={busy === 'profile'} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-bold text-slate-950 disabled:opacity-50"><Save size={16} /> Save GST profile</button>
            <span className="text-xs text-slate-500">GSTIN is stored in your application database; never paste API credentials here.</span>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="text-lg font-bold text-white">Product HSN/SAC & GST rates</h3><p className="text-xs text-slate-500">Applies to new orders. Older orders use the saved order snapshot where available.</p></div>
          <label className="flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2">
            <Search size={15} className="text-slate-400" /><input value={productSearch} onChange={event => setProductSearch(event.target.value)} placeholder="Search products" className="w-40 bg-transparent text-sm text-white outline-none" />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Product</th><th>SKU</th><th>HSN</th><th>GST rate (%)</th><th /></tr></thead>
            <tbody>{products.map(product => <tr key={product.id} className="border-t border-slate-800">
              <td className="py-3 pr-3 font-semibold text-white">{product.name}</td><td className="text-slate-400">{product.sku || '—'}</td>
              <td><input value={product.gst_hsn_code || ''} onChange={event => updateProduct(product.id, 'gst_hsn_code', event.target.value)} aria-label={`HSN code for ${product.name}`} className="w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white" /></td>
              <td><input type="number" min="0" max="100" step="0.01" value={product.gst_rate ?? ''} onChange={event => updateProduct(product.id, 'gst_rate', event.target.value)} aria-label={`GST rate for ${product.name}`} className="w-28 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-white" /></td>
              <td className="text-right"><button type="button" disabled={busy === `product-${product.id}`} onClick={() => saveProductTax(product)} className="rounded-lg border border-emerald-500/50 px-3 py-1.5 text-xs font-bold text-emerald-300 disabled:opacity-50">Save</button></td>
            </tr>)}
            {!products.length && <tr><td colSpan="5" className="py-5 text-center text-slate-500">{loading ? 'Loading products…' : 'No products found.'}</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <h3 className="mb-3 text-lg font-bold text-white">Ready to invoice</h3>
        <p className="mb-4 text-xs text-slate-500">Shipped/delivered orders only. Legacy orders use current product classifications when no tax snapshot exists—check them before issue.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Order</th><th>Order date</th><th>Customer</th><th>Status</th><th>Total</th><th /></tr></thead>
            <tbody>{orders.map(order => <tr key={order.id} className="border-t border-slate-800">
              <td className="py-3 font-bold text-white">#{order.id}</td><td className="text-slate-400">{String(order.created_at).slice(0, 10)}</td>
              <td className="text-slate-300">{order.customer_name || order.customer_email || 'Customer'}</td><td className="capitalize text-slate-400">{order.status}</td>
              <td className="text-slate-200">{rupees(order.total)}</td><td className="text-right"><button type="button" disabled={busy === `order-${order.id}`} onClick={() => issueInvoice(order)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 disabled:opacity-50">Issue invoice</button></td>
            </tr>)}
            {!orders.length && <tr><td colSpan="6" className="py-5 text-center text-slate-500">{loading ? 'Loading orders…' : 'No shipped/delivered orders need invoicing.'}</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div><h3 className="text-lg font-bold text-white">CA working papers</h3><p className="text-xs text-slate-500">Invoices and expenses for the selected period; credit notes appear as negative entries.</p></div>
          <div className="flex flex-wrap gap-2">
            {['month', 'quarter', 'year'].map(preset => <button key={preset} type="button" onClick={() => setPeriod(datePresets(preset))} className="rounded border border-slate-700 px-3 py-2 text-xs capitalize text-white hover:border-emerald-400">{preset === 'year' ? 'Financial year' : preset === 'quarter' ? 'Financial quarter' : 'This month'}</button>)}
            <input type="date" value={period.from} onChange={event => setPeriod(value => ({ ...value, from: event.target.value }))} className="rounded border border-slate-700 bg-slate-950 px-2 text-sm text-white" />
            <input type="date" value={period.to} onChange={event => setPeriod(value => ({ ...value, to: event.target.value }))} className="rounded border border-slate-700 bg-slate-950 px-2 text-sm text-white" />
            <button type="button" disabled={busy === 'export'} onClick={exportWorkbook} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950 disabled:opacity-50"><Download size={15} /> Export Excel</button>
          </div>
        </div>
        {report && <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ['Taxable sales', report.sales?.taxable_sales],
            ['CGST + SGST', Number(report.sales?.cgst || 0) + Number(report.sales?.sgst || 0)],
            ['IGST', report.sales?.igst],
            ['Entered expenses', report.expenses?.expenses],
            ['Estimated P&L', report.estimated_profit_loss],
          ].map(([label, value]) => <div key={label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"><div className="text-xs text-slate-500">{label}</div><div className="mt-1 font-bold text-white">{rupees(value)}</div></div>)}
        </div>}
        <p className="mb-4 text-xs text-amber-200">P&amp;L is estimated from recorded taxable sales minus entered expenses. Add all inventory costs, payroll, fees, and other costs; this is not a complete statutory financial statement.</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Document</th><th>Date</th><th>Type</th><th>Taxable</th><th>Tax</th><th>Total</th><th /></tr></thead>
            <tbody>{documents.map(document => <tr key={document.id} className="border-t border-slate-800">
              <td className="py-3 font-semibold text-white">{document.document_number}</td><td className="text-slate-400">{String(document.issue_date).slice(0, 10)}</td>
              <td className="capitalize text-slate-300">{document.document_type.replace('_', ' ')}</td><td className="text-slate-300">{rupees(document.taxable_value)}</td>
              <td className="text-slate-300">{rupees(Number(document.cgst) + Number(document.sgst) + Number(document.igst))}</td><td className="text-slate-300">{rupees(document.total)}</td>
              <td className="whitespace-nowrap text-right">
                <button type="button" title="Print" onClick={() => printDocument(document.id)} className="mr-2 rounded border border-slate-700 p-2 text-slate-300"><Printer size={15} /></button>
                {document.document_type === 'invoice' && <button type="button" disabled={busy === `credit-${document.id}`} onClick={() => issueCreditNote(document)} title="Create full-value credit note" className="rounded border border-amber-500/40 px-2 py-1 text-xs text-amber-200 disabled:opacity-50">Credit note</button>}
              </td>
            </tr>)}
            {!documents.length && <tr><td colSpan="7" className="py-5 text-center text-slate-500">{loading ? 'Loading documents…' : 'No documents in this period.'}</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="text-lg font-bold text-white">Expense register</h3><p className="text-xs text-slate-500">Enter expense receipts and mark input tax credit only after CA review.</p></div>
          <button type="button" onClick={() => setExpenseForm({ ...emptyExpense })} className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-slate-950"><Plus size={15} /> Add expense</button>
        </div>
        {expenseForm && <form onSubmit={saveExpense} className="mb-5 grid gap-3 rounded-xl border border-slate-700 bg-slate-950/50 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ['incurred_on', 'Date', 'date'], ['vendor_name', 'Vendor', 'text'],
            ['supplier_gstin', 'Supplier GSTIN', 'text'], ['document_reference', 'Bill/reference no.', 'text'],
            ['category', 'Category (include COGS where applicable)', 'text'], ['description', 'Description', 'text'],
            ['taxable_value', 'Taxable value', 'number'], ['cgst', 'CGST', 'number'],
            ['sgst', 'SGST', 'number'], ['igst', 'IGST', 'number'], ['total', 'Total incl. GST', 'number'],
          ].map(([key, label, type]) => <label key={key}><span className="mb-1 block text-xs text-slate-400">{label}</span>
            <input required={['incurred_on', 'vendor_name', 'category', 'description', 'total'].includes(key)} type={type} step={type === 'number' ? '0.01' : undefined} value={expenseForm[key] ?? ''} onChange={event => setExpenseForm(current => ({ ...current, [key]: event.target.value }))} className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-2 text-sm text-white" />
          </label>)}
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-300"><input type="checkbox" checked={Boolean(expenseForm.itc_eligible)} onChange={event => setExpenseForm(current => ({ ...current, itc_eligible: event.target.checked }))} /> ITC eligible (CA verified)</label>
          <div className="flex gap-2 sm:col-span-2 lg:col-span-3"><button disabled={busy === 'expense'} className="rounded bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 disabled:opacity-50">{expenseForm.id ? 'Update expense' : 'Save expense'}</button><button type="button" onClick={() => setExpenseForm(null)} className="rounded border border-slate-700 px-4 py-2 text-sm text-white">Cancel</button></div>
        </form>}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">Date</th><th>Vendor / reference</th><th>Category</th><th>Taxable</th><th>Total</th><th>ITC</th><th /></tr></thead>
            <tbody>{expenses.map(expense => <tr key={expense.id} className="border-t border-slate-800">
              <td className="py-3 text-slate-400">{String(expense.incurred_on).slice(0, 10)}</td>
              <td className="text-white">{expense.vendor_name}<div className="text-xs text-slate-500">{expense.document_reference || ''}</div></td>
              <td className="text-slate-300">{expense.category}</td><td className="text-slate-300">{rupees(expense.taxable_value)}</td><td className="text-slate-300">{rupees(expense.total)}</td>
              <td className="text-slate-400">{expense.itc_eligible ? 'Yes' : 'No'}</td>
              <td className="whitespace-nowrap text-right"><button type="button" onClick={() => setExpenseForm({ ...expense, itc_eligible: Boolean(expense.itc_eligible) })} className="mr-2 rounded border border-slate-700 px-2 py-1 text-xs text-white">Edit</button><button type="button" disabled={busy === `expense-${expense.id}`} onClick={() => archiveExpense(expense)} title="Archive expense" className="rounded border border-rose-500/30 p-2 text-rose-300 disabled:opacity-50"><Trash2 size={14} /></button></td>
            </tr>)}
            {!expenses.length && <tr><td colSpan="7" className="py-5 text-center text-slate-500">No expenses entered for this period.</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-[#10241f]/60 p-5">
        <h3 className="mb-3 text-lg font-bold text-white">Audit history</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="text-xs uppercase text-slate-500"><tr><th className="py-2">When</th><th>Record</th><th>Action</th><th>Admin</th><th>Details</th></tr></thead>
            <tbody>{auditEvents.map(event => <tr key={`${event.entity_type}-${event.id}`} className="border-t border-slate-800">
              <td className="py-3 text-slate-400">{String(event.created_at).slice(0, 19).replace('T', ' ')}</td>
              <td className="text-slate-300">{event.entity_type} #{event.entity_id}</td>
              <td className="text-slate-300">{event.action}</td>
              <td className="text-slate-400">{event.performed_by}</td>
              <td className="max-w-sm truncate text-xs text-slate-500">{JSON.stringify(event.details || {})}</td>
            </tr>)}
            {!auditEvents.length && <tr><td colSpan="5" className="py-5 text-center text-slate-500">No changes recorded for this period.</td></tr>}</tbody>
          </table>
        </div>
      </section>

      <div className="flex items-center gap-2 text-xs text-slate-500"><FileText size={14} /> Issued invoices are immutable; correction in this release is by a single full-value credit note per invoice. Expense deletion is archival, not physical deletion.</div>
    </div>
  );
}
