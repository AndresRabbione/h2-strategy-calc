import {
  Edge,
  MarkerType,
  Node,
  OnNodeDrag,
  OnSelectionChangeParams,
  ReactFlowInstance,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  DBPlanetFull,
  RegionSplit,
  StrategyStepFull,
} from "@/lib/typeDefinitions";

export type LinkEdgeData = { progress: number };

export type StepNodeData = {
  id: number;
  strategyId: number;
  startTime: Date;
  endTime?: Date;
  regionSplits: RegionSplit[];
  playerPercentage: number;
  progress: number;
  planet: { name: string; current_faction: number };
};

const NODE_W = 140;
const NODE_H = 64;

const makeNodes = (
  stepObjects: {
    steps: StrategyStepFull[];
    firstTimeStamp: string;
    planetId: number;
  }[],
  allPlanets: DBPlanetFull[]
): Node<StepNodeData>[] => {
  return stepObjects.flatMap((stepObject) => {
    return stepObject.steps.map((step) => {
      const planet = allPlanets[step.planetId];
      return {
        id: `${step.id}-${step.strategyId}`,
        position: {
          x: NODE_W,
          y: NODE_H,
        },
        data: {
          id: step.id,
          strategyId: step.strategyId,
          startTime: new Date(step.created_at),
          regionSplits: step.planet_region_split,
          playerPercentage: step.playerPercentage,
          progress: step.progress,
          planet: { ...planet },
        },
        type: "step",
      };
    });
  });
};

const makeEdges = (nodes: Node<StepNodeData>[]): Edge<LinkEdgeData>[] => {
  if (nodes.length === 1) return [];

  const edges: Edge<LinkEdgeData>[] = [];

  for (let i = 1; i < nodes.length; i++) {
    const previousNode = nodes[i - 1];
    const currentNode = nodes[i];

    const edge: Edge<LinkEdgeData> = {
      id: `edge-${previousNode.id}-${currentNode.id}`,
      source: previousNode.id,
      target: currentNode.id,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 16,
        height: 10,
      },
      interactionWidth: 25,
      selectable: false,
      data: {
        progress: previousNode.data.progress,
      },
      style: { strokeWidth: 2 },
      animated: false,
      type: "link",
      sourceHandle: undefined,
      targetHandle: undefined,
    };

    edges.push(edge);
  }

  return edges;
};

type StepNode = Node<StepNodeData>;

type LinkEdge = Edge<LinkEdgeData>;

export type GraphInstance = ReactFlowInstance<StepNode, LinkEdge>;

export function useStepGraph(
  stepObjects: {
    steps: StrategyStepFull[];
    firstTimeStamp: string;
    planetId: number;
  }[],
  allPlanets: DBPlanetFull[]
) {
  const [nodes, setNodes, onNodesChange] = useNodesState<StepNode>(
    makeNodes(stepObjects, allPlanets)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<LinkEdge>(
    makeEdges(nodes)
  );

  const rfInstance = useRef<GraphInstance | null>(null);

  const [selectedElement, setSelectedElement] = useState<{
    type: "node" | "edge";
    id: string;
  } | null>(null);
  const selectedRef = useRef<string | null>(null);

  const onInit = useCallback(
    (instance: GraphInstance) => (rfInstance.current = instance),
    []
  );

  const onSelectionChange = useCallback(
    (selection: OnSelectionChangeParams) => {
      let newSelection: { type: "node" | "edge"; id: string } | null = null;

      if (selection.edges && selection.edges.length > 0) {
        newSelection = { type: "edge", id: selection.edges[0].id };
      } else if (selection.nodes && selection.nodes.length > 0) {
        newSelection = { type: "node", id: selection.nodes[0].id };
      }

      const newId = newSelection?.id ?? null;

      if (selectedRef.current !== newId) {
        selectedRef.current = newId;
        setSelectedElement(newSelection);
      }
    },
    []
  );

  const selectedEdge = useMemo(
    () => edges.find((edge) => edge.id === selectedElement?.id),
    [edges, selectedElement]
  );
  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedElement?.id),
    [nodes, selectedElement]
  );

  const dragTimeout = useRef<number | null>(null);
  const onNodeDragStop: OnNodeDrag<StepNode> = useCallback(
    (__event, draggedNode) => {
      setNodes((prevNodes) =>
        prevNodes.map((node) =>
          node.id === draggedNode.id
            ? { ...node, position: draggedNode.position }
            : node
        )
      );

      if (dragTimeout.current) window.clearTimeout(dragTimeout.current);
      dragTimeout.current = window.setTimeout(() => {}, 250);
    },
    [setNodes]
  );

  return {
    // state
    nodes,
    edges,
    rfInstance,
    selectedElement,
    selectedEdge,
    selectedNode,
    // setters + handlers
    setRfInstance: onInit,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onSelectionChange,
    onNodeDragStop,
  } as const;
}
