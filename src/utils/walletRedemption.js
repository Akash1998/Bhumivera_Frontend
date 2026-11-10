const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);

export const calculateTierDiscount = (subtotal, priorDiscounts, tier, enabled) => {
  if (!enabled || !tier) return 0;
  const merchandiseCents = toCents(subtotal);
  const remainingCents = Math.max(0, merchandiseCents - toCents(priorDiscounts));
  const percent = Math.max(0, Math.min(100, Number(tier.tier_discount_percent) || 0));
  return Math.min(remainingCents, Math.floor(merchandiseCents * percent / 100)) / 100;
};

export const calculateReferralWalletRedemption = (
  balance,
  orderSubtotal,
  eligibleSubtotal,
  tiers,
  welcomeBonusBalance = null,
) => {
  const toCents = value => Math.round(Math.max(0, Number(value) || 0) * 100);
  const orderCents = toCents(orderSubtotal);
  const eligibleCents = toCents(eligibleSubtotal);
  const totalBalanceCents = toCents(balance);

  if (orderCents < 79900) return 0;

  if (welcomeBonusBalance !== null && welcomeBonusBalance !== undefined) {
    const welcomeCents = Math.min(totalBalanceCents, toCents(welcomeBonusBalance));
    const referralCents = Math.max(0, totalBalanceCents - welcomeCents);

    const maxWelcome = orderCents >= 79900 ? 10000 : 0;
    const maxReferral = orderCents > 99900 ? 10000 : 0;

    const redeemWelcome = Math.min(welcomeCents, maxWelcome);
    const redeemReferral = Math.min(referralCents, maxReferral);

    if (welcomeCents === 0 && referralCents === 0 && totalBalanceCents > 0) {
      const maxAllowed = orderCents > 99900 ? 20000 : 10000;
      return Math.min(totalBalanceCents, eligibleCents, maxAllowed) / 100;
    }

    return Math.min(eligibleCents, redeemWelcome + redeemReferral) / 100;
  }

  const maxAllowed = orderCents > 99900 ? 20000 : 10000;
  return Math.min(totalBalanceCents, eligibleCents, maxAllowed) / 100;
};
