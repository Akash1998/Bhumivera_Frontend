export const PREMIUM_DELIVERY_THRESHOLD = 799;
export const PREMIUM_DELIVERY_SURCHARGE = 100;

export const calculateDeliveryCosts = ({
  subtotal,
  standardCharge,
  premiumCharge,
  freeShippingThreshold,
  freeShipping = false,
}) => {
  const orderValue = Math.max(0, Number(subtotal) || 0);
  const standardRate = Number(standardCharge);
  const premiumRate = Number(premiumCharge);
  const freeThreshold = Number(freeShippingThreshold);
  const standardIsFree = Boolean(freeShipping) ||
    (Number.isFinite(freeThreshold) && freeThreshold > 0 && orderValue >= freeThreshold);
  const standardCost = standardIsFree || !Number.isFinite(standardRate)
    ? 0
    : Math.max(0, standardRate);

  return {
    standardCost,
    premiumCost: orderValue < PREMIUM_DELIVERY_THRESHOLD
      ? standardCost + PREMIUM_DELIVERY_SURCHARGE
      : Number.isFinite(premiumRate) ? Math.max(0, premiumRate) : 0,
  };
};
