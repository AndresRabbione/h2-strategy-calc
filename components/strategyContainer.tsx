"use client";

import {
  DBPlanetFull,
  DBRegion,
  DBSector,
  DisplayAssignment,
  FullStrategy,
  PlanetSnapshotFull,
} from "@/lib/typeDefinitions";
import NoStrategy from "./noStrategy";
import TargetCardContainer from "./targetCardContainer";
import { useEffect, useState } from "react";
import StepDisplayBox from "./strategyStepDisplayBox";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

export default function StrategyContainer({
  displayReadyAssignments,
  strategies,
  allPlanets,
  sectors,
  totalPlayerCount,
  latestSnapshots,
  regions,
  locale,
}: {
  displayReadyAssignments: DisplayAssignment[];
  strategies: FullStrategy[];
  allPlanets: DBPlanetFull[];
  sectors: DBSector[];
  totalPlayerCount: number;
  latestSnapshots: PlanetSnapshotFull[];
  regions: DBRegion[];
  locale: string;
}) {
  const t = useTranslations("Header");
  const [timelineMode, setMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const portalTarget = mounted ? document.getElementById("modeToggle") : null;

  return (
    <div>
      {portalTarget && strategies.length > 0
        ? createPortal(
            <button
              className="cursor-pointer"
              onClick={() => setMode((prev) => !prev)}
            >
              {timelineMode ? t("table-toggle") : t("timeline-toggle")}
            </button>,
            document.getElementById("modeToggle")!
          )
        : null}
      {displayReadyAssignments.length === 0 || strategies.length === 0 ? (
        <NoStrategy
          hasAssignment={displayReadyAssignments.length > 0}
        ></NoStrategy>
      ) : !timelineMode ? (
        <TargetCardContainer
          targets={strategies.flatMap((strategy) => strategy.strategyStep)}
          allPlanets={allPlanets}
          sectors={sectors}
          totalPlayerCount={totalPlayerCount}
          latestSnapshots={latestSnapshots}
          regions={regions}
          locale={locale}
        ></TargetCardContainer>
      ) : (
        <div className="p-3 h-full">
          <StepDisplayBox
            strategies={strategies}
            allPlanets={allPlanets}
            horizontal={false}
            regions={regions}
            totalPlayerCount={totalPlayerCount}
          ></StepDisplayBox>
        </div>
      )}
    </div>
  );
}
