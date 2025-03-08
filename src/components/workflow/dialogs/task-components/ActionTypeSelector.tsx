
import React from "react";
import { ActionType } from "@/types/workflow";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ActionTypeSelectorProps {
  value: ActionType;
  onChange: (value: ActionType) => void;
}

const ActionTypeSelector: React.FC<ActionTypeSelectorProps> = ({
  value,
  onChange,
}) => {
  return (
    <div>
      <Label htmlFor="action-type">Action Type</Label>
      <Select
        value={value || "HTTP"}
        onValueChange={(value) => onChange(value as ActionType)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select action type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="HTTP">HTTP Request</SelectItem>
          <SelectItem value="HttpRequest">HTTP Request (Legacy)</SelectItem>
          <SelectItem value="DatabaseOperation">Database Operation</SelectItem>
          <SelectItem value="MessageQueue">Message Queue</SelectItem>
          <SelectItem value="Email">Email</SelectItem>
          <SelectItem value="Notification">Notification</SelectItem>
          <SelectItem value="ScriptExecution">Script Execution</SelectItem>
          <SelectItem value="DataProcessing">Data Processing</SelectItem>
          <SelectItem value="WebCrawling">Web Crawling</SelectItem>
          <SelectItem value="AICompletion">AI Completion</SelectItem>
          <SelectItem value="FileOperation">File Operation</SelectItem>
          <SelectItem value="DummyAction">Dummy Action (Testing)</SelectItem>
          <SelectItem value="Custom">Custom Action</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ActionTypeSelector;
