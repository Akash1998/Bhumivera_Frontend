import { useMemo, useState } from 'react';
import { ArrowRight, Check, CircleHelp, Leaf, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = {
  face: {
    name: 'Charcoal face wash',
    labelName: 'Facewash',
    search: 'face wash',
    description: 'A face-wash label supplied with your message lists charcoal and several other ingredients.',
    fragrance: 'listed',
    ingredients: [
      ['Charcoal', '3%'],
      ['Haridra (turmeric)', '0.5%'],
      ['Neem', '0.5%'],
      ['Glycerin', '5%'],
      ['Cucumber extract', '0.5%'],
      ['Manjistha extract', '0.5%'],
      ['Hyaluronic acid', '0.1%'],
      ['Niacinamide', '0.1%'],
      ['Perfume', '0.5%'],
      ['Base', 'Quantity sufficient'],
    ],
    preferences: [
      { id: 'charcoal', label: 'I want to see a face wash listing charcoal', ingredient: 'Charcoal' },
      { id: 'glycerin', label: 'I want to see a face wash listing glycerin', ingredient: 'Glycerin' },
      { id: 'any', label: 'Show me the face-wash label details', ingredient: null },
    ],
  },
  hair: {
    name: 'Botanical shampoo',
    labelName: 'Shampoo',
    search: 'shampoo',
    description: 'A shampoo label supplied with your message lists traditional plant ingredients and rosemary oil.',
    fragrance: 'unclear',
    ingredients: [
      ['Triphala', '10 mg'],
      ['Amla', '20 mg'],
      ['Ritta (spelling as shown on label)', '25 mg'],
      ['Shikhakai (spelling as shown on label)', '5 mg'],
      ['Bringna (spelling as shown on label)', '10 mg'],
      ['Rosemary oil', '10 mg'],
      ['Neem', '10 mg'],
      ['Aloe vera (label spelling: “Aleovera”)', '10 mg'],
      ['Shampoo base', 'Quantity sufficient'],
    ],
    preferences: [
      { id: 'amla', label: 'I want to see a shampoo listing amla', ingredient: 'Amla' },
      { id: 'shikakai', label: 'I want to see a shampoo listing shikhakai', ingredient: 'Shikhakai' },
      { id: 'any', label: 'Show me the shampoo label details', ingredient: null },
    ],
  },
};

const safetyChoices = [
  { id: 'none', label: 'No known ingredient concerns' },
  { id: 'fragrance', label: 'I need a fragrance-free product' },
  { id: 'sensitivity', label: 'I have a known sensitivity or allergy' },
  { id: 'unsure', label: 'I am not sure yet' },
];

function Choice({ name, value, selected, onSelect }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(value)}
      className={`flex min-h-14 w-full items-center justify-between gap-4 border px-4 py-3 text-left text-sm transition-colors ${
        selected
          ? 'border-[#d6dfbd] bg-[#d6dfbd]/10 text-white'
          : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-white/30'
      }`}
    >
      <span>{name}</span>
      {selected && <Check size={17} className="shrink-0 text-[#d6dfbd]" aria-hidden="true" />}
    </button>
  );
}

export default function SomaticRegistry() {
  const [routine, setRoutine] = useState('');
  const [preference, setPreference] = useState('');
  const [safety, setSafety] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const currentProduct = routine ? products[routine] : null;
  const selectedPreference = currentProduct?.preferences.find((item) => item.id === preference);
  const result = useMemo(() => {
    if (!submitted || !currentProduct || !selectedPreference || !safety) return null;
    if (safety !== 'none') return null;
    return currentProduct;
  }, [currentProduct, safety, selectedPreference, submitted]);

  const canSubmit = Boolean(routine && preference && safety);

  const reset = () => {
    setRoutine('');
    setPreference('');
    setSafety('');
    setSubmitted(false);
  };

  return (
    <main className="min-h-screen bg-[#101713] pb-20 font-sans text-[#f4f2e9]">
      <section className="border-b border-white/10 bg-[radial-gradient(ellipse_at_top,_rgba(92,117,77,0.22),_transparent_62%)] px-5 pb-14 pt-28 sm:px-8 sm:pb-20 sm:pt-36">
        <div className="mx-auto max-w-4xl">
          <p className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d6dfbd]">
            <Leaf size={14} aria-hidden="true" /> A label-led product guide
          </p>
          <h1 className="mt-6 max-w-3xl font-serif text-4xl leading-tight tracking-tight sm:text-6xl">
            Somatic Registry
          </h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/65 sm:text-base">
            Answer a few practical questions to see whether one of the two product labels you shared matches what you are looking for. This guide compares stated preferences with ingredients shown on those labels; it does not diagnose skin or scalp conditions or predict results.
          </p>
          <div className="mt-6 flex items-start gap-3 border-l border-[#d6dfbd]/60 pl-4 text-xs leading-6 text-white/55">
            <CircleHelp size={16} className="mt-1 shrink-0 text-[#d6dfbd]" aria-hidden="true" />
            <p>
              The photos are not a substitute for clear, current packaging or a confirmed product listing. Ingredient names and amounts below are transcribed from the supplied images and should be checked against the item in hand.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14 lg:px-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#bdc9a4]">A few questions first</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">Start with your routine, not a diagnosis.</h2>
          <p className="mt-4 text-sm leading-7 text-white/55">
            There are no scores, hidden health inferences or batch-authentication claims here. A result appears only when your selected category and ingredient preference match a label and you report no known concern.
          </p>
          <div className="mt-8 space-y-4 border-t border-white/10 pt-6 text-xs leading-6 text-white/50">
            <p className="flex gap-3"><ShieldCheck size={16} className="mt-1 shrink-0 text-[#bdc9a4]" aria-hidden="true" /> If you have a known allergy, recurring irritation, or need fragrance-free products, this guide will not recommend either label.</p>
            <p className="flex gap-3"><CircleHelp size={16} className="mt-1 shrink-0 text-[#bdc9a4]" aria-hidden="true" /> Ingredient presence alone does not establish a benefit or tell us how a finished product will work for an individual.</p>
          </div>
        </div>

        <div className="space-y-7 border border-white/10 bg-white/[0.025] p-5 sm:p-8">
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-white">1. What are you shopping for?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <Choice name="Face wash" value="face" selected={routine === 'face'} onSelect={(value) => { setRoutine(value); setPreference(''); setSubmitted(false); }} />
              <Choice name="Shampoo" value="hair" selected={routine === 'hair'} onSelect={(value) => { setRoutine(value); setPreference(''); setSubmitted(false); }} />
            </div>
          </fieldset>

          {currentProduct && (
            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-white">2. What would you like to check on its label?</legend>
              <div className="space-y-2">
                {currentProduct.preferences.map((item) => (
                  <Choice key={item.id} name={item.label} value={item.id} selected={preference === item.id} onSelect={(value) => { setPreference(value); setSubmitted(false); }} />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-white">
              {currentProduct ? '3.' : '2.'} Do you have a known sensitivity, allergy, or fragrance-free requirement?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {safetyChoices.map((item) => (
                <Choice key={item.id} name={item.label} value={item.id} selected={safety === item.id} onSelect={(value) => { setSafety(value); setSubmitted(false); }} />
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => setSubmitted(true)}
            className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-[#d6dfbd] px-5 py-3 text-sm font-semibold text-[#172119] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Check label match <ArrowRight size={16} aria-hidden="true" />
          </button>

          {submitted && (
            <div aria-live="polite" className="border-t border-white/10 pt-6">
              {result ? (
                <article className="border border-[#bdc9a4]/30 bg-[#bdc9a4]/[0.06] p-5 sm:p-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#bdc9a4]">Label match · not a clinical recommendation</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-[120px_1fr]">
                    <div className="flex aspect-square w-full flex-col items-center justify-center gap-3 border border-white/10 bg-black/20 text-[#bdc9a4]">
                      <Leaf size={30} aria-hidden="true" />
                      <span className="px-3 text-center text-[9px] font-semibold uppercase tracking-[0.14em]">Label details</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-2xl">{result.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/60">{result.description}</p>
                      {selectedPreference?.ingredient && (
                        <p className="mt-3 text-sm leading-6 text-[#e0e7d1]">
                          Why it matched: the supplied label lists {selectedPreference.ingredient}. This is a match to your requested label detail, not a promise of a particular result.
                        </p>
                      )}
                      <p className="mt-3 text-xs leading-5 text-white/45">
                        Fragrance note: {result.fragrance === 'listed' ? 'perfume is listed on the supplied face-wash label.' : 'fragrance-free status is not established by the supplied shampoo image.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-white/65">Ingredients as read from the photo</h4>
                    <ul className="mt-3 grid gap-x-6 gap-y-2 text-xs text-white/65 sm:grid-cols-2">
                      {result.ingredients.map(([name, amount]) => (
                        <li key={name} className="flex justify-between gap-3 border-b border-white/10 pb-2">
                          <span>{name}</span><span className="shrink-0 text-white/45">{amount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-5 text-xs leading-6 text-white/45">
                    The images do not show enough detail to verify every spelling, units context, complete formula, or current availability. Confirm these against the actual product packaging and product page before purchase or use.
                  </p>
                  <Link to={`/shop?search=${encodeURIComponent(result.search)}`} className="mt-5 inline-flex min-h-11 items-center gap-2 border-b border-[#bdc9a4]/50 pb-1 text-xs font-semibold text-[#e0e7d1] hover:text-white">
                    Check matching category in the shop <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </article>
              ) : (
                <div className="border border-amber-200/20 bg-amber-100/[0.04] p-5">
                  <h3 className="font-serif text-xl text-[#e6d6b4]">No product shown for these answers.</h3>
                  <p className="mt-2 text-sm leading-6 text-white/60">
                    The supplied face-wash label lists perfume; the shampoo photo does not establish fragrance-free status. A known sensitivity, allergy, fragrance-free need, or uncertainty is a reason not to rely on this guide for a match. Check the full current label and ask a qualified professional about personal sensitivities.
                  </p>
                </div>
              )}
              <button type="button" onClick={reset} className="mt-5 text-xs font-semibold text-white/50 underline underline-offset-4 hover:text-white">
                Start over
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
