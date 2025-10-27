"use client";

import { DBRegion, DisplayTarget, FactionIDs } from "@/lib/typeDefinitions";
import { FactionIcon } from "./factionIcons";
import PlanetProgressBar from "./planetProgressBar";
import { useState } from "react";
import RegionSplitModal from "./regionSplitModal";
import { createPortal } from "react-dom";
import { getFactionColorFromId } from "@/utils/parsing/factions";

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

  return (
    <div
      onClick={() => {
        setRegionsOpen((prev) => !prev);
        if (isRegionsOpen) document.body.style.overflow = "hidden";
      }}
      className="flex flex-col w-full border-1 divide-y-1 divide-white border-white h-fit shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
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
      <div className="flex flex-row gap-2 items-center">
        <FactionIcon factionId={target.currentOwner}></FactionIcon>
        <div
          className="flex flex-col gap-0"
          style={{ color: getFactionColorFromId(target.currentOwner, false) }}
        >
          <span>{target.name}</span>
          <span>
            {locale.includes("en")
              ? `${target.sector.name} Sector`
              : `Sector ${target.sector.name}`}
          </span>
        </div>
      </div>
      <div
        id="playerCountStats"
        className="grid grid-rows-1 grid-cols-[45%_27.5%_27.5%] items-center divide-x-1 divide-white"
      >
        <div className="flex flex-row w-full items-end justify-center gap-1 text-helldiver-yellow">
          <span className="text-sm">{`${(
            (target.playerCount / totalPlayerCount) *
            100
          ).toFixed(2)}%`}</span>
          <span className="text-lg mr-1">{target.playerCount}</span>
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
            style={{ color: getFactionColorFromId(target.currentOwner, false) }}
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
      <div className="flex flex-row justify-center items-end gap-1">
        <span className="text-sm">{`${target.assignedPercentage.toFixed(
          2
        )}%`}</span>
        <span className="text-lg mr-1">
          {Math.round(totalPlayerCount * (target.assignedPercentage / 100))}
        </span>
      </div>
    </div>
  );
}
