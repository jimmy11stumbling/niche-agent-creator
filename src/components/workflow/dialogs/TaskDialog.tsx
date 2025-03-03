
import React from "react";
import { Task, ActionType } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskDialogProps {
  task: Task | null;
  onSave: () => void;
  onCancel: () => void;
  updateTask: (field: string, value: any) => void;
}

const TaskDialog: React.FC<TaskDialogProps> = ({
  task,
  onSave,
  onCancel,
  updateTask,
}) => {
  if (!task) return null;

  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Modify the properties of the selected task
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          <div>
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={task.name}
              onChange={(e) => updateTask("name", e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="task-type">Task Type</Label>
            <Select
              value={task.type}
              onValueChange={(value) => updateTask("type", value)}
              disabled
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Trigger">Trigger</SelectItem>
                <SelectItem value="Action">Action</SelectItem>
                <SelectItem value="Condition">Condition</SelectItem>
                <SelectItem value="SubWorkflow">SubWorkflow</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Action-specific UI */}
          {task.type === "Action" && (
            <div>
              <Label htmlFor="action-type">Action Type</Label>
              <Select
                value={task.actionType || "HttpRequest"}
                onValueChange={(value) => updateTask("actionType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select action type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HttpRequest">HTTP Request</SelectItem>
                  <SelectItem value="DatabaseOperation">
                    Database Operation
                  </SelectItem>
                  <SelectItem value="MessageQueue">Message Queue</SelectItem>
                  <SelectItem value="ScriptExecution">
                    Script Execution
                  </SelectItem>
                  <SelectItem value="DummyAction">
                    Dummy Action (Testing)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Condition-specific UI */}
          {task.type === "Condition" && (
            <div>
              <Label htmlFor="condition-logic">Condition Logic</Label>
              <Textarea
                id="condition-logic"
                value={task.conditionLogic || ""}
                onChange={(e) => updateTask("conditionLogic", e.target.value)}
                placeholder="JavaScript expression, e.g., data.value > 10"
              />
            </div>
          )}
          
          {/* HTTP Request parameters */}
          {task.type === "Action" &&
            task.actionType === "HttpRequest" && (
              <>
                <div>
                  <Label htmlFor="http-url">URL</Label>
                  <Input
                    id="http-url"
                    value={task.parameters.url || ""}
                    onChange={(e) =>
                      updateTask("parameters.url", e.target.value)
                    }
                    placeholder="https://api.example.com/endpoint"
                  />
                </div>
                
                <div>
                  <Label htmlFor="http-method">Method</Label>
                  <Select
                    value={task.parameters.method || "GET"}
                    onValueChange={(value) =>
                      updateTask("parameters.method", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          
          {/* Script Execution parameters */}
          {task.type === "Action" &&
            task.actionType === "ScriptExecution" && (
              <div>
                <Label htmlFor="script-content">Script Content</Label>
                <Textarea
                  id="script-content"
                  value={task.parameters.script || ""}
                  onChange={(e) =>
                    updateTask("parameters.script", e.target.value)
                  }
                  className="font-mono"
                  placeholder="console.log('Hello, World!');"
                />
              </div>
            )}
          
          {/* Trigger parameters */}
          {task.type === "Trigger" && (
            <div>
              <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
              <Input
                id="schedule"
                value={task.parameters.schedule || ""}
                onChange={(e) =>
                  updateTask("parameters.schedule", e.target.value)
                }
                placeholder="0 0 * * *"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Format: minute hour day-of-month month day-of-week
              </p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
