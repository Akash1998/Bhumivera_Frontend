import { FlaskConical } from 'lucide-react';

export default function ABExperimentLab() {
  return (
    <section className="admin-glass-panel rounded-2xl border border-amber-300/20 p-6 text-slate-100" aria-labelledby="experiments-unavailable-title">
      <div className="flex items-start gap-3">
        <FlaskConical size={20} className="mt-1 shrink-0 text-amber-200" aria-hidden="true" />
        <div>
          <h2 id="experiments-unavailable-title" className="text-xl font-semibold text-white">A/B testing unavailable</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-100">
            The current experiment registry only stores labels. It does not assign customers to variants or measure exposures, conversions, or statistical results. Experiment creation and winner selection are disabled so this page cannot present simulated activity as measured evidence.
          </p>
        </div>
      </div>
    </section>
  );
}
