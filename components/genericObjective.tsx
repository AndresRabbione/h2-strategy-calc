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
    <div className="flex flex-col">
      <p>
        {objective.text.map((fragment, index) => {
          return (
            <span key={index} className={`text-[${fragment.color}]`}>{`${
              fragment.text
            }${
              index === objective.text.length - 1 ? "." : fragment.joiner
            }`}</span>
          );
        })}
      </p>
      {objective.type === ObjectiveTypes.LIBERATE_MORE ? (
        <DualObjectiveProgressBar
          factionColor={getFactionColorFromId(objective.displayedFaction)}
          friendlyCount={objective.progress}
          enemyCount={objective.enemyProgress!}
        ></DualObjectiveProgressBar>
      ) : (
        <ObjectiveProgressBar
          factionColor={getFactionColorFromId(objective.displayedFaction)}
          progress={objective.progress}
          totalAmount={objective.totalAmount}
        ></ObjectiveProgressBar>
      )}
    </div>
  );
}
