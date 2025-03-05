
import React from "react";
import { Transition, Task } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Trash2 } from "lucide-react";
import { getTaskById } from "../utils";

interface TransitionPropertiesProps {
  transition: Transition;
  tasks: Task[];
  onEdit: () => void;
  onDelete: () => void;
}

const TransitionProperties: React.FC<TransitionPropertiesProps> = ({
  transition,
  tasks,
  onEdit,
  onDelete,
}) => {
  const sourceTask = getTaskById(tasks, transition.sourceTaskId);
  const targetTask = getTaskById(tasks, transition.targetTaskId);
  
  return (
    <div className="p-4 border-l border-border h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Transition Properties</h3>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="mr-2"
          >
            <Settings className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
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
};

export default TransitionProperties;
