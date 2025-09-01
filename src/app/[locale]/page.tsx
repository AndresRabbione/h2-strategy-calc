"use server";

import Header from "../../../components/header";
import ObjectiveSection from "../../../components/objectiveSection";
import {
  getLatestMajorOrder,
  getStrategicOpportunities,
} from "../../API/orders/orderCalls";
import { StrategyFactory } from "../lib/classDefinitions";

export default async function Home() {
  const majorOrder = await getLatestMajorOrder();
  const opportunitites = await getStrategicOpportunities();
  const factory = new StrategyFactory(majorOrder, opportunitites ?? []);
  const strategy = await factory.generateNewStrategy();

  return (
    <div className="flex flex-col">
      <nav>
        <Header />
      </nav>
      <div className="flex flex-col">
        <ObjectiveSection
          majorOrder={strategy.majorOrder}
          opportunities={strategy.opportunities}
          targetedFactions={strategy.targetedFactions}
        />
      </div>
    </div>
  );
}
