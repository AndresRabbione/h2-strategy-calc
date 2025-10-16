"use client";

import { useEffect, useState } from "react";

interface Props {
  factionColor: string;
  progress: number;
  totalAmount: number | null;
  locale: string;
  progressPerHour: number;
}

export default function ObjectiveProgressBar({
  factionColor,
  progress,
  totalAmount,
  locale,
  progressPerHour,
}: Props) {
  const [progressState, setProgress] = useState(progress);

  const percentage =
    totalAmount === null ? progressState : (progressState / totalAmount) * 100;

  const innerText = `${progressState.toFixed(2).toLocaleString()}${
    totalAmount !== null
      ? ` / ${totalAmount.toLocaleString(locale)} (${percentage.toFixed(2)}%)`
      : "%"
  }`;

  useEffect(() => {
    let friendlyProgressPerMs = progressPerHour / 3600000;
    if (progress === 100) friendlyProgressPerMs = 0;

    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = now - lastTime; // ms since last frame
      lastTime = now;

      setProgress((prev) => {
        const newFriendlyProgress = prev + delta * friendlyProgressPerMs;

        return Math.min(Math.max(newFriendlyProgress, 0), 100);
      });

      requestAnimationFrame(update);
    };

    const frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [progressPerHour]);

  return (
    <div
      style={{ backgroundColor: factionColor }}
      className={`w-full before:text-gray-700 before:top-0.5 before:left-0 relative h-6 before:absolute before:pl-2 before:text-sm before:content-[attr(data-label)]`}
      data-label={innerText}
    >
      <span
        className="inline-block h-full bg-super-earth-blue"
        style={{ width: `${progressState}%` }}
      ></span>
    </div>
  );
}
