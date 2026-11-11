export const getCartGiftProgress = (tiers = [], subtotal = 0) => {
  const gifts = (Array.isArray(tiers) ? tiers : [])
    .filter(tier => Number(tier.giftProductId) > 0);
  const unlocked = gifts.filter(tier => tier.unlocked);
  const next = gifts
    .filter(tier => {
      const minimum = Number(tier.minCartValue);
      const maximum = tier.maxCartValue == null ? null : Number(tier.maxCartValue);
      return !tier.unlocked &&
        Number.isFinite(minimum) &&
        minimum > subtotal &&
        (maximum === null || (Number.isFinite(maximum) && maximum >= minimum));
    })
    .sort((first, second) => Number(first.minCartValue) - Number(second.minCartValue))[0] || null;
  const target = next || [...unlocked]
    .sort((first, second) => Number(second.minCartValue) - Number(first.minCartValue))[0] || null;
  const targetMinimum = Number(target?.minCartValue) || 0;
  const progressPercent = target
    ? Math.min(100, Math.max(0, subtotal * 100 / Math.max(1, targetMinimum)))
    : 0;

  return {
    gifts,
    unlocked,
    next,
    target,
    progressPercent,
  };
};
