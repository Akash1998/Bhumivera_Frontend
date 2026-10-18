export const isOrderCancellationRequest = value => {
  const text = String(value || '');
  return (
    /\b(?:cancel|cancellation)\b.{0,50}\borders?\b/i.test(text) ||
    /\borders?\b.{0,50}\b(?:cancel|cancellation)\b/i.test(text)
  );
};
