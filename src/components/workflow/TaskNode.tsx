
import { useState, useEffect, useRef } from "react";
import { Task } from "@/types/workflow";
import { ZapIcon, Play, AlertCircle, Copy, Database } from "lucide-react";

interface TaskNodeProps {
  task: Task;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

const TaskNode: React.FC<TaskNodeProps> = ({ task, selected, onSelect, onMove }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Get the background color based on task type
  const getBackgroundColor = () => {
    switch (task.type) {
      case "Trigger":
        return "bg-blue-100 border-blue-300";
      case "Action":
        if (task.actionType === "DataProcessing") {
          return "bg-indigo-100 border-indigo-300";
        }
        return "bg-green-100 border-green-300";
      case "Condition":
        return "bg-amber-100 border-amber-300";
      case "SubWorkflow":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-slate-100 border-slate-300";
    }
  };

  // Get the icon based on task type
  const getIcon = () => {
    switch (task.type) {
      case "Trigger":
        return <ZapIcon className="h-4 w-4 text-blue-600" />;
      case "Action":
        if (task.actionType === "DataProcessing") {
          return <Database className="h-4 w-4 text-indigo-600" />;
        }
        return <Play className="h-4 w-4 text-green-600" />;
      case "Condition":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "SubWorkflow":
        return <Copy className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (nodeRef.current) {
      setDragging(true);
      const rect = nodeRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      onSelect(task.id);
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && nodeRef.current) {
      const canvas = nodeRef.current.parentElement;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - offset.x;
        const newY = e.clientY - canvasRect.top - offset.y;
        
        onMove(task.id, { x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={nodeRef}
      className={`absolute p-3 rounded-lg cursor-grab shadow-sm border ${getBackgroundColor()} ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      style={{
        left: `${task.position.x}px`,
        top: `${task.position.y}px`,
        minWidth: "160px",
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="font-medium text-sm">{task.name}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        {task.type === "Action" && task.actionType ? `${task.actionType} ${task.type}` : task.type}
      </div>
    </div>
  );
};

export default TaskNode;
