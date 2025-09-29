import { DBObjective, ObjectiveTypes, Planet } from "@/lib/typeDefinitions";
import { parseItemId } from "./items";
import {
  getFactionColorFromId,
  getFactionColorFromName,
  getFactionNameFromId,
} from "./factions";
import { parseSectorId } from "./sectors";
import { parseEnemyId } from "./enemy";
import { parseStratagemId } from "./stratagems";

export async function getObjectiveText(
  objective: DBObjective,
  allPlanets: Planet[]
): Promise<{ text: string; color: string; joiner: string }[]> {
  const source: { text: string; color: string; joiner: string }[] = [];
  const planet = objective.planetId ? allPlanets[objective.planetId] : null;
  const hasPlanet = objective.planetId !== null;

  switch (objective.type) {
    case ObjectiveTypes.COLLECT:
      const itemName = await parseItemId(objective.itemId!);

      if (hasPlanet) {
        source.push({ text: "on", color: "#ffffff", joiner: " " });
        source.push({
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: ", ",
        });
      }

      if (objective.factionId && !hasPlanet) {
        source.push({ text: `from`, color: "#ffffff", joiner: " " });
        source.push({
          text: getFactionNameFromId(objective.factionId),
          color: getFactionColorFromId(objective.factionId),
          joiner: " ",
        });
        source.push({ text: `planets`, color: "#ffffff", joiner: ", " });
      }

      if (objective.sectorId && !hasPlanet) {
        source.push({ text: `in the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${await parseSectorId(objective.sectorId)}`,
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: `sector`, color: "#ffffff", joiner: ", " });
      }

      return [
        { text: "Successfully extract with", color: "#ffffff", joiner: " " },
        {
          text: `${objective.totalAmount!.toLocaleString("en-US")} ${
            itemName + "s"
          }`,
          color: "#ffe711",
          joiner: " ",
        },
      ].concat(source);
    case ObjectiveTypes.DEFEND:
      if (!hasPlanet) {
        source.push({
          text: objective.totalAmount!.toLocaleString("en-US"),
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: "attacks", color: "#ffffff", joiner: " " });
      }

      if (objective.factionId && !hasPlanet) {
        source.push({ text: `from the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${getFactionNameFromId(objective.factionId)}`,
          color: getFactionColorFromId(objective.factionId),
          joiner: ", ",
        });
      }

      if (objective.sectorId && !hasPlanet) {
        source.push({ text: `in the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${await parseSectorId(objective.sectorId)}`,
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: `sector`, color: "#ffffff", joiner: ", " });
      }

      if (hasPlanet) {
        source.push({
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: ", ",
        });
      }

      return [
        {
          text: !hasPlanet ? "Defend" : "Defend against",
          color: "#ffffff",
          joiner: " ",
        },
      ].concat(source);
    case ObjectiveTypes.LIBERATE:
      return [
        { text: "Liberate", color: "#ffffff", joiner: " " },
        {
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: " ",
        },
      ];
    case ObjectiveTypes.HOLD:
      return [
        { text: "Hold", color: "#ffffff", joiner: " " },
        {
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: " ",
        },
      ];
    case ObjectiveTypes.LIBERATE_MORE:
      if (objective.factionId) {
        source.push({ text: `to the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${getFactionNameFromId(objective.factionId)}s`,
          color: getFactionColorFromId(objective.factionId),
          joiner: ", ",
        });
      }

      if (objective.sectorId) {
        source.push({ text: `in the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${await parseSectorId(objective.sectorId)}`,
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: `sector`, color: "#ffffff", joiner: ", " });
      }

      return [
        {
          text: "Liberate more planets than are lost",
          color: "#ffffff",
          joiner: " ",
        },
      ].concat(source);
    case ObjectiveTypes.OPERATIONS:
      const difficulty =
        objective.difficulty !== null
          ? [
              { text: "at difficulty", color: "#ffffff", joiner: " " },
              {
                text: `${objective.difficulty}`,
                color: "#ffe711",
                joiner: " ",
              },
              { text: "or higher", color: "#ffffff", joiner: " " },
            ]
          : [];

      if (hasPlanet) {
        source.push({ text: "on", color: "#ffffff", joiner: " " });
        source.push({
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: ", ",
        });
      }

      if (objective.factionId && !hasPlanet) {
        source.push({ text: `against the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${getFactionNameFromId(objective.factionId)}`,
          color: getFactionColorFromId(objective.factionId),
          joiner: ", ",
        });
      }

      if (objective.sectorId && !hasPlanet) {
        source.push({ text: `in the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${await parseSectorId(objective.sectorId)}`,
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: `sector`, color: "#ffffff", joiner: ", " });
      }

      return [
        { text: "Complete", color: "#ffffff", joiner: " " },
        {
          text: `${objective.totalAmount!.toLocaleString("en-US")}`,
          color: "#ffe711",
          joiner: " ",
        },
        { text: "operations", color: "#ffffff", joiner: " " },
      ].concat(difficulty, source);
    case ObjectiveTypes.KILL:
      if (hasPlanet) {
        source.push({ text: "on", color: "#ffffff", joiner: " " });
        source.push({
          text: planet!.name,
          color: getFactionColorFromName(planet!.currentOwner),
          joiner: " ",
        });
      }

      if (objective.sectorId && !hasPlanet) {
        source.push({ text: `in the`, color: "#ffffff", joiner: " " });
        source.push({
          text: `${await parseSectorId(objective.sectorId)}`,
          color: "#ffe711",
          joiner: " ",
        });
        source.push({ text: `sector`, color: "#ffffff", joiner: " " });
      }

      const strategem = objective.stratagemId
        ? [
            { text: "using the", color: "#ffffff", joiner: " " },
            {
              text: await parseStratagemId(objective.stratagemId),
              color: "#ffe711",
              joiner: " ",
            },
            { text: "stratagem", color: "#ffffff", joiner: " " },
          ]
        : [];

      const enemy = await parseEnemyId(objective.enemyId!, objective.factionId);
      return [
        { text: "Kill", color: "#ffffff", joiner: " " },
        {
          text: `${objective.totalAmount!.toLocaleString("en-US")}`,
          color: "#ffe711",
          joiner: " ",
        },
        {
          text: enemy.name,
          color: getFactionColorFromId(enemy.faction),
          joiner: " ",
        },
      ].concat(source, strategem);
    default:
      return [{ text: "Unknown Objective", color: "#ffffff", joiner: "" }];
  }
}
