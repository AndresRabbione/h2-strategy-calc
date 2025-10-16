import { DBPlanet, StrategyStepFull } from "@/lib/typeDefinitions";

export default function StepChainsVertical({
  steps,
  width = 800,
  height = 400,
  allPlanets,
}: {
  steps: {
    steps: StrategyStepFull[];
    firstTimeStamp: string;
    planetId: number;
  }[];
  width?: number;
  height?: number;
  allPlanets: DBPlanet[];
}) {
  if (steps.length === 0) return null;

  // --- Time-based horizontal scaling ---
  const timestamps = steps.map((stepChain) =>
    new Date(stepChain.firstTimeStamp).getTime()
  );
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const timeRange = maxT - minT || 1;

  const scaleY = (t: number) => ((t - minT) / timeRange) * (width - 200) + 50;

  return (
    <svg width={width} height={height}>
      {steps.map((stepChain, i) => {
        const x = 120 + i * 150;
        const startY = scaleY(new Date(stepChain.firstTimeStamp).getTime());

        return (
          <g key={stepChain.planetId}>
            {/* Links between nodes */}
            {stepChain.steps.map((step, j) => {
              const y1 = startY + j * 60;
              const y2 = startY + (j + 1) * 60;
              return (
                j < stepChain.steps.length - 1 && (
                  <line
                    key={`line-${stepChain.planetId}-${j}`}
                    x1={x}
                    y1={y1}
                    x2={x}
                    y2={y2}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )
              );
            })}

            {/* Nodes */}
            {stepChain.steps.map((step, j) => {
              const y = startY + j * 60;
              return (
                <circle
                  key={`circle-${stepChain.planetId}-${step.id}`}
                  cx={x}
                  cy={y}
                  r={10}
                  fill="#000"
                  stroke="#fff"
                  strokeWidth={1.5}
                >
                  <title>{`Node ${step.id}`}</title>
                </circle>
              );
            })}

            {/* Chain label */}
            <text
              x={x}
              y={startY - 20}
              fontSize={12}
              fill="#fff"
              textAnchor="end"
            >
              {allPlanets.length !== 0
                ? allPlanets[stepChain.planetId].name
                : ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
