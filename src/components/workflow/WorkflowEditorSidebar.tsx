
import React from "react";
import { Task, Transition, Workflow } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Settings, Trash2, ArrowRight
} from "lucide-react";
import { getTaskById } from "./utils";

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
    const task = getTaskById(workflow.tasks, selectedTaskId);
    if (!task) return null;
    
    return (
      <div className="p-4 border-l border-border h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Task Properties</h3>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditTask}
              className="mr-2"
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteTask}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="font-medium">ID</Label>
            <Input value={task.id} readOnly className="mt-1 bg-muted" />
          </div>
          
          <div>
            <Label className="font-medium">Name</Label>
            <Input value={task.name} readOnly className="mt-1 bg-muted" />
          </div>
          
          <div>
            <Label className="font-medium">Type</Label>
            <Input value={task.type} readOnly className="mt-1 bg-muted" />
          </div>
          
          {task.type === "Action" && (
            <div>
              <Label className="font-medium">Action Type</Label>
              <Input
                value={task.actionType}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
          )}
          
          {task.type === "Condition" && task.conditionLogic && (
            <div>
              <Label className="font-medium">Condition Logic</Label>
              <Textarea
                value={task.conditionLogic}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
          )}
          
          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Parameters</h4>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
              {JSON.stringify(task.parameters, null, 2)}
            </pre>
          </div>
          
          <div className="pt-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onStartConnecting(task.id)}
            >
              <ArrowRight className="h-4 w-4 mr-1" />
              Connect to Another Task
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (selectedTransitionId) {
    const transition = workflow.transitions.find(
      (t) => t.id === selectedTransitionId
    );
    if (!transition) return null;
    
    const sourceTask = getTaskById(workflow.tasks, transition.sourceTaskId);
    const targetTask = getTaskById(workflow.tasks, transition.targetTaskId);
    
    return (
      <div className="p-4 border-l border-border h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Transition Properties</h3>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={onEditTransition}
              className="mr-2"
            >
              <Settings className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDeleteTransition}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label className="font-medium">ID</Label>
            <Input
              value={transition.id}
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
          
          <div>
            <Label className="font-medium">Source Task</Label>
            <Input
              value={sourceTask ? sourceTask.name : "Unknown"}
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
          
          <div>
            <Label className="font-medium">Target Task</Label>
            <Input
              value={targetTask ? targetTask.name : "Unknown"}
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
          
          <div>
            <Label className="font-medium">Condition</Label>
            <Textarea
              value={transition.condition || "No condition (always execute)"}
              readOnly
              className="mt-1 bg-muted"
            />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 border-l border-border h-full overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Workflow Designer</h3>
      
      <p className="text-muted-foreground mb-4">
        Select a task or transition to view and edit its properties.
      </p>
      
      <div className="space-y-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Trigger")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Action")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Condition")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("SubWorkflow")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sub-Workflow
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium">Workflow Properties</h4>
        
        <div>
          <Label>Name</Label>
          <Input
            value={workflow.name}
            onChange={(e) => onWorkflowChange("name", e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>Description</Label>
          <Textarea
            value={workflow.description}
            onChange={(e) => onWorkflowChange("description", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowEditorSidebar;
