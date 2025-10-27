"use client";

import { DBRegion, FactionIDs, RegionSplit } from "@/lib/typeDefinitions";
import { getFactionColorFromId } from "@/utils/parsing/factions";
import { useEffect, useState } from "react";
import "@/styles/sidebar.css";
import { useTranslations } from "next-intl";

export default function RegionSplitModal({
  regionSplits,
  regions,
  totalPlayerCount,
  planetName,
  planetOwner,
  onClose,
}: {
  regionSplits: RegionSplit[];
  regions: DBRegion[];
  totalPlayerCount: number;
  planetName: string;
  planetOwner: FactionIDs;
  onClose: () => void;
}) {
  const [isMounted, setMounted] = useState(false);
  const t = useTranslations("RegionSplitModal");

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);

    return () => clearTimeout(timer);
  }, []);

  function handleClose() {
    setMounted(false);

    setTimeout(() => {
      onClose();
    }, 300);
  }

  if (regionSplits.length === 0) {
    return (
      <div className="fixed" onClick={(event) => event.stopPropagation()}>
        <div className="fixed inset-0 bg-black opacity-60 z-10"></div>
        <div className="fixed top-1/3 left-[35%] flex flex-col items-start rounded-lg bg-slate-800 shadow-lg z-15 p-3 w-1/3 h-1/3">
          <div className="flex flex-row items-center justify-between w-full">
            <span className="font-semibold text-lg">{t("title")}</span>
            <button
              className="flex items-center self-end justify-end font-light text-3xl p-2 hover:font-semibold cursor-pointer transition-all delay-75 duration-200 ease-in-out"
              onClick={handleClose}
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col self-start overflow-y-auto text-pretty mr-12">
            {t("no-split-body")}
          </div>
        </div>
      </div>
    );
  }
  const groupedStepMap = regionSplits.reduce((map, split) => {
    if (!map.has(split.created_at)) map.set(split.created_at, []);

    map.get(split.created_at)!.push(split);

    return map;
  }, new Map<string, RegionSplit[]>());

  const uniqueTimestamps = new Set<string>(
    regionSplits.map((split) => split.created_at)
  );
  const sortedTimestamps = [...uniqueTimestamps].sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const regionsMap = regions.reduce((map, region) => {
    if (!map.has(region.id)) map.set(region.id, region);

    return map;
  }, new Map<number, DBRegion>());

  return (
    <div className="fixed" onClick={(event) => event.stopPropagation()}>
      <div
        className={`fixed inset-0 bg-black opacity-60 z-10 ${
          isMounted
            ? "overlay-fade-enter overlay-fade-enter-active"
            : "overlay-fade-enter overlay-fade-exit-active"
        }`}
      ></div>
      <div className="fixed top-1/3 left-[36%] flex flex-col items-start rounded-lg bg-slate-800 shadow-lg z-15 p-3 w-1/3 h-1/3">
        <div className="flex flex-row items-center justify-between w-full">
          <span className="font-semibold text-lg">{t("title")}</span>
          <button
            className="flex items-center self-end justify-end font-light text-3xl p-2 hover:font-semibold cursor-pointer transition-all delay-75 duration-200 ease-in-out"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <div
          className="flex flex-col self-start w-full gap-1 overflow-y-auto 
          [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-gray-100
        [&::-webkit-scrollbar-thumb]:bg-gray-300
        dark:[&::-webkit-scrollbar-track]:bg-neutral-700
        dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {sortedTimestamps.map((timestamp, index) => {
            const splits = groupedStepMap.get(timestamp);

            const priorParsedTimestamp =
              index !== 0
                ? `${new Date(
                    sortedTimestamps[index - 1]
                  ).toLocaleDateString()} - ${new Date(
                    sortedTimestamps[index - 1]
                  ).toLocaleTimeString()}`
                : "";

            const parsedTimestamp = `${new Date(
              timestamp
            ).toLocaleDateString()} - ${new Date(
              timestamp
            ).toLocaleTimeString()}`;

            return (
              <div key={timestamp} className="flex flex-col">
                <span className="font-light text-xs opacity-90">
                  {index === 0
                    ? t("timestamp-title", {
                        previousTimestamp: parsedTimestamp,
                        now: t("now"),
                      })
                    : t("timestamp-title", {
                        previousTimestamp: parsedTimestamp,
                        now: priorParsedTimestamp,
                      })}
                </span>
                <div className="grid grid-cols-[5%_95%] w-full">
                  <svg
                    width="12"
                    height="24"
                    viewBox="0 0 12 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-90"
                  >
                    <line
                      x1="6"
                      y1="4"
                      x2="6"
                      y2="24"
                      stroke="gray"
                      strokeWidth="1"
                    />
                  </svg>
                  {splits!.map((split) => {
                    if (split.region_id) {
                      const region = regionsMap.get(split.region_id);

                      return (
                        <div
                          key={split.id}
                          className="flex flex-row gap-2 pl-3"
                        >
                          <span
                            className="text-base"
                            style={{
                              color: getFactionColorFromId(
                                region!.current_faction,
                                false
                              ),
                            }}
                          >{`${region!.name}: `}</span>
                          <div className="flex flex-row gap-1">
                            <span className="flex items-end text-xs">{`${split.percentage.toFixed(
                              2
                            )}%`}</span>
                            <span className="text-base">{`${Math.round(
                              totalPlayerCount * (split.percentage / 100)
                            )}`}</span>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={split.id} className="flex flex-row gap-2 pl-3">
                        <span
                          className="text-base"
                          style={{
                            color: getFactionColorFromId(planetOwner, false),
                          }}
                        >{`${planetName}: `}</span>
                        <div className="flex flex-row gap-1">
                          <span className="flex items-end text-xs">{`${split.percentage.toFixed(
                            2
                          )}%`}</span>
                          <span className="text-base">{`${Math.round(
                            totalPlayerCount * (split.percentage / 100)
                          )}`}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
