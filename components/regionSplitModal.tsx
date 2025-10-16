"use client";

import { DBRegion, FactionIDs, RegionSplit } from "@/lib/typeDefinitions";
import { getFactionColorFromId } from "@/utils/parsing/factions";

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
  if (regionSplits.length === 0) {
    return (
      <div className="fixed" onClick={(event) => event.stopPropagation()}>
        <div className="fixed inset-0 bg-black opacity-60 z-10"></div>
        <div className="fixed top-1/3 left-2/5 flex flex-col items-start rounded-lg bg-slate-800 shadow-lg z-15 p-3 w-1/4 h-1/3">
          <div className="flex flex-row items-center justify-between w-full">
            <span className="font-semibold text-lg">Regions</span>
            <button
              className="flex items-center self-end justify-end font-light text-3xl p-2 hover:font-semibold cursor-pointer transition-all delay-75 duration-150 ease-in-out"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div className="flex flex-col self-start overflow-y-auto text-pretty mr-12">
            {"This planet's regions haven't been assigned yet"}
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
      <div className="fixed inset-0 bg-black opacity-60 z-10"></div>
      <div className="fixed top-1/3 left-2/5 flex flex-col items-start rounded-lg bg-slate-800 shadow-lg z-15 p-3 w-1/4 h-1/3">
        <div className="flex flex-row items-center justify-between w-full">
          <span className="font-semibold text-lg">Regions</span>
          <button
            className="flex items-center self-end justify-end font-light text-3xl p-2 hover:font-semibold cursor-pointer transition-all delay-75 duration-150 ease-in-out"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="flex flex-col self-start overflow-y-auto">
          {sortedTimestamps.map((timestamp, index) => {
            const splits = groupedStepMap.get(timestamp);

            const priorParsedTimestamp =
              index === 0
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
              <div key={timestamp} className="flex flex-col mr-12">
                <span className="font-light text-xs opacity-90">
                  {index === 0
                    ? `From ${parsedTimestamp} to Now`
                    : `From ${parsedTimestamp} to ${priorParsedTimestamp}`}
                </span>
                <div className="grid grid-cols-[5%_95%] w-full">
                  {index === sortedTimestamps.length - 1 && (
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
                  )}
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
