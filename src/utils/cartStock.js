export const getClientStockError = (product, currentQuantity, requestedQuantity, serverChecksStock = false) => {
  if (serverChecksStock) return null;
  const knownStock =
    product?.stock !== undefined
      ? Number(product.stock)
      : product?.quantity !== undefined && product?.product_id === undefined
      ? Number(product.quantity)
      : null;
  if (knownStock === null || !Number.isFinite(knownStock)) return null;
  if (knownStock <= 0) return `${product?.name || 'This item'} is currently out of stock.`;
  if (currentQuantity + requestedQuantity > knownStock) {
    return `Only ${knownStock} unit(s) of ${product?.name || 'this item'} available in stock.`;
  }
  return null;
};
