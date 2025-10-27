"use client";

import { DisplayObjective, ObjectiveTypes } from "@/lib/typeDefinitions";
import DualObjectiveProgressBar from "./dualObjectiveProgressBar";
import ObjectiveProgressBar from "./objectiveProgressBar";
import { getFactionColorFromId } from "@/utils/parsing/factions";

export default function GenericObjective({
  objective,
}: {
  objective: DisplayObjective;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p>
        {objective.text.map((fragment, index) => {
          return (
            <span key={index} style={{ color: fragment.color || "inherit" }}>
              {index === objective.text.length - 1
                ? fragment.text
                : `${fragment.text} `}
            </span>
          );
        })}
      </p>
      {objective.type === ObjectiveTypes.LIBERATE_MORE ? (
        <DualObjectiveProgressBar
          factionColor={getFactionColorFromId(objective.displayedFaction, true)}
          friendlyCount={objective.progress}
          enemyCount={objective.enemyProgress!}
        ></DualObjectiveProgressBar>
      ) : (
        <ObjectiveProgressBar
          factionColor={getFactionColorFromId(objective.displayedFaction, true)}
          progress={objective.progress}
          totalAmount={objective.totalAmount}
          progressPerHour={objective.progressPerHour}
        ></ObjectiveProgressBar>
      )}
    </div>
  );
}
