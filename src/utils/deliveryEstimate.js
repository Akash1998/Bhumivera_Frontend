const DISPATCH_CUTOFF_HOUR = 14;
const INDIA_TIME_ZONE = 'Asia/Kolkata';
const INDIA_UTC_OFFSET_MS = 5.5 * 60 * 60 * 1000;
const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_HOUR = 60 * 60;

const getIndiaDateParts = date => {
  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, Number(value)]));
  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
};

const addCalendarDays = (date, days) => {
  const result = new Date(date);
  result.setUTCHours(12, 0, 0, 0);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
};

const formatOrdinalDate = date => {
  const day = date.getUTCDate();
  const lastTwoDigits = day % 100;
  const suffix = lastTwoDigits >= 11 && lastTwoDigits <= 13
    ? 'th'
    : ({ 1: 'st', 2: 'nd', 3: 'rd' }[day % 10] || 'th');
  const month = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'UTC',
    month: 'long',
  }).format(date);
  return `${day}${suffix} ${month} ${date.getUTCFullYear()}`;
};

export const isBeforeDispatchCutoff = (now = new Date()) =>
  getIndiaDateParts(now).hour < DISPATCH_CUTOFF_HOUR;

export const getDispatchCountdown = (now = new Date()) => {
  const { year, month, day } = getIndiaDateParts(now);
  const cutoff = Date.UTC(year, month - 1, day, DISPATCH_CUTOFF_HOUR) -
    INDIA_UTC_OFFSET_MS;

  const remainingMilliseconds = cutoff - now.getTime();
  if (remainingMilliseconds <= 0) return null;
  const totalSeconds = Math.ceil(remainingMilliseconds / MILLISECONDS_PER_SECOND);

  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor((totalSeconds % SECONDS_PER_HOUR) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(value => String(value).padStart(2, '0')).join(':');
};

export const getMillisecondsUntilNextIndiaMidnight = (now = new Date()) => {
  const { year, month, day } = getIndiaDateParts(now);
  const nextMidnight = Date.UTC(year, month - 1, day + 1) - INDIA_UTC_OFFSET_MS;
  return Math.max(0, nextMidnight - now.getTime());
};

export const getDeliveryEstimate = (orderDate = new Date()) => {
  const { year, month, day } = getIndiaDateParts(orderDate);
  const beforeCutoff = isBeforeDispatchCutoff(orderDate);
  const orderDateInIndia = new Date(Date.UTC(year, month - 1, day, 12));
  const earliestDate = addCalendarDays(orderDateInIndia, beforeCutoff ? 4 : 5);
  const latestDate = addCalendarDays(orderDateInIndia, beforeCutoff ? 6 : 7);

  return `${formatOrdinalDate(earliestDate)} – ${formatOrdinalDate(latestDate)}`;
};
