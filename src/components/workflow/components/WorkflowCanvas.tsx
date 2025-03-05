
import React from 'react';
import { Task } from "@/types/workflow";
import TaskNode from "../TaskNode";
import TransitionLine from "../TransitionLine";
import { getTaskById } from "../utils";

interface WorkflowCanvasProps {
  tasks: Task[];
  transitions: any[];
  selectedTaskId: string | null;
  selectedTransitionId: string | null;
  connectionInProgress: {
    sourceId: string;
    targetPos: { x: number; y: number };
  } | null;
  onTaskSelect: (id: string) => void;
  onTaskMove: (id: string, position: { x: number; y: number }) => void;
  onTransitionSelect: (id: string) => void;
  canvasRef: React.RefObject<HTMLDivElement>;
  onCanvasClick: (e: React.MouseEvent) => void;
  onCanvasMouseMove: (e: React.MouseEvent) => void;
}

const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  tasks,
  transitions,
  selectedTaskId,
  selectedTransitionId,
  connectionInProgress,
  onTaskSelect,
  onTaskMove,
  onTransitionSelect,
  canvasRef,
  onCanvasClick,
  onCanvasMouseMove
}) => {
  return (
    <div
      ref={canvasRef}
      className="flex-1 relative bg-slate-50 overflow-auto min-h-[500px]"
      onClick={onCanvasClick}
      onMouseMove={onCanvasMouseMove}
    >
      {/* Tasks */}
      {tasks.map((task) => (
        <TaskNode
          key={task.id}
          task={task}
          selected={selectedTaskId === task.id}
          onSelect={onTaskSelect}
          onMove={onTaskMove}
        />
      ))}
      
      {/* Connections SVG Layer */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        {transitions.map((transition) => {
          const sourceTask = getTaskById(tasks, transition.sourceTaskId);
          const targetTask = getTaskById(tasks, transition.targetTaskId);
          
          if (!sourceTask || !targetTask) return null;
          
          return (
            <g 
              key={transition.id} 
              onClick={(e) => {
                e.stopPropagation();
                onTransitionSelect(transition.id);
              }}
              className="pointer-events-auto cursor-pointer"
            >
              <TransitionLine
                sourceTask={sourceTask}
                targetTask={targetTask}
                condition={transition.condition}
                selected={selectedTransitionId === transition.id}
              />
            </g>
          );
        })}
        
        {/* Connection in progress */}
        {connectionInProgress && (
          <g>
            <path
              d={`M ${
                getTaskById(tasks, connectionInProgress.sourceId)?.position.x || 0
              } ${
                getTaskById(tasks, connectionInProgress.sourceId)?.position.y || 0
              } L ${connectionInProgress.targetPos.x} ${
                connectionInProgress.targetPos.y
              }`}
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              fill="none"
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default WorkflowCanvas;
