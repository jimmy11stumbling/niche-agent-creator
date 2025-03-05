
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTransformation } from "@/types/workflow";

interface DataProcessingSettingsProps {
  dataSource: string;
  dataPath: string;
  outputFormat: string;
  validation: boolean;
  validationRules: string;
  transformations: DataTransformation[];
  onDataSourceChange: (value: string) => void;
  onDataPathChange: (value: string) => void;
  onOutputFormatChange: (value: string) => void;
  onValidationChange: (checked: boolean) => void;
  onValidationRulesChange: (value: string) => void;
  onTransformationsChange: (transforms: DataTransformation[]) => void;
}

const DataProcessingSettings: React.FC<DataProcessingSettingsProps> = ({
  dataSource,
  dataPath,
  outputFormat,
  validation,
  validationRules,
  transformations,
  onDataSourceChange,
  onDataPathChange,
  onOutputFormatChange,
  onValidationChange,
  onValidationRulesChange,
  onTransformationsChange,
}) => {
  return (
    <>
      <div>
        <Label htmlFor="data-source">Data Source</Label>
        <Select
          value={dataSource || "csv"}
          onValueChange={onDataSourceChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select data source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">CSV File</SelectItem>
            <SelectItem value="json">JSON File</SelectItem>
            <SelectItem value="xml">XML File</SelectItem>
            <SelectItem value="txt">Text File</SelectItem>
            <SelectItem value="pdf">PDF Document</SelectItem>
            <SelectItem value="api">API Endpoint</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="data-path">Data Path or URL</Label>
        <Input
          id="data-path"
          value={dataPath || ""}
          onChange={(e) => onDataPathChange(e.target.value)}
          placeholder="path/to/data.csv or https://api.example.com/data"
        />
      </div>
      
      <div>
        <Label htmlFor="output-format">Output Format</Label>
        <Select
          value={outputFormat || "json"}
          onValueChange={onOutputFormatChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select output format" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json">JSON</SelectItem>
            <SelectItem value="csv">CSV</SelectItem>
            <SelectItem value="xml">XML</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="enable-validation"
          checked={validation || false}
          onCheckedChange={onValidationChange}
        />
        <Label htmlFor="enable-validation">Enable Validation</Label>
      </div>
      
      {validation && (
        <div>
          <Label htmlFor="validation-rules">Validation Rules</Label>
          <Textarea
            id="validation-rules"
            value={validationRules || ""}
            onChange={(e) => onValidationRulesChange(e.target.value)}
            placeholder="Enter validation rules as JSON"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Example: {"{ \"requiredFields\": [\"name\", \"email\"], \"patterns\": { \"email\": \"^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$\" } }"}
          </p>
        </div>
      )}
      
      <div>
        <Label htmlFor="transformations">Transformations</Label>
        <div className="space-y-2 mt-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="normalize-transform"
              checked={transformations?.some((t) => t.type === "normalize") || false}
              onCheckedChange={(checked) => {
                const currentTransforms = transformations || [];
                const hasNormalize = currentTransforms.some((t) => t.type === "normalize");
                
                let newTransforms;
                if (checked && !hasNormalize) {
                  newTransforms = [...currentTransforms, { type: "normalize" }];
                } else if (!checked && hasNormalize) {
                  newTransforms = currentTransforms.filter((t) => t.type !== "normalize");
                } else {
                  newTransforms = currentTransforms;
                }
                
                onTransformationsChange(newTransforms);
              }}
            />
            <Label htmlFor="normalize-transform">Normalize Text</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="filter-transform"
              checked={transformations?.some((t) => t.type === "filter") || false}
              onCheckedChange={(checked) => {
                const currentTransforms = transformations || [];
                const hasFilter = currentTransforms.some((t) => t.type === "filter");
                
                let newTransforms;
                if (checked && !hasFilter) {
                  newTransforms = [...currentTransforms, { type: "filter" }];
                } else if (!checked && hasFilter) {
                  newTransforms = currentTransforms.filter((t) => t.type !== "filter");
                } else {
                  newTransforms = currentTransforms;
                }
                
                onTransformationsChange(newTransforms);
              }}
            />
            <Label htmlFor="filter-transform">Filter Data</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="augment-transform"
              checked={transformations?.some((t) => t.type === "augment") || false}
              onCheckedChange={(checked) => {
                const currentTransforms = transformations || [];
                const hasAugment = currentTransforms.some((t) => t.type === "augment");
                
                let newTransforms;
                if (checked && !hasAugment) {
                  newTransforms = [...currentTransforms, { type: "augment" }];
                } else if (!checked && hasAugment) {
                  newTransforms = currentTransforms.filter((t) => t.type !== "augment");
                } else {
                  newTransforms = currentTransforms;
                }
                
                onTransformationsChange(newTransforms);
              }}
            />
            <Label htmlFor="augment-transform">Augment Data</Label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataProcessingSettings;
