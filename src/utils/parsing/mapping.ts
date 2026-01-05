import { DBPlanetFull } from "@/lib/typeDefinitions";

export function createDBPlanetMap(
  allPlanets: DBPlanetFull[]
): Map<number, DBPlanetFull> {
  const map = new Map<number, DBPlanetFull>();

  for (const planet of allPlanets) {
    map.set(planet.id, planet);
  }

  return map;
}
