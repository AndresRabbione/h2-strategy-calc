"use client";

import { useEffect, useState } from "react";

interface Props {
  factionColor: string;
  progress: number;
  totalAmount: number | null;
  progressPerHour: number;
}

export default function ObjectiveProgressBar({
  factionColor,
  progress,
  totalAmount,
  progressPerHour,
}: Props) {
  const [progressState, setProgress] = useState(progress);

  const percentage =
    totalAmount === null ? progressState : (progressState / totalAmount) * 100;

  const innerText =
    totalAmount === null
      ? `${progressState.toFixed(2).toLocaleString()}%`
      : `${progressState.toLocaleString()} / ${totalAmount.toLocaleString()} (${percentage.toFixed(
          2
        )}%)`;

  useEffect(() => {
    let friendlyProgressPerMs = progressPerHour / 3600000;
    if (
      (totalAmount === null && progress === 100) ||
      (totalAmount && progress === totalAmount)
    ) {
      friendlyProgressPerMs = 0;
      return;
    }

    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = now - lastTime; // ms since last frame
      lastTime = now;

      setProgress((prev) => {
        const newFriendlyProgress = prev + delta * friendlyProgressPerMs;

        return totalAmount === null
          ? Math.min(Math.max(newFriendlyProgress, 0), 100)
          : Math.min(newFriendlyProgress, totalAmount);
      });

      requestAnimationFrame(update);
    };

    const frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [progressPerHour, totalAmount, progress]);

  return (
    <div
      style={{ backgroundColor: factionColor }}
      className={`w-full before:text-gray-700 before:bottom-1 before:left-0 relative h-6 before:absolute before:pl-1 before:text-xs before:content-[attr(data-label)]`}
      data-label={innerText}
    >
      <span
        className="inline-block h-full bg-super-earth-blue"
        style={{
          width: `${percentage}%`,
        }}
      ></span>
    </div>
  );
}
