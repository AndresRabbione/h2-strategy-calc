"use client";

import { BlobTarget, FactionIDs } from "@/lib/typeDefinitions";
import { FactionIcon } from "./factionIcons";
import PlanetProgressBar from "./planetProgressBar";
import { getFactionColorFromId } from "@/utils/parsing/factions";
import { estimateTimeToVictory } from "@/utils/helpers/estimations";
import { calculateTimeRemaining, TimeUnit } from "@/utils/helpers/timeCalcs";
import { useEffect, useState } from "react";

export default function BlobCard({
  target,
  totalPlayerCount,
  locale,
}: {
  target: BlobTarget;
  totalPlayerCount: number;
  locale: string;
}) {
  const [victoryTime, setVictoryTime] = useState<TimeUnit[]>([]);
  const [currentProgress, setProgress] = useState(target.progress);
  const factionColor = getFactionColorFromId(target.currentOwner, false);

  useEffect(() => {
    const timer = setInterval(() => {
      const progressPerSecond =
        (target.progressPerHour - target.regenPerHour) / 3600;
      setProgress((prev) => {
        const newProgress = prev + progressPerSecond;

        return Math.min(newProgress, 100);
      });

      const estimatedTimeToVictory = estimateTimeToVictory(
        target.progressPerHour - target.regenPerHour,
        currentProgress,
        target.event
      );

      if (estimatedTimeToVictory === Infinity) {
        setVictoryTime([]);
        return;
      }

      const estimatedVictoryDate = new Date(
        Date.now() + estimatedTimeToVictory * 3600000
      );

      setVictoryTime(calculateTimeRemaining(estimatedVictoryDate));
    }, 1000);

    const estimatedTimeToVictory = estimateTimeToVictory(
      target.progressPerHour - target.regenPerHour,
      currentProgress,
      target.event
    );

    const estimatedVictoryDate = new Date(
      Date.now() + estimatedTimeToVictory * 3600000
    );
    setVictoryTime(calculateTimeRemaining(estimatedVictoryDate));

    return () => clearInterval(timer);
  }, [
    currentProgress,
    target.regenPerHour,
    target.progressPerHour,
    target.event,
  ]);

  useEffect(() => {
    setProgress(target.progress);
  }, [target.progress]);

  return (
    <div className="bg-gray-800 p-2 rounded-lg">
      <div className="flex flex-col w-full bg-[#2a2a29] insert-shadow-md h-fit shadow-sm shadow-black rounded-lg">
        <div className="flex flex-row gap-2 items-center justify-between border-b-3 py-1 border-black">
          <div className="flex flex-row gap-2 items-center">
            <FactionIcon factionId={target.currentOwner}></FactionIcon>
            <div className="flex flex-col" style={{ color: factionColor }}>
              <span>{target.name}</span>
              <span>
                {locale.includes("en")
                  ? `${target.sector.name} Sector`
                  : `Sector ${target.sector.name}`}
              </span>
            </div>
          </div>
          {victoryTime.length && (
            <div className="flex flex-row gap-2 pr-2">
              <span>Est. Victory:</span>
              <span>
                {victoryTime
                  .map(
                    (unit, index) =>
                      `${unit.value}${unit.unit}${
                        index === 0 && victoryTime.length > 1 ? " " : ""
                      }`
                  )
                  .join("")}
              </span>
            </div>
          )}
        </div>
        <div
          id="playerCountStats"
          className="grid grid-rows-1 grid-cols-[45%_27.5%_27.5%] items-center divide-x-3 divide-black py-2"
        >
          <div className="flex w-full items-end justify-center gap-1 text-helldiver-yellow">
            <span className="text-lg">
              <sub className="text-xs m-0.5">{`${(
                (target.playerCount / totalPlayerCount) *
                100
              ).toFixed(2)}%`}</sub>
              {target.playerCount}
            </span>
          </div>
          <div
            id="progressPerHourStats"
            className="flex w-full items-center justify-center"
          >
            <span className="text-super-earth-blue">{`${target.progressPerHour.toFixed(
              2
            )}%`}</span>
          </div>
          <div
            id="regenStats"
            className="flex w-full justify-center items-center"
          >
            <span
              style={{
                color: factionColor,
              }}
            >{`${
              target.currentOwner !== FactionIDs.HUMANS
                ? target.regenPerHour.toFixed(2)
                : "0.00"
            }%`}</span>
          </div>
        </div>
        <PlanetProgressBar
          progress={target.progress}
          progressPerHour={target.progressPerHour - target.regenPerHour}
          faction={target.currentOwner}
          event={target.event}
        ></PlanetProgressBar>
      </div>
    </div>
  );
}
