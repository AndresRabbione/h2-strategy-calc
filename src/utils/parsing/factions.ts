import {
  DBObjective,
  DBPlanet,
  FactionIDs,
  Factions,
} from "@/lib/typeDefinitions";
import { getTranslations } from "next-intl/server";

export function getFactionColorFromId(
  factionId: FactionIDs,
  isProgressBar: boolean
): string {
  switch (factionId) {
    case FactionIDs.HUMANS:
      return isProgressBar ? "#ffe711" : "#219ffb";
    case FactionIDs.AUTOMATONS:
      return "#fe6d6a";
    case FactionIDs.ILLUMINATE:
      return "#ce64f8";
    case FactionIDs.TERMINIDS:
      return "#fdc300";
    default:
      return "#ffe711";
  }
}

export function getFactionColorFromName(faction: Factions): string {
  switch (faction) {
    case Factions.HUMANS:
      return "#219ffb";
    case Factions.AUTOMATONS:
      return "#fe6d6a";
    case Factions.ILLUMINATE:
      return "#ce64f8";
    case Factions.TERMINIDS:
      return "#fdc300";
    default:
      return "#ffe711";
  }
}

export function getFactionFromObjective(
  objective: DBObjective,
  planets: DBPlanet[]
): FactionIDs {
  if (planets.length === 0) return FactionIDs.HUMANS;

  if (objective.factionId) return objective.factionId;

  if (objective.planetId) {
    return planets[objective.planetId].current_faction;
  }

  return FactionIDs.HUMANS;
}

export function getFactionIdFromName(factionName: Factions): number {
  switch (factionName) {
    case Factions.HUMANS:
      return FactionIDs.HUMANS;
    case Factions.AUTOMATONS:
      return FactionIDs.AUTOMATONS;
    case Factions.ILLUMINATE:
      return FactionIDs.ILLUMINATE;
    case Factions.TERMINIDS:
      return FactionIDs.TERMINIDS;
  }
}

export async function getFactionNameFromId(
  factionId: number,
  isCountable: boolean
): Promise<string> {
  const t = await getTranslations("FactionNames");
  const returnType = isCountable ? "countable" : "uncountable";

  switch (factionId) {
    case FactionIDs.HUMANS:
      return t(`human-${returnType}`);
    case FactionIDs.AUTOMATONS:
      return t(`automaton-${returnType}`);
    case FactionIDs.ILLUMINATE:
      return t(`illuminate-${returnType}`);
    case FactionIDs.TERMINIDS:
      return t(`terminid-${returnType}`);
    default:
      return t(`human-${returnType}`);
  }
}
