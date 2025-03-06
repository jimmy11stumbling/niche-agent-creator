
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
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  // Helper function to check if a transformation exists
  const hasTransformation = (type: string) => {
    return transformations?.some((t) => t.type === type) || false;
  };

  // Helper function to toggle a transformation
  const toggleTransformation = (type: string, checked: boolean) => {
    const currentTransforms = transformations || [];
    const hasTransform = hasTransformation(type);
    
    let newTransforms;
    if (checked && !hasTransform) {
      newTransforms = [...currentTransforms, { type }];
    } else if (!checked && hasTransform) {
      newTransforms = currentTransforms.filter((t) => t.type !== type);
    } else {
      newTransforms = currentTransforms;
    }
    
    onTransformationsChange(newTransforms);
  };

  return (
    <Tabs defaultValue="source" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="source">Data Source</TabsTrigger>
        <TabsTrigger value="transforms">Transformations</TabsTrigger>
        <TabsTrigger value="output">Output & Validation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="source" className="space-y-4">
        <div>
          <Label htmlFor="data-source">Data Source Type</Label>
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
              <SelectItem value="database">Database Query</SelectItem>
              <SelectItem value="s3">S3 Bucket</SelectItem>
              <SelectItem value="gcs">Google Cloud Storage</SelectItem>
              <SelectItem value="azure">Azure Blob Storage</SelectItem>
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
          <p className="text-xs text-muted-foreground mt-1">
            Enter a local file path, URL, or connection string depending on your data source type
          </p>
        </div>
      </TabsContent>
      
      <TabsContent value="transforms" className="space-y-4">
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-2">Basic Transformations</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="normalize-transform"
                  checked={hasTransformation("normalize")}
                  onCheckedChange={(checked) => toggleTransformation("normalize", !!checked)}
                />
                <Label htmlFor="normalize-transform">Normalize Text</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="filter-transform"
                  checked={hasTransformation("filter")}
                  onCheckedChange={(checked) => toggleTransformation("filter", !!checked)}
                />
                <Label htmlFor="filter-transform">Filter Data</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="augment-transform"
                  checked={hasTransformation("augment")}
                  onCheckedChange={(checked) => toggleTransformation("augment", !!checked)}
                />
                <Label htmlFor="augment-transform">Augment Data</Label>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-dashed">
          <CardContent className="pt-4">
            <h3 className="font-medium mb-2">Advanced Transformations</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="aggregate-transform"
                  checked={hasTransformation("aggregate")}
                  onCheckedChange={(checked) => toggleTransformation("aggregate", !!checked)}
                />
                <Label htmlFor="aggregate-transform">Aggregate Data</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="merge-transform"
                  checked={hasTransformation("merge")}
                  onCheckedChange={(checked) => toggleTransformation("merge", !!checked)}
                />
                <Label htmlFor="merge-transform">Merge Datasets</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="deduplicate-transform"
                  checked={hasTransformation("deduplicate")}
                  onCheckedChange={(checked) => toggleTransformation("deduplicate", !!checked)}
                />
                <Label htmlFor="deduplicate-transform">Remove Duplicates</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="sort-transform"
                  checked={hasTransformation("sort")}
                  onCheckedChange={(checked) => toggleTransformation("sort", !!checked)}
                />
                <Label htmlFor="sort-transform">Sort Data</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="nlp-transform"
                  checked={hasTransformation("nlp")}
                  onCheckedChange={(checked) => toggleTransformation("nlp", !!checked)}
                />
                <Label htmlFor="nlp-transform">NLP Processing</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="output" className="space-y-4">
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
              <SelectItem value="parquet">Parquet</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
              <SelectItem value="sqlite">SQLite Database</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="html">HTML</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="enable-validation"
            checked={validation || false}
            onCheckedChange={onValidationChange}
          />
          <Label htmlFor="enable-validation">Enable Data Validation</Label>
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
              rows={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Example: {"{ \"requiredFields\": [\"name\", \"email\"], \"patterns\": { \"email\": \"^[\\\\w-\\\\.]+@([\\\\w-]+\\\\.)+[\\\\w-]{2,4}$\" } }"}
            </p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DataProcessingSettings;
