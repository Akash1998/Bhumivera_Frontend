const isUnknownStoreCoupon = error => {
  const response = error?.response?.data;
  return response?.code === 'COUPON_INVALID' &&
    /^invalid coupon code\.?$/i.test(String(response.message || '').trim());
};

export async function resolveCheckoutPromo({ code, validateCoupon, applyAffiliateCode }) {
  try {
    return { type: 'coupon', response: await validateCoupon(code) };
  } catch (couponError) {
    if (!isUnknownStoreCoupon(couponError)) throw couponError;

    try {
      await applyAffiliateCode(code);
      return { type: 'creator' };
    } catch (creatorError) {
      if (creatorError.response?.status === 404 ||
          creatorError.response?.data?.code === 'PROMOTER_CODE_INVALID') {
        throw couponError;
      }
      throw creatorError;
    }
  }
}
