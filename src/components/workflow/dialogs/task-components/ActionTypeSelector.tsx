
import React from "react";
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
  const renderActionSettings = () => {
    if (!task.actionType) return null;

    switch (task.actionType) {
      case "HTTP":
      case "HttpRequest":
        return (
          <HttpRequestSettings
            url={task.parameters?.url || ""}
            method={task.parameters?.method || "GET"}
            onUrlChange={(value) => updateTask("parameters.url", value)}
            onMethodChange={(value) => updateTask("parameters.method", value)}
          />
        );
      case "DataProcessing":
        return (
          <DataProcessingSettings
            dataSource={task.parameters?.dataSource || "csv"}
            dataPath={task.parameters?.dataPath || ""}
            outputFormat={task.parameters?.outputFormat || "json"}
            validation={task.parameters?.validation || false}
            validationRules={task.parameters?.validationRules || ""}
            transformations={task.parameters?.transformations || []}
            onDataSourceChange={(value) => updateTask("parameters.dataSource", value)}
            onDataPathChange={(value) => updateTask("parameters.dataPath", value)}
            onOutputFormatChange={(value) => updateTask("parameters.outputFormat", value)}
            onValidationChange={(checked) => updateTask("parameters.validation", checked)}
            onValidationRulesChange={(value) => updateTask("parameters.validationRules", value)}
            onTransformationsChange={(transforms) => updateTask("parameters.transformations", transforms)}
          />
        );
      case "ScriptExecution":
        return (
          <ScriptExecutionSettings
            script={task.parameters?.script || ""}
            onScriptChange={(value) => updateTask("parameters.script", value)}
          />
        );
      case "WebCrawling":
        return (
          <WebCrawlingSettings
            url={task.parameters?.url || "https://example.com"}
            depth={task.parameters?.depth || 2}
            followLinks={task.parameters?.followLinks || false}
            maxPages={task.parameters?.maxPages || 10}
            excludePatterns={task.parameters?.excludePatterns || ""}
            outputFormat={task.parameters?.outputFormat || "json"}
            extractRules={task.parameters?.extractRules || ""}
            onUrlChange={(value) => updateTask("parameters.url", value)}
            onDepthChange={(value) => updateTask("parameters.depth", value)}
            onFollowLinksChange={(value) => updateTask("parameters.followLinks", value)}
            onMaxPagesChange={(value) => updateTask("parameters.maxPages", value)}
            onExcludePatternsChange={(value) => updateTask("parameters.excludePatterns", value)}
            onOutputFormatChange={(value) => updateTask("parameters.outputFormat", value)}
            onExtractRulesChange={(value) => updateTask("parameters.extractRules", value)}
          />
        );
      case "AICompletion":
        return (
          <AICompletionSettings
            model={task.parameters?.model || "gpt-4-turbo"}
            prompt={task.parameters?.prompt || ""}
            temperature={task.parameters?.temperature || 0.7}
            maxTokens={task.parameters?.maxTokens || 1000}
            topP={task.parameters?.topP || 1}
            frequencyPenalty={task.parameters?.frequencyPenalty || 0}
            presencePenalty={task.parameters?.presencePenalty || 0}
            onModelChange={(value) => updateTask("parameters.model", value)}
            onPromptChange={(value) => updateTask("parameters.prompt", value)}
            onTemperatureChange={(value) => updateTask("parameters.temperature", value)}
            onMaxTokensChange={(value) => updateTask("parameters.maxTokens", value)}
            onTopPChange={(value) => updateTask("parameters.topP", value)}
            onFrequencyPenaltyChange={(value) => updateTask("parameters.frequencyPenalty", value)}
            onPresencePenaltyChange={(value) => updateTask("parameters.presencePenalty", value)}
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
