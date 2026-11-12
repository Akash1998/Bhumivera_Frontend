import { lazy, Suspense, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LoaderCircle, Settings2, ShoppingCart, Tag } from 'lucide-react';

const CartCheckoutSettings = lazy(() => import('./CartCheckoutSettings'));
const CartRulesEngine = lazy(() => import('./CartRulesEngine'));
const CouponManagement = lazy(() => import('./CouponManagement'));

const tools = [
  { id: 'settings', label: 'Delivery & cart settings', description: 'Shipping threshold, delivery charges, cart behavior, abandoned-cart coupons.', component: CartCheckoutSettings },
  { id: 'rules', label: 'Cart rules & rewards', description: 'Order thresholds, gifts, discounts, bonus points, and rule-based free delivery.', component: CartRulesEngine },
  { id: 'coupons', label: 'Coupons', description: 'Coupon codes, eligibility, and coupon-based delivery benefits.', component: CouponManagement },
];

const toolForTab = tab => {
  if (tab === 'cart-rules' || tab === 'min-cart-value') return 'rules';
  if (tab === 'coupons') return 'coupons';
  return 'settings';
};

const tabForTool = id => id === 'rules' ? 'cart-rules' : id === 'coupons' ? 'coupons' : 'cart-checkout';

export default function CartCheckoutHub() {
  const navigate = useNavigate();
  const { tab } = useParams();
  const [selectedId, setSelectedId] = useState(() => toolForTab(tab));
  const selected = tools.find(tool => tool.id === selectedId) || tools[0];
  const Tool = selected.component;
  const SelectedIcon = selected.id === 'settings' ? Settings2 : selected.id === 'rules' ? ShoppingCart : Tag;

  useEffect(() => {
    setSelectedId(toolForTab(tab));
  }, [tab]);

  const chooseTool = tool => {
    setSelectedId(tool.id);
    navigate(`/admin/dashboard/${tabForTool(tool.id)}`, { replace: true });
  };

  return (
    <main className="space-y-5 text-slate-100">
      <header className="border-b border-white/10 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">One place for bag and checkout controls</p>
        <h2 className="mt-2 text-2xl font-bold text-white">Cart &amp; Checkout</h2>
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
          Manage delivery pricing, cart thresholds, rewards, and coupons here. Free delivery exceptions are called out so the configured threshold is easier to understand.
        </p>
      </header>

      <nav aria-label="Cart and checkout tools" className="grid gap-2 sm:grid-cols-3">
        {tools.map(tool => {
          const Icon = tool.id === 'settings' ? Settings2 : tool.id === 'rules' ? ShoppingCart : Tag;
          const active = selected.id === tool.id;
          return (
            <button key={tool.id} type="button" aria-pressed={active} onClick={() => chooseTool(tool)} className={`rounded-xl border p-3 text-left transition ${active ? 'border-emerald-400/50 bg-emerald-400/10' : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'}`}>
              <span className="flex items-center gap-2 text-sm font-semibold text-white"><Icon size={16} className="text-emerald-300"/>{tool.label}</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">{tool.description}</span>
            </button>
          );
        })}
      </nav>

      <section aria-labelledby="cart-checkout-tool-title" className="min-w-0 rounded-xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
        <header className="mb-5 flex items-start gap-3 border-b border-white/10 pb-4">
          <span className="rounded-lg border border-emerald-300/20 bg-emerald-300/10 p-2 text-emerald-200"><SelectedIcon size={18}/></span>
          <div>
            <h3 id="cart-checkout-tool-title" className="text-lg font-semibold text-white">{selected.label}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-400">{selected.description}</p>
          </div>
        </header>
        <Suspense fallback={<p role="status" className="flex items-center gap-2 text-sm text-slate-400"><LoaderCircle size={16} className="animate-spin"/>Loading {selected.label.toLowerCase()}…</p>}>
          <Tool/>
        </Suspense>
      </section>
    </main>
  );
}
