
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TriggerSettingsProps {
  schedule: string;
  onScheduleChange: (value: string) => void;
}

const TriggerSettings: React.FC<TriggerSettingsProps> = ({
  schedule,
  onScheduleChange,
}) => {
  return (
    <div>
      <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
      <Input
        id="schedule"
        value={schedule || ""}
        onChange={(e) => onScheduleChange(e.target.value)}
        placeholder="0 0 * * *"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Format: minute hour day-of-month month day-of-week
      </p>
    </div>
  );
};

export default TriggerSettings;
