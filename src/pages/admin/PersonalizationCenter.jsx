import { Sparkles } from 'lucide-react';

const signals = [
  ['Product views', 'Recorded only while the customer has opted in; deleted when consent is withdrawn.'],
  ['Saved products', 'Wishlist items used only for customers who have opted in.'],
  ['Orders and reviews', 'Purchases and approved reviews used only for opted-in customers.'],
];

export default function PersonalizationCenter() {
  return (
    <section aria-labelledby="personalization-title" className="max-w-3xl space-y-5 text-slate-100">
      <header className="flex items-start gap-3">
        <span className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300"><Sparkles size={18}/></span>
        <div>
          <h3 id="personalization-title" className="text-base font-semibold text-white">Automatic product suggestions</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            Only customers with current, explicit personalization consent receive suggestions based on their activity. Other customers are not tracked for recommendations.
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
        Paid ads, cross-site tracking, precise location, Wi-Fi names, device fingerprints and raw-IP ad profiles are not used by this feature.
      </p>
    </section>
  );
}
