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
    <div className="mt-4 border-t border-stone-200 pt-4 text-stone-700 sm:mt-5">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#eff3ec] text-[#607552]">
          <Truck size={17} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold">Estimated delivery</p>
          <p className="mt-1 text-sm font-semibold text-[#17251c]">{getDeliveryEstimate(now)}</p>
          <p className="mt-1 text-[11px] text-stone-500">
            Based on ordering {countdown ? 'before today’s dispatch cutoff' : 'after today’s dispatch cutoff'}.
          </p>
        </div>
      </div>

      {!isOutOfStock && countdown ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-[#dce8d7] bg-[#f2f7ef] px-3 py-3 sm:px-4">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#35533c]">Order soon for today’s dispatch</p>
            <p className="mt-1 text-[11px] text-stone-600">Order before 2:00 PM IST</p>
          </div>
          <span
            className="shrink-0 rounded-lg bg-white px-2.5 py-2 font-mono text-base font-bold tabular-nums tracking-wider text-[#17251c] shadow-sm sm:px-3 sm:text-lg"
            aria-label={`${countdown} remaining until today's dispatch cutoff`}
          >
            {countdown}
          </span>
        </div>
      ) : !isOutOfStock ? (
        <p className="mt-4 rounded-xl bg-stone-50 px-3 py-3 text-xs leading-5 text-stone-600 sm:px-4">
          Today’s 2:00 PM IST dispatch cutoff has passed. Orders placed now are prepared for dispatch tomorrow.
        </p>
      ) : null}
    </div>
  );
}
