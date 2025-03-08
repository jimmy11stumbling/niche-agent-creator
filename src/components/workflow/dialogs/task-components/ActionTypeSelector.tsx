
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ACTION_TYPES } from "@/components/workflow/constants";
import { ActionType } from "@/types/workflow";

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
        <SelectTrigger id="action-type">
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
  );
};

export default ActionTypeSelector;
