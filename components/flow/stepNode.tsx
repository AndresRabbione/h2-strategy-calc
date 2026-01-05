"use client";

import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { memo } from "react";
import { StrategyStepFull } from "@/lib/typeDefinitions";

function StepNode({ id, data, selected }: NodeProps<Node<StrategyStepFull>>) {
  return (
    <div
      className={`flex items-center justify-center relative w-20 h-20 p-3 rounded-lg border bg-linear-to-b from-slate-800/70 to-black/20 shadow-[0_6px_18px_rgba(0,200,255,0.04)]`}
    >
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-20" />

      <div className="hidden">
        <Handle type="target" position={Position.Left} id={`t-${id}`} />
        <Handle type="source" position={Position.Right} id={`s-${id}`} />
      </div>
    </div>
  );
}

export default memo(StepNode);
