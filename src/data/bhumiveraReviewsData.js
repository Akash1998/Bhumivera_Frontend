const STORAGE_KEY = 'bhumivera_reviews_store_v1';
export const REVIEWS_UPDATED_EVENT = 'bhumivera:reviews-updated';

const PRODUCT_SLUGS = {
  1: 'activated-charcoal-luxury-face-wash',
  2: 'himalayan-seabuckthorn-luxury-face-wash',
  3: 'the-biotic-cellular-reset-30-day-gut-skin-protocol',
  4: 'restorative-seabuckthorn-prebiotic-barrier-creme',
  5: 'fermented-7-tulsi-hydrosol-cellular-hydration-mist',
  6: 'kalpvriksh-satva-tulsi-7-tulsi-extract',
};

const NAMES = [
  'Aarav', 'Ananya', 'Ishita', 'Rohan', 'Meera', 'Kabir', 'Naina', 'Vihaan', 'Saanvi', 'Arjun',
  'Diya', 'Kunal', 'Tara', 'Neha', 'Rahul', 'Priya', 'Siddharth', 'Riya', 'Aditya', 'Pooja',
];
const SURNAMES = ['Sharma', 'Verma', 'Singh', 'Mehta', 'Nair', 'Iyer', 'Gupta', 'Rao', 'Kapoor', 'Joshi', 'Bose', 'Khan'];
const CITIES = ['Delhi', 'Mumbai', 'Bengaluru', 'Pune', 'Chennai', 'Kolkata', 'Jaipur', 'Dehradun', 'Hyderabad', 'Lucknow'];
const TITLES = ['Visible difference', 'Gentle yet effective', 'Worth it', 'Skin feels balanced', 'Love the texture', 'Repurchasing'];
const BODIES = [
  'My skin feels calmer and clearer after a few weeks of regular use.',
  'Lovely texture and a subtle natural scent. No tightness after washing.',
  'Noticed a more even tone and less oiliness through the day.',
  'Gentle on my sensitive skin and absorbs quickly. Will buy again.',
  'Premium feel, thoughtful formulation, and it genuinely works for me.',
];
const RATING_PATTERN = [5, 5, 5, 4, 5, 4, 5, 5, 4, 3];

const buildSeed = () => {
  const out = [];
  let n = 0;
  for (let pid = 1; pid <= 6; pid += 1) {
    for (let i = 0; i < 55; i += 1) {
      const rating = RATING_PATTERN[(i + pid) % RATING_PATTERN.length];
      const name = `${NAMES[(n * 7) % NAMES.length]} ${SURNAMES[(n * 5 + pid) % SURNAMES.length]}`;
      const date = new Date(Date.UTC(2026, 0, 1) + n * 18 * 3600 * 1000).toISOString();
      out.push({
        id: `seed-${pid}-${i + 1}`,
        product_id: pid,
        rating,
        title: TITLES[n % TITLES.length],
        body: BODIES[(n + pid) % BODIES.length],
        comment: BODIES[(n + pid) % BODIES.length],
        user_name: name,
        reviewer_name: name,
        reviewer_location: CITIES[(n * 3) % CITIES.length],
        is_approved: 1,
        verified: true,
        images: [],
        created_at: date,
      });
      n += 1;
    }
  }
  return out;
};

export const INITIAL_REVIEWS_SEED = buildSeed();

export const getActiveReviewsStore = () => {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const parsed = raw ? JSON.parse(raw) : null;
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch (_) {
    /* fall through to seed */
  }
  return INITIAL_REVIEWS_SEED;
};

export const saveActiveReviewsStore = reviews => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (_) {
    /* storage unavailable or full */
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(REVIEWS_UPDATED_EVENT));
};

const resolveProductId = idOrSlug => {
  const key = String(idOrSlug ?? '');
  if (PRODUCT_SLUGS[key]) return Number(key);
  const entry = Object.entries(PRODUCT_SLUGS).find(([, slug]) => slug === key);
  return entry ? Number(entry[0]) : null;
};

export const getReviewsForProduct = idOrSlug => {
  const pid = resolveProductId(idOrSlug);
  const reviews = pid === null
    ? []
    : getActiveReviewsStore().filter(r => Number(r.product_id) === pid && Number(r.is_approved ?? 1) === 1);
  const total = reviews.length;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  reviews.forEach(r => {
    const rating = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
    distribution[rating] += 1;
    sum += rating;
  });
  const average = total ? Math.round((sum / total) * 10) / 10 : 0;
  return { reviews, summary: { total, average, distribution } };
};
