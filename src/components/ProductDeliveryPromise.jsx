import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import {
  getDeliveryEstimate,
  getDispatchCountdown,
  getMillisecondsUntilNextIndiaMidnight,
} from '../utils/deliveryEstimate';

export default function ProductDeliveryPromise({ isOutOfStock }) {
  const [now, setNow] = useState(() => new Date());
  const countdown = getDispatchCountdown(now);

  useEffect(() => {
    let intervalId;
    let midnightTimeoutId;

    const scheduleNextMidnight = currentTime => {
      midnightTimeoutId = window.setTimeout(
        updateClock,
        getMillisecondsUntilNextIndiaMidnight(currentTime)
      );
    };

    const updateClock = () => {
      const currentTime = new Date();
      setNow(currentTime);

      if (getDispatchCountdown(currentTime)) {
        intervalId = window.setInterval(() => {
          const tick = new Date();
          setNow(tick);
          if (!getDispatchCountdown(tick)) {
            window.clearInterval(intervalId);
            intervalId = undefined;
            scheduleNextMidnight(tick);
          }
        }, 1000);
      } else {
        scheduleNextMidnight(currentTime);
      }
    };

    updateClock();
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(midnightTimeoutId);
    };
  }, []);

  return (
    <div className="mt-4 border-t border-[#d4af37]/20 pt-4 text-[#cbd5e1] sm:mt-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d4af37]/15 text-[#fce096] border border-[#d4af37]/30">
          <Truck size={17} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold text-[#fce096]">Estimated delivery</p>
          <p className="mt-1 text-sm font-semibold text-white">{getDeliveryEstimate(now)}</p>
          <p className="mt-1 text-[11px] text-[#94a3b8]">
            Based on ordering {countdown ? 'before today’s dispatch cutoff' : 'after today’s dispatch cutoff'}.
          </p>
        </div>
      </div>

      {!isOutOfStock && countdown ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#d4af37]/30 bg-[#070a0e]/80 px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#fce096]">Order soon for today’s dispatch</p>
            <p className="mt-1 text-[11px] text-[#94a3b8]">Order before 2:00 PM IST</p>
          </div>
          <span
            className="shrink-0 rounded-lg bg-[#0d1520] border border-[#d4af37]/40 px-2.5 py-2 font-mono text-base font-bold tabular-nums tracking-wider text-[#fce096] shadow-sm sm:px-3 sm:text-lg"
            aria-label={`${countdown} remaining until today's dispatch cutoff`}
          >
            {countdown}
          </span>
        </div>
      ) : !isOutOfStock ? (
        <p className="mt-4 rounded-xl bg-[#070a0e]/80 border border-[#d4af37]/20 px-3 py-3 text-xs leading-5 text-[#94a3b8] sm:px-4">
          Today’s 2:00 PM IST dispatch cutoff has passed. Orders placed now are prepared for dispatch tomorrow.
        </p>
      ) : null}
    </div>
  );
}
