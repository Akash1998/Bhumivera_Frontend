import { useEffect, useMemo, useRef, useState, useId } from 'react';
import {
  DEFAULT_TIME_ZONE,
  defaultRange,
  parseLocalInputValue,
  toLocalInputValue,
} from '../utils/dateTz';

export default function DatetimeTzInput({
  value,
  onChange,
  minIso,
  maxIso,
  label,
  error,
  defaultDayOffset = 0,
  initializeEmpty = true,
  timeZone = DEFAULT_TIME_ZONE,
  required = true,
}) {
  const id = useId();
  const initialized = useRef(false);
  const initialIso = useMemo(() => {
    if (value) return value;
    if (!initializeEmpty) return '';
    const defaults = defaultRange();
    return defaultDayOffset > 0 ? defaults.endIso : defaults.startIso;
  }, [value, defaultDayOffset, initializeEmpty]);
  const [localValue, setLocalValue] = useState(() => toLocalInputValue(initialIso, timeZone));

  useEffect(() => {
    if (value) {
      setLocalValue(toLocalInputValue(value, timeZone));
      return;
    }
    if (!initialized.current) {
      initialized.current = true;
      if (initializeEmpty) onChange?.(initialIso);
    }
  }, [value, initialIso, onChange, timeZone, initializeEmpty]);

  const handleChange = event => {
    const nextLocalValue = event.target.value;
    setLocalValue(nextLocalValue);
    const parsed = parseLocalInputValue(nextLocalValue, timeZone);
    onChange?.(parsed ? parsed.toISOString() : '');
  };

  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-center gap-2 text-[9px] font-bold uppercase text-slate-500">
        <span>{label}</span>
        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[8px] font-black text-amber-400">IST</span>
      </label>
      <input
        id={id}
        type="datetime-local"
        value={localValue}
        min={minIso ? toLocalInputValue(minIso, timeZone) : undefined}
        max={maxIso ? toLocalInputValue(maxIso, timeZone) : undefined}
        onChange={handleChange}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-lg border bg-slate-950 p-3 text-xs text-white outline-none transition-colors ${error ? 'border-rose-500 focus:border-rose-400' : 'border-slate-700 focus:border-amber-500'}`}
      />
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-rose-400">{error}</p>}
    </div>
  );
}