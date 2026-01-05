import { FactionIDs } from "@/lib/typeDefinitions";
import { FactionIcon } from "./factionIcons";

export default function StratInfoDisplay({
  totalPlayerCount,
  minDifficulty,
  maxDifficulty,
  factions,
}: {
  totalPlayerCount: number;
  minDifficulty: number;
  maxDifficulty: number;
  factions: FactionIDs[];
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-helldiver-yellow text-lg">{totalPlayerCount}</span>

      <div className="flex gap-2 items-center">
        {factions.map((faction) => (
          <FactionIcon key={faction} factionId={faction}></FactionIcon>
        ))}
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        <span>Reccomended Difficulies</span>
        <span>
          {minDifficulty} - {maxDifficulty}
        </span>
      </div>
    </div>
  );
}
