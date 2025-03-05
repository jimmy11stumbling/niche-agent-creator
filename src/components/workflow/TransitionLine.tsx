
import React from "react";
import { Task } from "@/types/workflow";

interface TransitionLineProps {
  sourceTask: Task;
  targetTask: Task;
  condition?: string;
  selected: boolean;
}

const TransitionLine: React.FC<TransitionLineProps> = ({
  sourceTask,
  targetTask,
  condition,
  selected,
}) => {
  // Calculate the center points of the tasks
  const sourceCenter = {
    x: sourceTask.position.x + 80, // Assuming task width is approximately 160px
    y: sourceTask.position.y + 30, // Assuming task height is approximately 60px
  };
  
  const targetCenter = {
    x: targetTask.position.x + 80,
    y: targetTask.position.y + 30,
  };

  // Calculate the path for a curved line
  const midX = (sourceCenter.x + targetCenter.x) / 2;
  const midY = (sourceCenter.y + targetCenter.y) / 2;
  
  const path = `M ${sourceCenter.x} ${sourceCenter.y} Q ${midX + 30} ${midY} ${targetCenter.x} ${targetCenter.y}`;

  // Determine if this is a data processing path
  const isDataPath = 
    (sourceTask.type === "Action" && sourceTask.actionType === "DataProcessing") ||
    (targetTask.type === "Action" && targetTask.actionType === "DataProcessing");

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={selected ? "#0284c7" : isDataPath ? "#6366f1" : "#94a3b8"}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray={condition ? "5,5" : undefined}
      />
      <polygon
        points={`${targetCenter.x},${targetCenter.y} ${targetCenter.x - 6},${targetCenter.y - 4} ${targetCenter.x - 6},${targetCenter.y + 4}`}
        fill={selected ? "#0284c7" : isDataPath ? "#6366f1" : "#94a3b8"}
        transform={`rotate(${Math.atan2(
          targetCenter.y - midY,
          targetCenter.x - midX
        ) * (180 / Math.PI)}, ${targetCenter.x}, ${targetCenter.y})`}
      />
      
      {condition && (
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="10"
          fontFamily="sans-serif"
          className="select-none"
        >
          {condition.length > 20 ? condition.substring(0, 20) + "..." : condition}
        </text>
      )}
    </g>
  );
};

export default TransitionLine;
