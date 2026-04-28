import { useEffect, useState } from "react";

function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${displayHours}:${paddedMinutes}`;
}

function msUntilNextMinute(now: Date): number {
  return 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds());
}

function useLiveClock(): string {
  const [time, setTime] = useState<string>(() => formatTime(new Date()));

  useEffect(() => {
    let timeoutId: number | undefined;
    let intervalId: number | undefined;

    const tick = () => {
      setTime(formatTime(new Date()));
    };

    timeoutId = window.setTimeout(() => {
      tick();
      intervalId = window.setInterval(tick, 60_000);
    }, msUntilNextMinute(new Date()));

    return () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return time;
}

function SignalIcon() {
  return (
    <svg
      width="17"
      height="11"
      viewBox="0 0 17 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="0" y="7" width="3" height="4" rx="1" fill="currentColor" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" fill="currentColor" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" fill="currentColor" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="16"
      height="11"
      viewBox="0 0 16 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 10.2a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
      <path
        d="M3.4 6.1a6.5 6.5 0 0 1 9.2 0l-1.05 1.05a5 5 0 0 0-7.1 0L3.4 6.1Z"
        fill="currentColor"
      />
      <path
        d="M.7 3.4a10.3 10.3 0 0 1 14.6 0l-1.05 1.05a8.8 8.8 0 0 0-12.5 0L.7 3.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      width="27"
      height="12"
      viewBox="0 0 27 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="3"
        stroke="currentColor"
        strokeOpacity="0.55"
      />
      <rect x="2" y="2" width="19" height="8" rx="1.5" fill="currentColor" />
      <rect
        x="24"
        y="4"
        width="2"
        height="4"
        rx="1"
        fill="currentColor"
        fillOpacity="0.55"
      />
    </svg>
  );
}

export function StatusBar() {
  const time = useLiveClock();

  return (
    <div
      className="sticky top-0 z-20 flex h-[var(--status-bar-height)] w-full items-end justify-between px-6 pb-1 text-text-primary"
      aria-label="Status bar"
    >
      <div className="flex w-20 justify-start">
        <span
          className="text-mono tabular-nums leading-none"
          aria-label={`Current time ${time}`}
        >
          {time}
        </span>
      </div>
      <div className="flex w-20 items-center justify-end gap-2 text-text-primary">
        <SignalIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  );
}
