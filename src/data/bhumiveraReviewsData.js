const STORAGE_KEY = 'bhumivera_reviews_store_v1';
const REVIEW_MEDIA_PLACEHOLDER = '/images/review-placeholder.svg';
export const REVIEWS_UPDATED_EVENT = 'bhumivera:reviews-updated';

const PRODUCT_SEEDS = [
  { id: 1, legacyIds: [9], slug: 'activated-charcoal-luxury-face-wash', ratings: { 5: 174, 4: 24, 3: 9, 2: 4, 1: 9 }, photos: 86, videos: 16, combo: { ratings: { 5: 77, 4: 1 }, photos: 36, videos: 8 } },
  { id: 2, legacyIds: [8], slug: 'himalayan-seabuckthorn-luxury-face-wash', ratings: { 5: 192, 4: 25, 3: 10, 2: 4, 1: 9 }, photos: 124, videos: 16, combo: { ratings: { 5: 84, 4: 1 }, photos: 52, videos: 8 } },
  { id: 3, legacyIds: [104], slug: 'luxury-2-in-1-botanical-shampoo-conditioner', ratings: { 5: 124, 4: 17, 3: 7, 2: 4, 1: 8 }, photos: 55, videos: 11, combo: { ratings: { 5: 56, 4: 1 }, photos: 23, videos: 5 } },
  { id: 4, legacyIds: [103], slug: 'artisanal-charcoal-handmade-soap', ratings: { 5: 102, 4: 12, 3: 5, 2: 3, 1: 8 }, photos: 44, videos: 9, combo: { ratings: { 5: 45, 4: 1 }, photos: 18, videos: 4 } },
  { id: 5, legacyIds: [105], slug: 'artisanal-aloe-vera-handmade-soap', ratings: { 5: 95, 4: 10, 3: 4, 2: 3, 1: 8 }, photos: 42, videos: 8, combo: { ratings: { 5: 42 }, photos: 18, videos: 4 } },
  { id: 6, legacyIds: [106], slug: 'kalpvriksh-satva-tulsi-7-tulsi-extract', ratings: { 5: 170, 4: 20, 3: 8, 2: 4, 1: 8 }, photos: 84, videos: 14, combo: { ratings: { 5: 47, 4: 20, 3: 3 }, photos: 35, videos: 9 } },
];

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
const CATEGORIES = [
  'Quick & Everyday Impressions',
  'Texture & Sensory Notes',
  'Routine & Ritual',
  'Sensitive Skin Journal',
  'Long-Term Experience',
];
const buildSeed = () => {
  const out = [];
  let sequence = 0;
  for (const product of PRODUCT_SEEDS) {
    const comboRatingsRemaining = { ...product.combo.ratings };
    let comboPhotosRemaining = product.combo.photos;
    let comboVideosRemaining = product.combo.videos;
    let photosRemaining = product.photos - product.combo.photos;
    let videosRemaining = product.videos - product.combo.videos;

    for (const rating of [5, 4, 3, 2, 1]) {
      for (let index = 0; index < product.ratings[rating]; index += 1) {
        const isComboReview = (comboRatingsRemaining[rating] || 0) > 0;
        if (isComboReview) comboRatingsRemaining[rating] -= 1;

        const hasPhoto = isComboReview ? comboPhotosRemaining > 0 : photosRemaining > 0;
        const hasVideo = isComboReview ? comboVideosRemaining > 0 : videosRemaining > 0;
        if (hasPhoto && isComboReview) comboPhotosRemaining -= 1;
        else if (hasPhoto) photosRemaining -= 1;
        if (hasVideo && isComboReview) comboVideosRemaining -= 1;
        else if (hasVideo) videosRemaining -= 1;

        const name = `${NAMES[(sequence * 7) % NAMES.length]} ${SURNAMES[(sequence * 5 + product.id) % SURNAMES.length]}`;
        const body = BODIES[(sequence + product.id) % BODIES.length];
        const date = new Date(Date.UTC(2020, 0, 1) + sequence * 54 * 3600 * 1000).toISOString();
        out.push({
          id: sequence + 1,
          product_id: product.id,
          product_slug: product.slug,
          order_number: `BV-ORD-${String(sequence + 1).padStart(6, '0')}`,
          rating,
          title: TITLES[sequence % TITLES.length],
          body,
          comment: body,
          user_name: name,
          reviewer_name: name,
          reviewer_location: CITIES[(sequence * 3) % CITIES.length],
          category_tag: isComboReview ? 'Combo Pack Ritual' : CATEGORIES[sequence % CATEGORIES.length],
          is_combo_review: Boolean(isComboReview),
          combo_name: isComboReview ? (sequence % 2 ? 'Inside-Out Ritual' : 'Daily Regimen') : null,
          is_approved: 1,
          verified: true,
          images: hasPhoto ? [REVIEW_MEDIA_PLACEHOLDER] : [],
          videos: hasVideo ? [REVIEW_MEDIA_PLACEHOLDER] : [],
          helpful_count: sequence % 24,
          public_story_consent: false,
          created_at: date,
        });
        sequence += 1;
      }
    }
  }
  return out;
};

export const INITIAL_REVIEWS_SEED = buildSeed();

const PRODUCT_SLUGS = Object.fromEntries(PRODUCT_SEEDS.map(({ id, slug }) => [id, slug]));

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
  const product = PRODUCT_SEEDS.find(({ id, legacyIds = [], slug }) =>
    slug === key || String(id) === key || legacyIds.some(legacyId => String(legacyId) === key)
  );
  return product?.id ?? null;
};

export const getReviewsForProduct = idOrSlug => {
  const pid = resolveProductId(idOrSlug);
  const product = PRODUCT_SEEDS.find(seed => seed.id === pid);
  const productIds = new Set([pid, ...(product?.legacyIds || [])].map(String));
  const storedProductReviews = pid === null
    ? []
    : getActiveReviewsStore().filter(r =>
      r && (productIds.has(String(r.product_id)) || r.product_slug === product?.slug)
    );
  const sourceReviews = storedProductReviews.length > 0
    ? storedProductReviews
    : INITIAL_REVIEWS_SEED.filter(r => Number(r.product_id) === pid);
  const reviews = sourceReviews.filter(r => Number(r.is_approved ?? 1) === 1);
  const total = reviews.length;
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  reviews.forEach(r => {
    const rating = Math.min(5, Math.max(1, Math.round(Number(r.rating) || 0)));
    distribution[rating] += 1;
    sum += rating;
  });
  const average = total ? Math.round((sum / total) * 100) / 100 : 0;
  return { reviews, summary: { total, average, distribution } };
};
