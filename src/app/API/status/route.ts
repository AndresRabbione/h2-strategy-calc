const api = process.env.API_URL + "/raw/api/WarSeason/801/Status";

type StatusResponse = {
  warId: number;
  time: number;
  impactMultiplier: number;
  storyBeatId32: number;
  planetStatus: {
    index: number;
    owner: number;
    health: number;
    regenPerSecond: number;
    players: number;
  }[];
  planetAttacks: { source: number; target: number }[];
  campaigns: {
    id: number;
    planetIndex: number;
    type: number;
    count: number;
    race: number;
  }[];
  jointOperations: { id: number; planetIndex: number; hqNodeIndex: number }[];
  planetEvents: { id: number; planetIndex: number }[];
};

export async function getCurrentImpactMultiplier(): Promise<number> {
  try {
    const request = await fetch(`${api}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Super-Client": "helldivers.strategy.calc",
        "X-Super-Contact": "example@email.com",
      },
    });

    const responseJson: StatusResponse = await request.json();
    return;
  } catch (e) {
    console.error(e);
    return 0;
  }
}
