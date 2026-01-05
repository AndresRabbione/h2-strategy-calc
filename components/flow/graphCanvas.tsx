"use client";

import { StrategyStepFull } from "@/lib/typeDefinitions";
import {
  Background,
  Controls,
  Edge,
  Node,
  OnEdgesChange,
  OnNodeDrag,
  OnNodesChange,
  OnSelectionChangeParams,
  ReactFlow,
} from "@xyflow/react";
import { GraphInstance, LinkEdgeData } from "../hooks/useStepGraph";
import FloatingConnectionLine from "./floatingLine";
import stepNode from "./stepNode";
import LinkEdge from "./progressEdge";

type CanvasProps = {
  nodes: Node<StrategyStepFull>[];
  edges: Edge<LinkEdgeData>[];
  onNodesChange: OnNodesChange<Node<StrategyStepFull>>;
  onEdgesChange: OnEdgesChange<Edge<LinkEdgeData>>;
  onSelectionChange: (selection: OnSelectionChangeParams) => void;
  setRfInstance: (instance: GraphInstance) => GraphInstance;
  onNodeDragStop: OnNodeDrag<Node<StrategyStepFull>>;
};

const NODE_HEIGHT = 64;
const NODE_WIDTH = 140;

export default function GraphCanvas({
  nodes,
  edges,
  onEdgesChange,
  onNodesChange,
  onSelectionChange,
  setRfInstance,
  onNodeDragStop,
}: CanvasProps) {
  return (
    <ReactFlow
      proOptions={{ hideAttribution: true }}
      onlyRenderVisibleElements
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={(instance: GraphInstance) => {
        requestAnimationFrame(() => {
          const { innerWidth, innerHeight } = window;
          instance.setViewport({
            x: innerWidth / 2.5 - NODE_WIDTH / 2,
            y: innerHeight / 2.5 - NODE_HEIGHT / 2,
            zoom: 1,
          });
        });

        setRfInstance(instance);
      }}
      onSelectionChange={(selection) =>
        onSelectionChange({ nodes: selection.nodes, edges: selection.edges })
      }
      connectionLineComponent={FloatingConnectionLine}
      nodeTypes={{ planet: stepNode }}
      edgeTypes={{ link: LinkEdge }}
      onNodeDragStop={onNodeDragStop}
    >
      <Background gap={16} size={1} />
      <Controls className="text-black"></Controls>
    </ReactFlow>
  );
}
