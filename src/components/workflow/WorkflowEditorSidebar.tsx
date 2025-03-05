
import React from "react";
import { Task, Transition, Workflow } from "@/types/workflow";
import TaskProperties from "./sidebar/TaskProperties";
import TransitionProperties from "./sidebar/TransitionProperties";
import WorkflowControls from "./sidebar/WorkflowControls";

interface WorkflowEditorSidebarProps {
  workflow: Workflow;
  selectedTaskId: string | null;
  selectedTransitionId: string | null;
  onAddTask: (type: string) => void;
  onEditTask: () => void;
  onDeleteTask: () => void;
  onEditTransition: () => void;
  onDeleteTransition: () => void;
  onStartConnecting: (sourceId: string) => void;
  onWorkflowChange: (field: string, value: string) => void;
}

const WorkflowEditorSidebar: React.FC<WorkflowEditorSidebarProps> = ({
  workflow,
  selectedTaskId,
  selectedTransitionId,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onEditTransition,
  onDeleteTransition,
  onStartConnecting,
  onWorkflowChange,
}) => {
  if (selectedTaskId) {
    const task = workflow.tasks.find(t => t.id === selectedTaskId);
    if (!task) return null;
    
    return (
      <TaskProperties
        task={task}
        onEdit={onEditTask}
        onDelete={onDeleteTask}
        onStartConnecting={onStartConnecting}
      />
    );
  }
  
  if (selectedTransitionId) {
    const transition = workflow.transitions.find(t => t.id === selectedTransitionId);
    if (!transition) return null;
    
    return (
      <TransitionProperties
        transition={transition}
        tasks={workflow.tasks}
        onEdit={onEditTransition}
        onDelete={onDeleteTransition}
      />
    );
  }
  
  return (
    <WorkflowControls
      workflow={workflow}
      onAddTask={onAddTask}
      onWorkflowChange={onWorkflowChange}
    />
  );
};

export default WorkflowEditorSidebar;
