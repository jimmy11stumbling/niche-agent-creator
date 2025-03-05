
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ConditionSettingsProps {
  conditionLogic: string;
  onConditionLogicChange: (value: string) => void;
}

const ConditionSettings: React.FC<ConditionSettingsProps> = ({
  conditionLogic,
  onConditionLogicChange,
}) => {
  return (
    <div>
      <Label htmlFor="condition-logic">Condition Logic</Label>
      <Textarea
        id="condition-logic"
        value={conditionLogic || ""}
        onChange={(e) => onConditionLogicChange(e.target.value)}
        placeholder="JavaScript expression, e.g., data.value > 10"
      />
    </div>
  );
};

export default ConditionSettings;
