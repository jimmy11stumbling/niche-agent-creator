
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface FileOperationSettingsProps {
  parameters: any;
  updateTask: (field: string, value: any) => void;
}

const FileOperationSettings: React.FC<FileOperationSettingsProps> = ({
  parameters,
  updateTask,
}) => {
  const operations = ["read", "write", "append", "delete", "copy", "move"];
  const encodings = ["utf8", "ascii", "base64", "binary", "hex", "utf16le"];

  return (
    <div className="space-y-4">
      <FormItem>
        <FormLabel>Operation</FormLabel>
        <Select
          value={parameters?.operation || "read"}
          onValueChange={(value) => updateTask("parameters.operation", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            {operations.map((op) => (
              <SelectItem key={op} value={op}>
                {op.charAt(0).toUpperCase() + op.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormItem>

      <FormItem>
        <FormLabel>File Path</FormLabel>
        <FormControl>
          <Input
            value={parameters?.filePath || ""}
            onChange={(e) => updateTask("parameters.filePath", e.target.value)}
            placeholder="e.g., /path/to/file.txt"
          />
        </FormControl>
      </FormItem>

      {(parameters?.operation === "write" || parameters?.operation === "append") && (
        <FormItem>
          <FormLabel>Content</FormLabel>
          <FormControl>
            <Textarea
              value={parameters?.content || ""}
              onChange={(e) => updateTask("parameters.content", e.target.value)}
              placeholder="Enter content to write to file"
              className="min-h-[100px]"
            />
          </FormControl>
        </FormItem>
      )}

      {(parameters?.operation === "read" || 
        parameters?.operation === "write" || 
        parameters?.operation === "append") && (
        <FormItem>
          <FormLabel>Encoding</FormLabel>
          <Select
            value={parameters?.encoding || "utf8"}
            onValueChange={(value) => updateTask("parameters.encoding", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select encoding" />
            </SelectTrigger>
            <SelectContent>
              {encodings.map((enc) => (
                <SelectItem key={enc} value={enc}>
                  {enc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}

      {parameters?.operation === "copy" || parameters?.operation === "move" ? (
        <FormItem>
          <FormLabel>Destination Path</FormLabel>
          <FormControl>
            <Input
              value={parameters?.destinationPath || ""}
              onChange={(e) => updateTask("parameters.destinationPath", e.target.value)}
              placeholder="e.g., /path/to/destination.txt"
            />
          </FormControl>
        </FormItem>
      ) : null}
    </div>
  );
};

export default FileOperationSettings;
