"use client";

import { DBRegion, DisplayTarget, FactionIDs } from "@/lib/typeDefinitions";
import { FactionIcon } from "./factionIcons";
import PlanetProgressBar from "./planetProgressBar";
import { useEffect, useState } from "react";
import RegionSplitModal from "./regionSplitModal";
import { createPortal } from "react-dom";
import { getFactionColorFromId } from "@/utils/parsing/factions";
import { calculateTimeRemaining, TimeUnit } from "@/utils/helpers/timeCalcs";
import { estimateTimeToVictory } from "@/utils/helpers/estimations";

export default function TargetCard({
  target,
  totalPlayerCount,
  regions,
  locale,
}: {
  target: DisplayTarget;
  totalPlayerCount: number;
  regions: DBRegion[];
  locale: string;
}) {
  const [isRegionsOpen, setRegionsOpen] = useState(false);
  const [victoryTime, setVictoryTime] = useState<TimeUnit[]>([]);
  const factionColor = getFactionColorFromId(target.currentOwner, false);

  useEffect(() => {
    const timer = setInterval(() => {
      const estimatedTimeToVictory = estimateTimeToVictory(
        target.progressPerHour - target.regenPerHour,
        target.progress,
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
      target.progress,
      target.event
    );

    if (estimatedTimeToVictory !== Infinity) {
      const estimatedVictoryDate = new Date(
        Date.now() + estimatedTimeToVictory * 3600000
      );
      setVictoryTime(calculateTimeRemaining(estimatedVictoryDate));
    } else {
      setVictoryTime([]);
    }

    return () => clearInterval(timer);
  }, [
    target.progress,
    target.regenPerHour,
    target.progressPerHour,
    target.event,
  ]);

  return (
    <div className="bg-helldiver-yellow p-0.5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-lg">
      <div
        onClick={() => {
          setRegionsOpen((prev) => !prev);
          if (isRegionsOpen) document.body.style.overflow = "hidden";
        }}
        className="flex flex-col w-full bg-[#2a2a29] insert-shadow-md h-fit shadow-md rounded-lg"
      >
        {isRegionsOpen &&
          createPortal(
            <RegionSplitModal
              regionSplits={target.regionSplits}
              regions={regions}
              totalPlayerCount={totalPlayerCount}
              planetName={target.name}
              planetOwner={target.currentOwner}
              onClose={() => {
                setRegionsOpen(false);
                document.body.style.overflow = "unset";
              }}
            ></RegionSplitModal>,
            document.body
          )}
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
          {victoryTime.length > 0 && (
            <div className="flex flex-row gap-2 pr-2">
              <span>Est. Victory:</span>
              <span>
                {victoryTime.length &&
                  victoryTime
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
          <div className="flex w-full items-end justify-center text-helldiver-yellow">
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
                color: getFactionColorFromId(target.currentOwner, false),
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
        <div className="flex justify-center items-end py-2">
          <span className="text-lg">
            <sub className="text-xs m-0.5">{`${target.assignedPercentage.toFixed(
              2
            )}%`}</sub>
            {Math.round(totalPlayerCount * (target.assignedPercentage / 100))}
          </span>
        </div>
      </div>
    </div>
  );
}
