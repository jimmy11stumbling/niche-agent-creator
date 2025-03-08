
import React from "react";
import { Task, ActionType, DataTransformation } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

// Import the refactored components
import ActionTypeSelector from "./task-components/ActionTypeSelector";
import HttpRequestSettings from "./task-components/HttpRequestSettings";
import ScriptExecutionSettings from "./task-components/ScriptExecutionSettings";
import DataProcessingSettings from "./task-components/DataProcessingSettings";
import ConditionSettings from "./task-components/ConditionSettings";
import TriggerSettings from "./task-components/TriggerSettings";
import WebCrawlingSettings from "./task-components/WebCrawlingSettings";
import AICompletionSettings from "./task-components/AICompletionSettings";

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

  // Helper function to get nested values safely
  const getTaskParameter = (path: string, defaultValue: any = "") => {
    if (!task.parameters) return defaultValue;
    
    const keys = path.split(".");
    let value = task.parameters;
    
    for (const key of keys) {
      if (value === undefined || value === null) return defaultValue;
      value = value[key];
    }
    
    return value !== undefined ? value : defaultValue;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Modify the properties of the selected task
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="py-2 space-y-4">
          <div>
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={task.name}
              onChange={(e) => updateTask("name", e.target.value)}
              required
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
            <ActionTypeSelector 
              value={task.actionType as ActionType || "HTTP"} 
              onChange={(value) => updateTask("actionType", value)} 
            />
          )}
          
          {/* Condition-specific UI */}
          {task.type === "Condition" && (
            <ConditionSettings 
              conditionLogic={task.conditionLogic || ""} 
              onConditionLogicChange={(value) => updateTask("conditionLogic", value)} 
            />
          )}
          
          {/* HTTP Request parameters */}
          {task.type === "Action" &&
            (task.actionType === "HTTP" || task.actionType === "HttpRequest") && (
              <HttpRequestSettings 
                url={getTaskParameter("url")}
                method={getTaskParameter("method", "GET")}
                onUrlChange={(value) => updateTask("parameters.url", value)}
                onMethodChange={(value) => updateTask("parameters.method", value)}
              />
            )}
          
          {/* Script Execution parameters */}
          {task.type === "Action" &&
            task.actionType === "ScriptExecution" && (
              <ScriptExecutionSettings 
                script={getTaskParameter("script")}
                onScriptChange={(value) => updateTask("parameters.script", value)}
              />
            )}
          
          {/* Data Processing parameters */}
          {task.type === "Action" &&
            task.actionType === "DataProcessing" && (
              <DataProcessingSettings 
                dataSource={getTaskParameter("dataSource", "csv")}
                dataPath={getTaskParameter("dataPath")}
                outputFormat={getTaskParameter("outputFormat", "json")}
                validation={getTaskParameter("validation", false)}
                validationRules={getTaskParameter("validationRules", "")}
                transformations={getTaskParameter("transformations", [])}
                onDataSourceChange={(value) => updateTask("parameters.dataSource", value)}
                onDataPathChange={(value) => updateTask("parameters.dataPath", value)}
                onOutputFormatChange={(value) => updateTask("parameters.outputFormat", value)}
                onValidationChange={(checked) => updateTask("parameters.validation", checked)}
                onValidationRulesChange={(value) => updateTask("parameters.validationRules", value)}
                onTransformationsChange={(transforms) => updateTask("parameters.transformations", transforms)}
              />
            )}
          
          {/* Web Crawling parameters */}
          {task.type === "Action" &&
            task.actionType === "WebCrawling" && (
              <WebCrawlingSettings 
                url={getTaskParameter("url", "https://example.com")}
                depth={getTaskParameter("depth", 2)}
                followLinks={getTaskParameter("followLinks", false)}
                maxPages={getTaskParameter("maxPages", 10)}
                excludePatterns={getTaskParameter("excludePatterns", "")}
                outputFormat={getTaskParameter("outputFormat", "json")}
                extractRules={getTaskParameter("extractRules", "")}
                onUrlChange={(value) => updateTask("parameters.url", value)}
                onDepthChange={(value) => updateTask("parameters.depth", value)}
                onFollowLinksChange={(value) => updateTask("parameters.followLinks", value)}
                onMaxPagesChange={(value) => updateTask("parameters.maxPages", value)}
                onExcludePatternsChange={(value) => updateTask("parameters.excludePatterns", value)}
                onOutputFormatChange={(value) => updateTask("parameters.outputFormat", value)}
                onExtractRulesChange={(value) => updateTask("parameters.extractRules", value)}
              />
            )}
            
          {/* AI Completion parameters */}
          {task.type === "Action" &&
            task.actionType === "AICompletion" && (
              <AICompletionSettings 
                model={getTaskParameter("model", "gpt-4-turbo")}
                prompt={getTaskParameter("prompt", "")}
                temperature={getTaskParameter("temperature", 0.7)}
                maxTokens={getTaskParameter("maxTokens", 1000)}
                topP={getTaskParameter("topP", 1)}
                frequencyPenalty={getTaskParameter("frequencyPenalty", 0)}
                presencePenalty={getTaskParameter("presencePenalty", 0)}
                onModelChange={(value) => updateTask("parameters.model", value)}
                onPromptChange={(value) => updateTask("parameters.prompt", value)}
                onTemperatureChange={(value) => updateTask("parameters.temperature", value)}
                onMaxTokensChange={(value) => updateTask("parameters.maxTokens", value)}
                onTopPChange={(value) => updateTask("parameters.topP", value)}
                onFrequencyPenaltyChange={(value) => updateTask("parameters.frequencyPenalty", value)}
                onPresencePenaltyChange={(value) => updateTask("parameters.presencePenalty", value)}
              />
            )}
          
          {/* File Operation parameters */}
          {task.type === "Action" &&
            task.actionType === "FileOperation" && (
              <div className="space-y-2">
                <Label htmlFor="file-operation">File Operation</Label>
                <Select
                  value={getTaskParameter("operation", "read")}
                  onValueChange={(value) => updateTask("parameters.operation", value)}
                >
                  <SelectTrigger id="file-operation">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="write">Write</SelectItem>
                    <SelectItem value="append">Append</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
                
                <Label htmlFor="file-path">File Path</Label>
                <Input
                  id="file-path"
                  value={getTaskParameter("filePath", "")}
                  onChange={(e) => updateTask("parameters.filePath", e.target.value)}
                  placeholder="Path to file"
                />
                
                {(getTaskParameter("operation") === "write" || 
                  getTaskParameter("operation") === "append") && (
                  <>
                    <Label htmlFor="file-content">Content</Label>
                    <Input
                      id="file-content"
                      value={getTaskParameter("content", "")}
                      onChange={(e) => updateTask("parameters.content", e.target.value)}
                      placeholder="Content to write"
                    />
                  </>
                )}
              </div>
            )}
          
          {/* Trigger parameters */}
          {task.type === "Trigger" && (
            <TriggerSettings 
              schedule={getTaskParameter("schedule")}
              onScheduleChange={(value) => updateTask("parameters.schedule", value)}
            />
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskDialog;
