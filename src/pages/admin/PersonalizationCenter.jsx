import { Sparkles } from 'lucide-react';

const signals = [
  ['Product views', 'Products a customer has explored.'],
  ['Saved products', 'Items added to a customer’s wishlist.'],
  ['Orders and reviews', 'Products a customer has bought or reviewed.'],
];

export default function PersonalizationCenter() {
  return (
    <section aria-labelledby="personalization-title" className="max-w-3xl space-y-5 text-slate-100">
      <header className="flex items-start gap-3">
        <span className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300"><Sparkles size={18}/></span>
        <div>
          <h3 id="personalization-title" className="text-base font-semibold text-white">Automatic product suggestions</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Signed-in customers see suggestions on the home page. Suggestions use their activity; if there is not enough activity yet, popular products are shown instead.
          </p>
        </div>
      </header>
      <div className="grid gap-3 sm:grid-cols-3">
        {signals.map(([title, description]) => (
          <article key={title} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <h4 className="text-sm font-semibold text-white">{title}</h4>
            <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
          </article>
        ))}
      </div>
      <p className="border-l-2 border-emerald-400/60 pl-3 text-xs leading-5 text-slate-400">
        Recommendations update automatically. There are no manual weights or switches here because those settings are not connected to the recommendation engine.
      </p>
    </section>
  );
}
