"use client";

import { useEffect, useState } from "react";

type CountdownProps = {
  targetDate: string;
};

type CountdownValue = {
  days: number;
  hours: number;
  minutes: number;
  months: number;
  seconds: number;
};

const emptyCountdown: CountdownValue = {
  days: 0,
  hours: 0,
  minutes: 0,
  months: 0,
  seconds: 0,
};

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function getCountdown(target: Date): CountdownValue {
  const now = new Date();

  if (target.getTime() <= now.getTime()) {
    return emptyCountdown;
  }

  let months =
    (target.getFullYear() - now.getFullYear()) * 12 +
    target.getMonth() -
    now.getMonth();

  if (addMonths(now, months).getTime() > target.getTime()) {
    months -= 1;
  }

  const anchor = addMonths(now, Math.max(0, months));
  let remainder = target.getTime() - anchor.getTime();

  const days = Math.floor(remainder / 86_400_000);
  remainder -= days * 86_400_000;

  const hours = Math.floor(remainder / 3_600_000);
  remainder -= hours * 3_600_000;

  const minutes = Math.floor(remainder / 60_000);
  remainder -= minutes * 60_000;

  const seconds = Math.floor(remainder / 1_000);

  return {
    days,
    hours,
    minutes,
    months: Math.max(0, months),
    seconds,
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const [remaining, setRemaining] = useState<CountdownValue>(emptyCountdown);

  useEffect(() => {
    const target = new Date(targetDate);
    const update = () => setRemaining(getCountdown(target));

    update();
    const timer = window.setInterval(update, 1_000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const items = [
    ["Ay", remaining.months],
    ["Gün", remaining.days],
    ["Saat", remaining.hours],
    ["Dakika", remaining.minutes],
    ["Saniye", remaining.seconds],
  ];

  return (
    <div className="countdown" aria-label="Sempozyuma kalan süre">
      {items.map(([label, value]) => (
        <div className="countdown-item" key={label}>
          <span className="countdown-value">{pad(Number(value))}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
