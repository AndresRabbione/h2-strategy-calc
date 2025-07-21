import { Attack, Factions, Planet } from "@/app/lib/typeDefinitions";
import { findPlanetById } from "../planets/planetCalls";
import supplyLines from "@/app/lib/supply-lines.json";

const api = process.env.API_URL;

function isAttackAlreadyFound(sourceId: number, attacks: Attack[]): boolean {
  if (attacks.length === 0) return false;

  for (const attack of attacks) {
    if (attack.source.index === sourceId) return true;
  }

  return false;
}

export async function fetchAllAttacks(): Promise<Attack[]> {
  try {
    const request = await fetch(`${api}/api/v1/planet-events`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Super-Client": "helldivers.strategy.calc",
        "X-Super-Contact": "example@email.com",
      },
    });

    const responseJson: Planet[] = await request.json();
    const attacks: Attack[] = [];

    for (const defense of responseJson) {
      const planetName = defense.name;
      const linkedPlanets: { name: string; index: number }[] =
        supplyLines[planetName as keyof typeof supplyLines].links;

      for (const planet of linkedPlanets) {
        const fullPlanetInfo = await findPlanetById(planet.index);

        if (
          fullPlanetInfo.currentOwner !== Factions.HUMANS &&
          fullPlanetInfo.attacking.includes(defense.index) &&
          !isAttackAlreadyFound(fullPlanetInfo.index, attacks)
        ) {
          const attack: Attack = { source: fullPlanetInfo, targets: [] };

          for (const targetId of fullPlanetInfo.attacking) {
            attack.targets.push(await findPlanetById(targetId));
          }

          attacks.push(attack);
        }
      }
    }

    return attacks;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function isUnderAttack(planetId: number): Promise<boolean> {
  try {
    const target = await findPlanetById(planetId);

    return target.event !== null;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function findGambitForPlanet(planetId: number): Promise<Attack> {
  const planet = await findPlanetById(planetId);
  try {
    // Hack to bypass typescript stuff, unfortunate but necessary, in an ideal world this won't cause issues
    const linkedPlanets: { name: string; index: number }[] =
      supplyLines[planet.name as keyof typeof supplyLines].links;

    for (const linkedPlanet of linkedPlanets) {
      const fullPlanetInfo = await findPlanetById(linkedPlanet.index);

      if (
        fullPlanetInfo.currentOwner !== Factions.HUMANS &&
        fullPlanetInfo.attacking.includes(planet.index)
      ) {
        const attack: Attack = { source: fullPlanetInfo, targets: [] };

        for (const targetId of fullPlanetInfo.attacking) {
          attack.targets.push(await findPlanetById(targetId));
        }

        return attack;
      }
    }

    return { source: planet, targets: [] };
  } catch (e) {
    console.error(e);
    return { source: planet, targets: [] };
  }
}
