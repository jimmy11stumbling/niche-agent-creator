
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, X, Move, Database, Table, FileJson, FileText, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface DataProcessingSettingsProps {
  dataSource: string;
  dataPath: string;
  transformations: Array<{type: string; config: any}>;
  outputFormat: string;
  validation: boolean;
  validationRules: string;
  onDataSourceChange: (value: string) => void;
  onDataPathChange: (value: string) => void;
  onTransformationsChange: (value: Array<{type: string; config: any}>) => void;
  onOutputFormatChange: (value: string) => void;
  onValidationChange: (value: boolean) => void;
  onValidationRulesChange: (value: string) => void;
}

const TRANSFORMATION_TYPES = {
  normalize: {
    name: "Normalize",
    description: "Scale numeric values to a standard range",
    icon: <Move className="h-4 w-4" />,
    configFields: [
      { name: "range", label: "Range", type: "select", options: ["0-1", "-1-1", "custom"] },
      { name: "columns", label: "Columns (comma-separated)", type: "text" }
    ]
  },
  filter: {
    name: "Filter",
    description: "Remove rows based on conditions",
    icon: <X className="h-4 w-4" />,
    configFields: [
      { name: "condition", label: "Condition", type: "text" },
      { name: "column", label: "Column", type: "text" }
    ]
  },
  join: {
    name: "Join",
    description: "Combine data from multiple sources",
    icon: <Database className="h-4 w-4" />,
    configFields: [
      { name: "secondarySource", label: "Secondary Data Source", type: "text" },
      { name: "joinKey", label: "Join Key", type: "text" },
      { name: "joinType", label: "Join Type", type: "select", options: ["inner", "left", "right", "full"] }
    ]
  },
  aggregate: {
    name: "Aggregate",
    description: "Perform calculations on groups of data",
    icon: <Table className="h-4 w-4" />,
    configFields: [
      { name: "groupBy", label: "Group By Columns", type: "text" },
      { name: "aggregations", label: "Aggregations", type: "text" }
    ]
  },
  transform: {
    name: "Transform",
    description: "Apply custom transformations to columns",
    icon: <Code className="h-4 w-4" />,
    configFields: [
      { name: "column", label: "Column", type: "text" },
      { name: "formula", label: "Formula", type: "text" }
    ]
  }
};

const DataProcessingSettings: React.FC<DataProcessingSettingsProps> = ({
  dataSource,
  dataPath,
  transformations,
  outputFormat,
  validation,
  validationRules,
  onDataSourceChange,
  onDataPathChange,
  onTransformationsChange,
  onOutputFormatChange,
  onValidationChange,
  onValidationRulesChange
}) => {
  const [activeTab, setActiveTab] = useState("source");
  const [newTransformationType, setNewTransformationType] = useState("normalize");

  const addTransformation = () => {
    const newTransformation = {
      type: newTransformationType,
      config: {}
    };
    
    // Initialize default config values based on transformation type
    TRANSFORMATION_TYPES[newTransformationType].configFields.forEach(field => {
      if (field.type === "select" && field.options?.length > 0) {
        newTransformation.config[field.name] = field.options[0];
      } else {
        newTransformation.config[field.name] = "";
      }
    });
    
    onTransformationsChange([...transformations, newTransformation]);
  };

  const removeTransformation = (index: number) => {
    const updatedTransformations = [...transformations];
    updatedTransformations.splice(index, 1);
    onTransformationsChange(updatedTransformations);
  };

  const updateTransformationConfig = (index: number, configKey: string, value: any) => {
    const updatedTransformations = [...transformations];
    updatedTransformations[index].config[configKey] = value;
    onTransformationsChange(updatedTransformations);
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="source">
            <FileText className="mr-2 h-4 w-4" />
            Data Source
          </TabsTrigger>
          <TabsTrigger value="transform">
            <Code className="mr-2 h-4 w-4" />
            Transformations
          </TabsTrigger>
          <TabsTrigger value="output">
            <FileJson className="mr-2 h-4 w-4" />
            Output
          </TabsTrigger>
        </TabsList>
      
        <TabsContent value="source" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dataSource">Data Source Type</Label>
            <Select
              value={dataSource}
              onValueChange={onDataSourceChange}
            >
              <SelectTrigger id="dataSource">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV File</SelectItem>
                <SelectItem value="json">JSON File</SelectItem>
                <SelectItem value="database">Database Query</SelectItem>
                <SelectItem value="api">API Endpoint</SelectItem>
                <SelectItem value="workflow">Workflow Input</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dataPath">
              {dataSource === "csv" || dataSource === "json" ? "File Path" : 
               dataSource === "database" ? "Query" :
               dataSource === "api" ? "API URL" : "Input Variable"}
            </Label>
            {dataSource === "database" ? (
              <Textarea
                id="dataPath"
                value={dataPath}
                onChange={(e) => onDataPathChange(e.target.value)}
                placeholder={dataSource === "database" ? "SELECT * FROM table WHERE condition" : ""}
                className="min-h-[80px]"
              />
            ) : (
              <Input
                id="dataPath"
                value={dataPath}
                onChange={(e) => onDataPathChange(e.target.value)}
                placeholder={
                  dataSource === "csv" ? "/path/to/data.csv" : 
                  dataSource === "json" ? "/path/to/data.json" :
                  dataSource === "api" ? "https://api.example.com/data" : "inputVariable"
                }
              />
            )}
            <p className="text-xs text-muted-foreground">
              {dataSource === "csv" || dataSource === "json" ? "Path to the data file" : 
               dataSource === "database" ? "SQL query to retrieve data" :
               dataSource === "api" ? "URL of the API endpoint" : "Name of the workflow input variable"}
            </p>
          </div>
          
          {dataSource === "api" && (
            <div className="space-y-2">
              <Label htmlFor="apiMethod">HTTP Method</Label>
              <Select defaultValue="GET">
                <SelectTrigger id="apiMethod">
                  <SelectValue placeholder="Select HTTP method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="transform" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Select
              value={newTransformationType}
              onValueChange={setNewTransformationType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSFORMATION_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center">
                      {value.icon}
                      <span className="ml-2">{value.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addTransformation} size="sm">
              <Plus className="mr-1 h-4 w-4" />
              Add Transformation
            </Button>
          </div>
          
          {transformations.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-md">
              <p className="text-muted-foreground">
                No transformations added yet. Add a transformation to process your data.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transformations.map((transformation, index) => {
                const transformationType = TRANSFORMATION_TYPES[transformation.type];
                
                return (
                  <div key={index} className="border rounded-md p-3 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {transformationType.icon}
                        <span className="ml-2 font-medium">{transformationType.name}</span>
                        <Badge className="ml-2 text-xs" variant="outline">
                          Step {index + 1}
                        </Badge>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeTransformation(index)}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {transformationType.description}
                    </p>
                    
                    <div className="space-y-2">
                      {transformationType.configFields.map((field) => (
                        <div key={field.name} className="space-y-1">
                          <Label htmlFor={`${index}-${field.name}`} className="text-xs">
                            {field.label}
                          </Label>
                          
                          {field.type === "select" ? (
                            <Select
                              value={transformation.config[field.name] || field.options[0]}
                              onValueChange={(value) => updateTransformationConfig(index, field.name, value)}
                            >
                              <SelectTrigger id={`${index}-${field.name}`}>
                                <SelectValue placeholder={`Select ${field.label}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              id={`${index}-${field.name}`}
                              value={transformation.config[field.name] || ""}
                              onChange={(e) => updateTransformationConfig(index, field.name, e.target.value)}
                              placeholder={`Enter ${field.label.toLowerCase()}`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="output" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="outputFormat">Output Format</Label>
            <Select
              value={outputFormat}
              onValueChange={onOutputFormatChange}
            >
              <SelectTrigger id="outputFormat">
                <SelectValue placeholder="Select output format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="table">Table</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="validation"
              checked={validation}
              onCheckedChange={onValidationChange}
            />
            <Label htmlFor="validation">Enable Data Validation</Label>
          </div>
          
          {validation && (
            <div className="space-y-2">
              <Label htmlFor="validationRules">Validation Rules</Label>
              <Textarea
                id="validationRules"
                value={validationRules}
                onChange={(e) => onValidationRulesChange(e.target.value)}
                placeholder="Enter validation rules in JSON format"
                className="min-h-[100px]"
              />
              <p className="text-xs text-muted-foreground">
                Define rules to validate your data before processing. Use JSON format to specify constraints.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataProcessingSettings;
