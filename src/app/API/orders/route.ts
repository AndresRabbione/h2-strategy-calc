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

    return await request.json();
  } catch (e) {
    console.log(e);
    return { id32: -1 } as MajorOrder;
  }
}
