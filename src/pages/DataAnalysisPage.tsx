
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UploadCloud, FileType, Database, LineChart, Filter, Cpu, Save, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

interface DataItem {
  [key: string]: any;
}

interface ProcessingResult {
  data: DataItem[];
  stats: {
    rowCount: number;
    columnCount: number;
    processedAt: string;
    processingTime: number;
  };
}

const DataAnalysisPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [dataFormat, setDataFormat] = useState("csv");
  const [transformations, setTransformations] = useState<string[]>([]);
  const [customTransformation, setCustomTransformation] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [chartType, setChartType] = useState("bar");
  const [xAxisField, setXAxisField] = useState("");
  const [yAxisField, setYAxisField] = useState("");
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.readAsText(file);
      
      toast({
        title: "File Uploaded",
        description: `Successfully uploaded ${file.name}`,
      });
    }
  };

  const addTransformation = () => {
    if (customTransformation.trim()) {
      setTransformations([...transformations, customTransformation.trim()]);
      setCustomTransformation("");
      
      toast({
        title: "Transformation Added",
        description: "Custom data transformation has been added.",
      });
    }
  };

  const removeTransformation = (index: number) => {
    setTransformations(transformations.filter((_, i) => i !== index));
  };

  const processData = () => {
    if (!fileContent) {
      toast({
        title: "No Data",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }

    // Simulate processing with progress
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          generateProcessingResult();
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const generateProcessingResult = () => {
    // Parse the data based on format
    let parsedData: DataItem[] = [];
    
    try {
      if (dataFormat === "csv") {
        const lines = fileContent.split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        parsedData = lines.slice(1).map(line => {
          const values = line.split(",").map(v => v.trim());
          const rowData: DataItem = {};
          
          headers.forEach((header, index) => {
            const value = values[index];
            // Try to convert to number if possible
            const numValue = Number(value);
            rowData[header] = isNaN(numValue) ? value : numValue;
          });
          
          return rowData;
        }).filter(item => Object.keys(item).length > 0);
      } else if (dataFormat === "json") {
        parsedData = JSON.parse(fileContent);
        if (!Array.isArray(parsedData)) {
          parsedData = [parsedData];
        }
      }
      
      // Apply transformations (in a real app, this would be more sophisticated)
      if (transformations.length > 0) {
        // This is a simplified example - in a real app, you'd evaluate these correctly
        transformations.forEach(transform => {
          try {
            // Simple transformations like "multiply field by 2"
            if (transform.includes("multiply")) {
              const parts = transform.split(" ");
              const field = parts[1];
              const factor = parseFloat(parts[3]);
              
              parsedData = parsedData.map(item => ({
                ...item,
                [field]: typeof item[field] === 'number' ? item[field] * factor : item[field]
              }));
            }
            // Add more transformation types as needed
          } catch (error) {
            console.error("Error applying transformation:", transform, error);
          }
        });
      }
      
      setProcessingResult({
        data: parsedData,
        stats: {
          rowCount: parsedData.length,
          columnCount: parsedData.length > 0 ? Object.keys(parsedData[0]).length : 0,
          processedAt: new Date().toISOString(),
          processingTime: 1.23 // Simulated processing time
        }
      });
      
      // Set default chart fields if available
      if (parsedData.length > 0) {
        const fields = Object.keys(parsedData[0]);
        const numericFields = fields.filter(field => 
          typeof parsedData[0][field] === 'number'
        );
        
        if (fields.length > 0 && !xAxisField) {
          setXAxisField(fields[0]);
        }
        
        if (numericFields.length > 0 && !yAxisField) {
          setYAxisField(numericFields[0]);
        }
      }
      
      // Move to the results tab
      setActiveTab("results");
      
      toast({
        title: "Processing Complete",
        description: `Successfully processed ${parsedData.length} records.`,
      });
    } catch (error) {
      console.error("Error processing data:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the data.",
        variant: "destructive",
      });
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const renderCharts = () => {
    if (!processingResult || processingResult.data.length === 0) {
      return (
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          No data available for visualization.
        </div>
      );
    }

    const data = processingResult.data;

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={yAxisField} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxisField} />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey={yAxisField} stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey={yAxisField}
                nameKey={xAxisField}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Data Analysis & Visualization</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="upload">
              <UploadCloud className="mr-2 h-4 w-4" />
              Data Upload
            </TabsTrigger>
            <TabsTrigger value="processing">
              <Cpu className="mr-2 h-4 w-4" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart2 className="mr-2 h-4 w-4" />
              Results & Visualization
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
                <CardDescription>
                  Upload your data file for analysis. Supported formats: CSV, JSON.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="dataFile">Data File</Label>
                  <div className="flex w-full max-w-sm items-center gap-1.5">
                    <Input id="dataFile" type="file" onChange={handleFileUpload} className="flex-1" accept=".csv,.json" />
                  </div>
                </div>
                
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="dataFormat">Data Format</Label>
                  <Select value={dataFormat} onValueChange={setDataFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {uploadedFile && (
                  <div className="mt-4 p-4 border rounded-md bg-muted/50">
                    <div className="flex items-center gap-2 mb-2">
                      <FileType className="h-5 w-5 text-primary" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {Math.round(uploadedFile.size / 1024)} KB • {uploadedFile.type || "Unknown type"}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("processing")} disabled={!uploadedFile}>
                  Continue to Processing
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="processing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Data Processing</CardTitle>
                <CardDescription>
                  Apply transformations and processing to your data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Custom Transformations</Label>
                    <div className="flex gap-2 mt-1">
                      <Input 
                        value={customTransformation} 
                        onChange={(e) => setCustomTransformation(e.target.value)}
                        placeholder="e.g., multiply price by 2" 
                        className="flex-1"
                      />
                      <Button onClick={addTransformation} variant="outline">
                        Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Example: "multiply price by 2", "filter where quantity > 10"
                    </p>
                  </div>
                  
                  {transformations.length > 0 && (
                    <div className="space-y-2">
                      <Label>Applied Transformations:</Label>
                      <ul className="space-y-1">
                        {transformations.map((transform, index) => (
                          <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                            <div className="flex items-center gap-2">
                              <Filter className="h-4 w-4 text-primary" />
                              <span>{transform}</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeTransformation(index)}
                              className="h-6 w-6 p-0"
                            >
                              ×
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {processingProgress > 0 && processingProgress < 100 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Processing Data...</Label>
                      <span className="text-sm">{processingProgress}%</span>
                    </div>
                    <Progress value={processingProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={processData}>
                  <Cpu className="mr-2 h-4 w-4" />
                  Process Data
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Results & Visualization</CardTitle>
                <CardDescription>
                  View and visualize your processed data.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {processingResult ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">Rows</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 p-4">
                          <p className="text-2xl font-bold">{processingResult.stats.rowCount}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">Columns</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 p-4">
                          <p className="text-2xl font-bold">{processingResult.stats.columnCount}</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg">Processing Time</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 p-4">
                          <p className="text-2xl font-bold">{processingResult.stats.processingTime}s</p>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <Label htmlFor="chartType">Chart Type</Label>
                          <Select value={chartType} onValueChange={setChartType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select chart type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bar">Bar Chart</SelectItem>
                              <SelectItem value="line">Line Chart</SelectItem>
                              <SelectItem value="pie">Pie Chart</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="xAxis">X Axis Field</Label>
                          <Select value={xAxisField} onValueChange={setXAxisField}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select X axis field" />
                            </SelectTrigger>
                            <SelectContent>
                              {processingResult.data.length > 0 && 
                                Object.keys(processingResult.data[0]).map(field => (
                                  <SelectItem key={field} value={field}>{field}</SelectItem>
                                ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="yAxis">Y Axis Field</Label>
                          <Select value={yAxisField} onValueChange={setYAxisField}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Y axis field" />
                            </SelectTrigger>
                            <SelectContent>
                              {processingResult.data.length > 0 && 
                                Object.keys(processingResult.data[0])
                                  .filter(field => typeof processingResult.data[0][field] === 'number')
                                  .map(field => (
                                    <SelectItem key={field} value={field}>{field}</SelectItem>
                                  ))
                              }
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-4">
                        {renderCharts()}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Data Preview (First 5 Rows)</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-border">
                          <thead>
                            <tr>
                              {processingResult.data.length > 0 && 
                                Object.keys(processingResult.data[0]).map(header => (
                                  <th key={header} className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                    {header}
                                  </th>
                                ))
                              }
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {processingResult.data.slice(0, 5).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.values(row).map((value: any, cellIndex) => (
                                  <td key={cellIndex} className="px-4 py-2 text-sm">
                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Database className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No Data Processed Yet</h3>
                    <p className="text-muted-foreground mt-1">
                      Upload a file and process it to see results here.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("upload")}
                    >
                      Go to Upload
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                {processingResult && (
                  <Button variant="outline" onClick={() => setActiveTab("processing")}>
                    Back to Processing
                  </Button>
                )}
                {processingResult && (
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Results
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataAnalysisPage;
