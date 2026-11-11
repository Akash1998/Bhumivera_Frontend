export const parseProductSpecifications = product => {
  const specifications = product?.specifications;
  if (!specifications) return {};
  if (typeof specifications === 'object') return specifications;
  if (typeof specifications !== 'string') return {};
  try {
    const parsed = JSON.parse(specifications);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};

export const isComboProduct = product => {
  const specifications = parseProductSpecifications(product);
  return Boolean(
    product?.is_combo ||
    specifications.is_combo ||
    ['combo', 'bundle'].includes(String(specifications.product_type || '').toLowerCase()) ||
    [specifications.combo_items, specifications.components, specifications.items].some(
      items => Array.isArray(items) && items.length > 0
    )
  );
};

export const getComboItems = product => {
  const specifications = parseProductSpecifications(product);
  const items = specifications.combo_items || specifications.components || specifications.items;
  return Array.isArray(items) ? items.filter(item => item && typeof item === 'object') : [];
};

export const resolveComboItems = (combo, catalogProducts = []) => getComboItems(combo).map(item => {
  const itemSlug = String(item.slug || '').trim();
  const itemId = item.product_id ?? item.id;
  const catalogProduct = (itemSlug && catalogProducts.find(product => product.slug === itemSlug)) ||
    (itemId != null && catalogProducts.find(product => String(product.id ?? product._id) === String(itemId)));

  return {
    ...item,
    ...(catalogProduct || {}),
    componentQuantity: Math.max(1, Number(item.quantity) || 1),
    catalogMatch: Boolean(catalogProduct),
    name: catalogProduct?.name || item.name || 'Catalog product unavailable',
    slug: catalogProduct?.slug || itemSlug,
    id: catalogProduct?.id ?? itemId,
  };
});

export const getComboPrice = combo => {
  const discountPrice = Number(combo?.discount_price);
  if (Number.isFinite(discountPrice) && discountPrice > 0) return discountPrice;
  return Math.max(0, Number(combo?.price) || 0);
};

export const getComboPath = combo => combo?.slug || combo?.sku || combo?.id || combo?._id;
