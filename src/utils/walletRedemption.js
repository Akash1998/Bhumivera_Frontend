const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);

export const calculateTierDiscount = (subtotal, priorDiscounts, tier, enabled) => {
  if (!enabled || !tier) return 0;
  const merchandiseCents = toCents(subtotal);
  const remainingCents = Math.max(0, merchandiseCents - toCents(priorDiscounts));
  const percent = Math.max(0, Math.min(100, Number(tier.tier_discount_percent) || 0));
  return Math.min(remainingCents, Math.floor(merchandiseCents * percent / 100)) / 100;
};

export const calculateReferralWalletRedemption = (balance, orderSubtotal, eligibleSubtotal, tiers) => {
  const orderCents = toCents(orderSubtotal);
  const tier = (Array.isArray(tiers) ? tiers : [])
    .filter(item => orderCents >= toCents(item.min_order_amount))
    .sort((first, second) => toCents(second.min_order_amount) - toCents(first.min_order_amount))[0];
  return tier
    ? Math.min(toCents(balance), toCents(eligibleSubtotal), toCents(tier.referral_amount)) / 100
    : 0;
};
