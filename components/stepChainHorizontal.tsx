import { StrategyStepFull } from "@/lib/typeDefinitions";

export default function StepChainsHorizontal({
  steps,
  width = 800,
  height = 400,
}: {
  steps: {
    steps: StrategyStepFull[];
    firstTimeStamp: string;
    planetId: number;
  }[];
  width?: number;
  height?: number;
}) {
  if (steps.length === 0) return null;

  // --- Time-based horizontal scaling ---
  const timestamps = steps.map((stepChain) =>
    new Date(stepChain.firstTimeStamp).getTime()
  );
  const minT = Math.min(...timestamps);
  const maxT = Math.max(...timestamps);
  const timeRange = maxT - minT || 1;

  const scaleX = (t: number) => ((t - minT) / timeRange) * (width - 200) + 50;

  return (
    <svg width={width} height={height}>
      {steps.map((stepChain, i) => {
        const y = 80 + i * 100;
        const startX = scaleX(new Date(stepChain.firstTimeStamp).getTime());

        return (
          <g key={stepChain.planetId}>
            {/* Links between nodes */}
            {stepChain.steps.map((step, j) => {
              const x1 = startX + j * 60;
              const x2 = startX + (j + 1) * 60;
              return (
                j < stepChain.steps.length - 1 && (
                  <line
                    key={`line-${stepChain.planetId}-${j}`}
                    x1={x1}
                    y1={y}
                    x2={x2}
                    y2={y}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                )
              );
            })}

            {/* Nodes */}
            {stepChain.steps.map((step, j) => {
              const x = startX + j * 60;
              return (
                <circle
                  key={`circle-${stepChain.planetId}-${step.id}`}
                  cx={x}
                  cy={y}
                  r={10}
                  fill="#4f46e5"
                  stroke="#222"
                  strokeWidth={1.5}
                >
                  <title>{`Node ${step.id}`}</title>
                </circle>
              );
            })}

            {/* Chain label */}
            <text
              x={startX - 30}
              y={y + 5}
              fontSize={12}
              fill="#333"
              textAnchor="end"
            >
              {stepChain.planetId}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
