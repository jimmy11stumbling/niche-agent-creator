
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTION_TYPES } from "@/components/workflow/constants";
import HttpRequestSettings from "./HttpRequestSettings";
import DataProcessingSettings from "./DataProcessingSettings";
import ScriptExecutionSettings from "./ScriptExecutionSettings";
import WebCrawlingSettings from "./WebCrawlingSettings";
import AICompletionSettings from "./AICompletionSettings";
import FileOperationSettings from "./FileOperationSettings";

interface ActionTypeSelectorProps {
  task: any;
  updateTask: (field: string, value: any) => void;
}

const ActionTypeSelector: React.FC<ActionTypeSelectorProps> = ({
  task,
  updateTask,
}) => {
  useEffect(() => {
    // Ensure task has an actionType when first rendered
    if (!task.actionType && task.type === "Action") {
      updateTask("actionType", "HTTP");
    }
  }, [task, updateTask]);

  const renderActionSettings = () => {
    if (!task.actionType) return null;

    switch (task.actionType) {
      case "HTTP":
      case "HttpRequest":
        return (
          <HttpRequestSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      case "DataProcessing":
        return (
          <DataProcessingSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      case "ScriptExecution":
        return (
          <ScriptExecutionSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      case "WebCrawling":
        return (
          <WebCrawlingSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      case "AICompletion":
        return (
          <AICompletionSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      case "FileOperation":
        return (
          <FileOperationSettings
            parameters={task.parameters}
            updateTask={updateTask}
          />
        );
      default:
        return (
          <div className="text-sm text-muted-foreground p-4 bg-secondary/50 rounded-md">
            <p>Configure {task.actionType} parameters in the JSON editor below.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Action Type</label>
        <Select
          value={task.actionType || "HTTP"}
          onValueChange={(value) => updateTask("actionType", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {renderActionSettings()}
    </div>
  );
};

export default ActionTypeSelector;
