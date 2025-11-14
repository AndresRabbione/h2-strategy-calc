"use client";

import { DBPlanet, DBRegion, StrategyStepFull } from "@/lib/typeDefinitions";
import { useState } from "react";
import { createPortal } from "react-dom";
import RegionSplitModal from "./regionSplitModal";

export default function StepChainsVertical({
  steps,
  width = 800,
  height = 400,
  allPlanets,
  regions,
  totalPlayerCount,
}: {
  steps: {
    steps: StrategyStepFull[];
    firstTimeStamp: string;
    planetId: number;
  }[];
  width?: number;
  height?: number;
  allPlanets: DBPlanet[];
  regions: DBRegion[];
  totalPlayerCount: number;
}) {
  const [isOpen, setOpen] = useState(false);
  const [openedStep, setOpenStep] = useState<StrategyStepFull | null>(null);
  if (steps.length === 0) return null;

  // --- Time-based horizontal scaling ---
  const timestamps = steps.map((stepChain) =>
    new Date(stepChain.firstTimeStamp).getTime()
  );
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const timeRange = maxT - minT || 1;

  const circleRadius = 30;
  const spacing = circleRadius * 2 + 45;
  const labelPadding = 5;

  const scaleY = (t: number) => ((t - minT) / timeRange) * (height - 100) + 50;

  return (
    <svg width={width} height={height}>
      {isOpen &&
        createPortal(
          <RegionSplitModal
            regionSplits={openedStep!.planet_region_split}
            regions={regions}
            totalPlayerCount={totalPlayerCount}
            planetName={allPlanets[openedStep!.planetId].name}
            planetOwner={allPlanets[openedStep!.planetId].current_faction}
            onClose={() => setOpen(false)}
          ></RegionSplitModal>,
          document.body
        )}
      {steps.map((stepChain, i) => {
        const chainPlanet = allPlanets[stepChain.planetId];

        const x = 100 + i * 150;
        const startY = scaleY(new Date(stepChain.firstTimeStamp).getTime());

        return (
          <g key={stepChain.planetId}>
            {/* Links between nodes */}
            {stepChain.steps.map((step, j) => {
              const y1 = startY + circleRadius + labelPadding + j * spacing;
              const y2 =
                startY + circleRadius + labelPadding + (j + 1) * spacing;

              const greenY = y1 + (y2 - y1) * (step.progress / 100);

              return (
                j < stepChain.steps.length - 1 && (
                  <g key={`line-${stepChain.planetId}-${j}`}>
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke="#706f6c"
                      strokeWidth={6}
                    />
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={greenY}
                      stroke="green"
                      strokeWidth={6}
                    ></line>
                    {step.progress >= 0.01 && (
                      <text
                        fill="#fff"
                        textAnchor="end"
                        x={x + circleRadius + 15}
                        y={(y1 + y2) / 2 + 5}
                      >
                        {step.progress.toFixed(2)}
                      </text>
                    )}
                  </g>
                )
              );
            })}

            {/* Nodes */}
            {stepChain.steps.map((step, j) => {
              const y = startY + circleRadius + labelPadding + j * spacing;

              return (
                <g key={`circle-${stepChain.planetId}-${step.id}`}>
                  <circle
                    className="cursor-pointer"
                    cx={x}
                    cy={y}
                    r={circleRadius}
                    stroke="#706f6c"
                    fill="#222"
                    strokeWidth={4.5}
                    onClick={() => {
                      setOpenStep(step);
                      setOpen((prev) => !prev);
                    }}
                  ></circle>
                  {j === stepChain.steps.length - 1 && (
                    <g>
                      <clipPath id={`clip-${stepChain.planetId}-${step.id}`}>
                        <rect
                          x={x - circleRadius}
                          y={
                            y +
                            circleRadius -
                            2 * circleRadius * (step.progress / 100)
                          }
                          width={2 * circleRadius}
                          height={2 * circleRadius * (step.progress / 100)}
                        />
                      </clipPath>
                      <circle
                        cx={x}
                        cy={y}
                        r={circleRadius}
                        fill="green"
                        clipPath={`url(#clip-${stepChain.planetId}-${step.id})`}
                        className="cursor-pointer"
                        onClick={() => {
                          setOpenStep(step);
                          setOpen((prev) => !prev);
                        }}
                      />
                    </g>
                  )}
                </g>
              );
            })}

            {/* Chain label */}
            <text
              x={x - 30}
              y={startY - 20}
              fontSize={12}
              fill="#fff"
              textAnchor="middle"
              transform={`rotate(-30, ${x}, ${startY - 20})`}
            >
              {allPlanets.length !== 0 ? chainPlanet.name : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
