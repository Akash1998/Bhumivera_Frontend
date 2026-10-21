import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

export const DEFAULT_TIME_ZONE = 'Asia/Kolkata';

export function defaultRange(daysStart = 0, daysEnd = 7, now = new Date()) {
  const baseTime = now instanceof Date ? now.getTime() : new Date(now).getTime();
  if (!Number.isFinite(baseTime)) throw new RangeError('Invalid base date');

  const dayMs = 24 * 60 * 60 * 1000;
  return {
    startIso: new Date(baseTime + Number(daysStart) * dayMs).toISOString(),
    endIso: new Date(baseTime + Number(daysEnd) * dayMs).toISOString(),
  };
}

export function toLocalInputValue(iso, timeZone = DEFAULT_TIME_ZONE) {
  if (!iso) return '';
  const date = iso instanceof Date ? iso : new Date(iso);
  if (!Number.isFinite(date.getTime())) return '';
  return formatInTimeZone(date, timeZone, "yyyy-MM-dd'T'HH:mm");
}

export function parseLocalInputValue(value, timeZone = DEFAULT_TIME_ZONE) {
  if (!value) return null;
  const date = fromZonedTime(value, timeZone);
  return Number.isFinite(date.getTime()) ? date : null;
}

export function formatCampaignRange(start, end, timeZone = DEFAULT_TIME_ZONE) {
  const formatPart = value => {
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isFinite(date.getTime())) return '';
    return formatInTimeZone(date, timeZone, 'MMM d HH:mm');
  };
  const zoneLabel = timeZone === DEFAULT_TIME_ZONE
    ? 'IST'
    : formatInTimeZone(new Date(), timeZone, 'zzz');
  const startLabel = formatPart(start);
  const endLabel = formatPart(end);

  if (!startLabel || !endLabel) return '';
  return `${startLabel} ${zoneLabel} – ${endLabel} ${zoneLabel}`;
}