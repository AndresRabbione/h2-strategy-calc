"use client";

import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getStraightPath,
  useInternalNode,
} from "@xyflow/react";
import { LinkEdgeData } from "../../hooks/useStepGraph";
import { getEdgeParams } from "@/utils/flow/helpers";

export default function LinkEdge({
  id,
  data,
  style,
  source,
  target,
}: EdgeProps<Edge<LinkEdgeData>>) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        pointerEvents={"none"}
        style={style}
      ></BaseEdge>
      <EdgeLabelRenderer>
        <span>{data?.progress}</span>
      </EdgeLabelRenderer>
    </>
  );
}
