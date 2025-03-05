
import React from "react";
import { Task } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Trash2, ArrowRight } from "lucide-react";

interface TaskPropertiesProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onStartConnecting: (sourceId: string) => void;
}

const TaskProperties: React.FC<TaskPropertiesProps> = ({
  task,
  onEdit,
  onDelete,
  onStartConnecting,
}) => {
  return (
    <div className="p-4 border-l border-border h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Task Properties</h3>
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
        
        {task.type === "Action" && task.actionType === "DataProcessing" && (
          <DataProcessingDetails task={task} />
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
};

const DataProcessingDetails: React.FC<{ task: Task }> = ({ task }) => {
  return (
    <div className="pt-2 space-y-2">
      <h4 className="text-sm font-medium">Data Processing Configuration</h4>
      
      <div>
        <Label className="text-xs">Data Source</Label>
        <Input
          value={task.parameters?.dataSource || ""}
          readOnly
          className="mt-1 bg-muted text-xs h-8"
        />
      </div>
      
      <div>
        <Label className="text-xs">Output Format</Label>
        <Input
          value={task.parameters?.outputFormat || ""}
          readOnly
          className="mt-1 bg-muted text-xs h-8"
        />
      </div>
      
      <div>
        <Label className="text-xs">Validation Enabled</Label>
        <Input
          value={task.parameters?.validation ? "Yes" : "No"}
          readOnly
          className="mt-1 bg-muted text-xs h-8"
        />
      </div>
      
      {task.parameters?.transformations && task.parameters.transformations.length > 0 && (
        <div>
          <Label className="text-xs">Transformations</Label>
          <div className="mt-1 p-2 bg-muted rounded text-xs">
            {task.parameters.transformations.map((t: any, i: number) => (
              <div key={i} className="mb-1">
                • {t.type}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskProperties;
