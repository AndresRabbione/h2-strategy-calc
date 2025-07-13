export interface Attack {
  id: number;
  targetId: number;
  sourceId: number;
  updatedAt: string;
  createdAt: string;
}

//TODO: Update to new API specifications

const api = process.env.API_URL + "api/attacks";

export async function fetchAttacks(): Promise<Attack[] | undefined> {
  try {
    const request = await fetch(`{${api}}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    return await request.json();
  } catch (e) {
    console.log(e);
    return [];
  }
}
