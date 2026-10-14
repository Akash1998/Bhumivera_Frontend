export const getDeliveryEstimate = (orderDate = new Date()) => {
  const startDate = new Date(orderDate);
  startDate.setHours(12, 0, 0, 0);

  const earliestDate = new Date(startDate);
  earliestDate.setDate(earliestDate.getDate() + 5);

  const latestDate = new Date(startDate);
  latestDate.setDate(latestDate.getDate() + 7);

  const includeYear = startDate.getFullYear() !== earliestDate.getFullYear() ||
    startDate.getFullYear() !== latestDate.getFullYear();
  const formatOptions = {
    day: 'numeric',
    month: 'short',
    ...(includeYear ? { year: 'numeric' } : {}),
  };
  const formatDate = date => date.toLocaleDateString('en-IN', formatOptions);

  return `${formatDate(earliestDate)} - ${formatDate(latestDate)}`;
};
