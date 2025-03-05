
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ScriptExecutionSettingsProps {
  script: string;
  onScriptChange: (script: string) => void;
}

const ScriptExecutionSettings: React.FC<ScriptExecutionSettingsProps> = ({
  script,
  onScriptChange,
}) => {
  return (
    <div>
      <Label htmlFor="script-content">Script Content</Label>
      <Textarea
        id="script-content"
        value={script || ""}
        onChange={(e) => onScriptChange(e.target.value)}
        className="font-mono"
        placeholder="console.log('Hello, World!');"
      />
    </div>
  );
};

export default ScriptExecutionSettings;
