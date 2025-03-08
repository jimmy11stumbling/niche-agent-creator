
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FileOperationSettingsProps {
  parameters: any;
  updateTask: (field: string, value: any) => void;
}

const FileOperationSettings: React.FC<FileOperationSettingsProps> = ({
  parameters,
  updateTask,
}) => {
  const operation = parameters?.operation || "read";
  const filePath = parameters?.filePath || "";
  const content = parameters?.content || "";

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="file-operation">File Operation</Label>
        <Select
          value={operation}
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
      </div>
      
      <div>
        <Label htmlFor="file-path">File Path</Label>
        <Input
          id="file-path"
          value={filePath}
          onChange={(e) => updateTask("parameters.filePath", e.target.value)}
          placeholder="Path to file"
        />
      </div>
      
      {(operation === "write" || operation === "append") && (
        <div>
          <Label htmlFor="file-content">Content</Label>
          <Input
            id="file-content"
            value={content}
            onChange={(e) => updateTask("parameters.content", e.target.value)}
            placeholder="Content to write"
          />
        </div>
      )}
    </div>
  );
};

export default FileOperationSettings;
