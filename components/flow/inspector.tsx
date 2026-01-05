"use client";

import { DBRegion } from "@/lib/typeDefinitions";
import { Edge, Node } from "@xyflow/react";
import { LinkEdgeData, StepNodeData } from "../../hooks/useStepGraph";
import StepInspector from "./stepInspector";
import { useMemo } from "react";

export default function Inspector({
  selectedElement,
  selectedNode,
  regions,
  totalPlayerCount,
}: {
  selectedElement: {
    type: "node" | "edge";
    id: string;
  } | null;
  selectedNode: Node<StepNodeData> | undefined;
  selectedEdge: Edge<LinkEdgeData> | undefined;
  regions: DBRegion[];
  totalPlayerCount: number;
}) {
  const regionsMap = useMemo(
    () =>
      regions.reduce((map, region) => {
        if (!map.has(region.id)) map.set(region.id, region);

        return map;
      }, new Map<number, DBRegion>()),
    [regions]
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Inspector</h2>

      {!selectedElement && (
        <div className="text-sm text-gray-400">
          Select a step in the strategy to inspect its properties
        </div>
      )}

      {selectedNode && (
        <StepInspector
          node={selectedNode}
          totalPlayerCount={totalPlayerCount}
          regionsMap={regionsMap}
        />
      )}

      <div className="mt-6 border-t border-gray-800 pt-4 text-sm text-gray-400">
        <div className="mb-2">Quick tips</div>
        <ul className="list-disc pl-5 space-y-1">
          <li>Drag nodes to rearrange them.</li>
        </ul>
      </div>
    </div>
  );
}
