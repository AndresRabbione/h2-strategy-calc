import { Assignment } from "@/app/lib/typeDefinitions";

const api = process.env.API_URL + "/raw/api/v2/Assignment/War/801";

export async function getLatestMajorOrder(): Promise<Assignment> {
  try {
    const request = await fetch(`${api}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Super-Client": "helldivers.strategy.calc",
        "X-Super-Contact": "example@email.com",
      },
    });

    const responseJson = await request.json();

    if (responseJson.length === 0) {
      return { id32: -1 } as Assignment;
    }

    return responseJson[0];
  } catch (e) {
    console.error(e);
    return { id32: -1 } as Assignment;
  }
}

export async function getStrategicOpportunities(): Promise<
  Assignment[] | null
> {
  try {
    const request = await fetch(`${api}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Super-Client": "helldivers.strategy.calc",
        "X-Super-Contact": "example@email.com",
      },
    });

    const responseJson = await request.json();

    if (responseJson.length < 2) {
      return null;
    }

    return responseJson.slice(1);
  } catch (e) {
    console.error(e);
    return null;
  }
}
