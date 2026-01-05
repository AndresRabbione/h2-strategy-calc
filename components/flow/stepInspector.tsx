import { Node } from "@xyflow/react";
import { StepNodeData } from "../../hooks/useStepGraph";
import { getFactionColorFromId } from "@/utils/parsing/factions";
import { DBRegion } from "@/lib/typeDefinitions";

function getFormattedDate(startDate: Date, endDate?: Date): string {
  const startString = `${startDate.toLocaleDateString()} - ${startDate.toLocaleTimeString()}`;
  const endString = endDate
    ? `${endDate.toLocaleDateString()} - ${endDate.toLocaleTimeString()}`
    : "Now";

  return `From ${startString} to ${endString}`;
}

export default function StepInspector({
  node,
  totalPlayerCount,
  regionsMap,
}: {
  node: Node<StepNodeData>;
  totalPlayerCount: number;
  regionsMap: Map<number, DBRegion>;
}) {
  const data = node.data;
  const factionColor = getFactionColorFromId(
    data.planet.current_faction,
    false
  );

  return (
    <div>
      <h3 className="font-medium">Step</h3>
      <span className="text-xs font-light">
        {getFormattedDate(data.startTime, data.endTime)}
      </span>

      <div className="flex flex-col mt-2 text-sm">
        <span style={{ color: factionColor }}>
          <strong className="text-white">Planet:</strong> {data.planet.name}
        </span>
        <span>
          <strong>Assigned Percentage:</strong>{" "}
          {data.playerPercentage.toFixed(2)}
        </span>
        <span>
          <strong>Progress:</strong> {data.progress}
        </span>

        <div>
          <h4 className="font-medium">Region Assignments</h4>

          {data.regionSplits.length > 0 &&
            data.regionSplits.map((split) => {
              if (split.region_id) {
                const region = regionsMap.get(split.region_id);

                return (
                  <div key={split.id} className="flex flex-row gap-2 pl-3">
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
                      color: getFactionColorFromId(
                        data.planet.current_faction,
                        false
                      ),
                    }}
                  >{`${data.planet.name}: `}</span>
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
    </div>
  );
}
