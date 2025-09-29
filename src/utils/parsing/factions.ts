import {
  DBObjective,
  FactionIDs,
  FactionNames,
  Factions,
  Planet,
} from "@/lib/typeDefinitions";

export function getFactionColorFromId(factionId: FactionIDs): string {
  switch (factionId) {
    case FactionIDs.HUMANS:
      return "#219ffb";
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
  planets: Planet[]
): FactionIDs {
  if (objective.factionId) return objective.factionId;

  if (objective.planetId) {
    const faction = planets[objective.planetId].currentOwner;
    return getFactionIdFromName(faction);
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

export function getFactionNameFromId(factionId: number): FactionNames {
  switch (factionId) {
    case FactionIDs.HUMANS:
      return FactionNames.HUMANS;
    case FactionIDs.AUTOMATONS:
      return FactionNames.AUTOMATONS;
    case FactionIDs.ILLUMINATE:
      return FactionNames.ILLUMINATE;
    case FactionIDs.TERMINIDS:
      return FactionNames.TERMINIDS;
    default:
      return FactionNames.HUMANS;
  }
}
