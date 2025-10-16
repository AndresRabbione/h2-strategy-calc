"use client";

import { DBEvent, FactionIDs } from "@/lib/typeDefinitions";
import { getFactionColorFromId } from "@/utils/parsing/factions";
import { useEffect, useState } from "react";

export default function PlanetProgressBar({
  progress,
  progressPerHour,
  faction,
  event,
}: {
  progress: number;
  progressPerHour: number;
  faction: FactionIDs;
  event: DBEvent | null;
}) {
  const [progressState, setProgress] = useState(progress);
  const hoursSinceStart = event
    ? (new Date().getTime() - new Date(event.start_time).getTime()) * 3600000
    : 0;
  const [enemyProgress, setEnemyProgress] = useState(
    event?.progress_per_hour ?? 0 * hoursSinceStart
  );
  const factionColor = getFactionColorFromId(faction, false);

  useEffect(() => {
    let friendlyProgressPerMs = progressPerHour / 3600000;
    if (!event && faction === FactionIDs.HUMANS) friendlyProgressPerMs = 0;
    const enemyProgressPerMs = (event?.progress_per_hour ?? 0) / 3600000;

    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = now - lastTime; // ms since last frame
      lastTime = now;

      setProgress((prev) => {
        const newFriendlyProgress = prev + delta * friendlyProgressPerMs;

        return Math.min(Math.max(newFriendlyProgress), 100);
      });

      setEnemyProgress((prev) => {
        const newEnemyProgress = prev + delta * enemyProgressPerMs;

        return Math.min(Math.max(newEnemyProgress), 100);
      });

      requestAnimationFrame(update);
    };

    const frame = requestAnimationFrame(update);

    return () => cancelAnimationFrame(frame);
  }, [progressPerHour, event?.progress_per_hour]);

  if (event) {
    return (
      <div
        className={`w-full before:text-gray-700 before:top-0.5 before:left-0 relative h-6 before:absolute before:pl-2 before:text-sm before:content-[attr(data-label)] bg-transparent overflow-hidden`}
        data-label={`${progressState.toFixed(2)}%`}
      >
        <span
          className="inline-block h-full bg-super-earth-blue transition-[width]"
          style={{ width: `${progressState}%` }}
        ></span>
        <span
          className="inline-block h-full transition-[width]"
          style={{
            width: `${enemyProgress}%`,
            backgroundColor: getFactionColorFromId(event.faction, false),
          }}
        ></span>
      </div>
    );
  }

  return (
    <div
      style={{ backgroundColor: factionColor }}
      className={`overflow-hidden w-full before:text-gray-700 before:top-0.5 before:left-0 relative h-6 before:absolute before:pl-2 before:text-sm before:content-[attr(data-label)]`}
      data-label={`${progressState.toFixed(2)}%`}
    >
      <span
        className="inline-block h-full bg-super-earth-blue transition-[width]"
        style={{ width: `${progressState}%` }}
      ></span>
    </div>
  );
}
