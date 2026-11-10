export const SHOPPING_WALLET_REWARD_PERCENT = 10;
export const NEW_CUSTOMER_BONUS_PERCENT = 5;
export const SHOPPING_WALLET_REWARD_CAP = 500;

export const estimateShoppingWalletReward = (eligibleSubtotal, isNewCustomer = false) => Math.round(
  (Math.min(
    SHOPPING_WALLET_REWARD_CAP,
    Math.max(0, Number(eligibleSubtotal) || 0) *
      (SHOPPING_WALLET_REWARD_PERCENT + (isNewCustomer ? NEW_CUSTOMER_BONUS_PERCENT : 0)) / 100,
  ) + Number.EPSILON) * 100,
) / 100;
