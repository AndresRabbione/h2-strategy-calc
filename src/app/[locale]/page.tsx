"use server";

import {
  getLatestMajorOrder,
  getStrategicOpportunities,
} from "../API/orders/route";
import { StrategyFactory } from "../lib/classDefinitions";

export default async function Home() {
  const majorOrder = await getLatestMajorOrder();
  const opportunitites = await getStrategicOpportunities();
  const factory = new StrategyFactory(
    majorOrder,
    opportunitites !== null ? opportunitites : []
  );
  const strategy = await factory.generateNewStrategy();
  return;
}
