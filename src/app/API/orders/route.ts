import { MajorOrder } from "@/app/lib/typeDefinitions";

const api = process.env.API_URL + "/raw/api/v2/Assignment/War/801";

export async function getLatestMajorOrder(): Promise<MajorOrder> {
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
      return { id32: -1 } as MajorOrder;
    }

    return responseJson[0];
  } catch (e) {
    console.error(e);
    return { id32: -1 } as MajorOrder;
  }
}

export async function getStrategicOpportunities(): Promise<
  MajorOrder[] | null
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
