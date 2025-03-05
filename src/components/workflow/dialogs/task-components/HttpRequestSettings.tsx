
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HttpRequestSettingsProps {
  url: string;
  method: string;
  onUrlChange: (url: string) => void;
  onMethodChange: (method: string) => void;
}

const HttpRequestSettings: React.FC<HttpRequestSettingsProps> = ({
  url,
  method,
  onUrlChange,
  onMethodChange,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="http-url">URL</Label>
        <Input
          id="http-url"
          value={url || ""}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://api.example.com/endpoint"
        />
      </div>
      
      <div>
        <Label htmlFor="http-method">Method</Label>
        <Select
          value={method || "GET"}
          onValueChange={(value) => onMethodChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default HttpRequestSettings;
