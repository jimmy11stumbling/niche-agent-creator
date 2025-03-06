
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, BarChart3, Code, Settings, Zap, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DataAnalysisPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dataSource, setDataSource] = useState("csv");
  const [processingOptions, setProcessingOptions] = useState({
    normalize: true,
    removeOutliers: false,
    fillMissingValues: true,
    convertTypes: true
  });
  const [visualizationType, setVisualizationType] = useState("bar");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any>(null);
  const [transformationCode, setTransformationCode] = useState(
    "// Example transformation code\nfunction transform(data) {\n  // Normalize numeric values\n  if (data.length > 0) {\n    const numericColumns = Object.keys(data[0]).filter(key => \n      typeof data[0][key] === 'number'\n    );\n    \n    numericColumns.forEach(column => {\n      const values = data.map(row => row[column]);\n      const min = Math.min(...values);\n      const max = Math.max(...values);\n      \n      data.forEach(row => {\n        row[column] = (row[column] - min) / (max - min);\n      });\n    });\n  }\n  \n  return data;\n}"
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFile(file);
      
      toast({
        title: "File Uploaded",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      // Automatically move to the next tab
      setActiveTab("process");
    }
  };

  const handleProcessData = () => {
    if (!uploadedFile) {
      toast({
        title: "No File",
        description: "Please upload a file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock processed data for demo
      const mockProcessedData = {
        columns: ["Category", "Value", "Growth"],
        rows: [
          { Category: "Product A", Value: 1200, Growth: 0.12 },
          { Category: "Product B", Value: 1800, Growth: 0.24 },
          { Category: "Product C", Value: 800, Growth: -0.05 },
          { Category: "Product D", Value: 1500, Growth: 0.18 },
          { Category: "Product E", Value: 950, Growth: 0.08 },
        ],
        summary: {
          total: 6250,
          average: 1250,
          min: 800,
          max: 1800,
          outliers: 0
        }
      };
      
      setProcessedData(mockProcessedData);
      setIsProcessing(false);
      
      toast({
        title: "Processing Complete",
        description: "Data has been processed successfully.",
      });
      
      // Move to visualization tab
      setActiveTab("visualize");
    }, 2000);
  };

  const handleDownloadResults = () => {
    if (!processedData) return;
    
    // Convert processed data to JSON string
    const dataStr = JSON.stringify(processedData, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    // Create download link and trigger click
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataUri);
    downloadLink.setAttribute("download", "processed_data.json");
    downloadLink.click();
    
    toast({
      title: "Download Started",
      description: "Your processed data is being downloaded.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Data Analysis</h1>
            <p className="text-muted-foreground">
              Upload, process, and visualize your data with AI-powered analytics
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
              <TabsTrigger value="upload">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload
              </TabsTrigger>
              <TabsTrigger value="process">
                <Settings className="mr-2 h-4 w-4" />
                Process
              </TabsTrigger>
              <TabsTrigger value="transform">
                <Code className="mr-2 h-4 w-4" />
                Transform
              </TabsTrigger>
              <TabsTrigger value="visualize">
                <BarChart3 className="mr-2 h-4 w-4" />
                Visualize
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Data</CardTitle>
                  <CardDescription>
                    Upload your data files for analysis
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="dataSource">Data Source</Label>
                    <Select
                      value={dataSource}
                      onValueChange={setDataSource}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select data source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV File</SelectItem>
                        <SelectItem value="json">JSON File</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="api">API Endpoint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {dataSource === "api" ? (
                    <div className="space-y-2">
                      <Label htmlFor="apiUrl">API URL</Label>
                      <Input id="apiUrl" placeholder="https://api.example.com/data" />
                      <p className="text-xs text-muted-foreground">
                        Enter the URL of the API endpoint to fetch data
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid w-full h-32 place-items-center rounded-lg border border-dashed bg-muted/20 px-4 py-5 text-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <UploadCloud className="h-8 w-8" />
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">Click to upload or drag and drop</span>
                            <span className="text-xs">
                              {dataSource === "csv" && "CSV (*.csv)"}
                              {dataSource === "json" && "JSON (*.json)"}
                              {dataSource === "excel" && "Excel (*.xlsx, *.xls)"}
                            </span>
                          </div>
                          <Input
                            id="fileUpload"
                            type="file"
                            className="absolute inset-0 cursor-pointer opacity-0"
                            accept={
                              dataSource === "csv" ? ".csv" :
                              dataSource === "json" ? ".json" :
                              dataSource === "excel" ? ".xlsx,.xls" : ""
                            }
                            onChange={handleFileUpload}
                          />
                        </div>
                      </div>
                      
                      {uploadedFile && (
                        <div className="flex items-center gap-2 rounded-lg border bg-muted/20 px-3 py-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <div className="flex-1 text-sm">
                            <p className="font-medium">{uploadedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(uploadedFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setActiveTab("process")}
                          >
                            Continue to Processing
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {dataSource === "api" && (
                    <Button className="w-full" onClick={() => setActiveTab("process")}>
                      Connect to API
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="process" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Process Data</CardTitle>
                  <CardDescription>
                    Configure processing options for your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="normalize" className="flex items-center gap-2">
                          <input
                            id="normalize"
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={processingOptions.normalize}
                            onChange={() => setProcessingOptions(prev => ({
                              ...prev,
                              normalize: !prev.normalize
                            }))}
                          />
                          Normalize Data
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Scale numeric values to range between 0 and 1
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="removeOutliers" className="flex items-center gap-2">
                          <input
                            id="removeOutliers"
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={processingOptions.removeOutliers}
                            onChange={() => setProcessingOptions(prev => ({
                              ...prev,
                              removeOutliers: !prev.removeOutliers
                            }))}
                          />
                          Remove Outliers
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Identify and remove statistical outliers
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="fillMissingValues" className="flex items-center gap-2">
                          <input
                            id="fillMissingValues"
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={processingOptions.fillMissingValues}
                            onChange={() => setProcessingOptions(prev => ({
                              ...prev,
                              fillMissingValues: !prev.fillMissingValues
                            }))}
                          />
                          Fill Missing Values
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Replace missing values with statistical estimates
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="convertTypes" className="flex items-center gap-2">
                          <input
                            id="convertTypes"
                            type="checkbox"
                            className="rounded border-gray-300"
                            checked={processingOptions.convertTypes}
                            onChange={() => setProcessingOptions(prev => ({
                              ...prev,
                              convertTypes: !prev.convertTypes
                            }))}
                          />
                          Convert Data Types
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Automatically detect and convert column data types
                        </p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        onClick={handleProcessData}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing ? (
                          <>
                            <span className="animate-spin mr-2">⟳</span>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="mr-2 h-4 w-4" />
                            Process Data
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transform" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transform Data</CardTitle>
                  <CardDescription>
                    Write custom transformation code to manipulate your data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Textarea
                      value={transformationCode}
                      onChange={(e) => setTransformationCode(e.target.value)}
                      className="font-mono h-80"
                    />
                    
                    <div className="pt-4 flex gap-4">
                      <Button 
                        onClick={() => setActiveTab("visualize")}
                        variant="outline"
                        className="flex-1"
                      >
                        Skip Transformation
                      </Button>
                      <Button 
                        onClick={() => {
                          toast({
                            title: "Transformation Applied",
                            description: "Custom transformation has been applied to your data.",
                          });
                          setActiveTab("visualize");
                        }}
                        className="flex-1"
                      >
                        Apply Transformation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="visualize" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Visualize Results</CardTitle>
                  <CardDescription>
                    View and download your processed data
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {processedData ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="visualizationType">Visualization Type</Label>
                        <Select
                          value={visualizationType}
                          onValueChange={setVisualizationType}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select visualization type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bar">Bar Chart</SelectItem>
                            <SelectItem value="line">Line Chart</SelectItem>
                            <SelectItem value="pie">Pie Chart</SelectItem>
                            <SelectItem value="scatter">Scatter Plot</SelectItem>
                            <SelectItem value="table">Data Table</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="border rounded-lg p-4 h-64 bg-muted/20 flex items-center justify-center">
                        {visualizationType !== "table" ? (
                          <div className="text-center">
                            <BarChart3 className="h-16 w-16 mx-auto text-primary/50" />
                            <p className="mt-2 text-muted-foreground">
                              Visualization preview would appear here
                            </p>
                          </div>
                        ) : (
                          <div className="w-full overflow-auto">
                            <table className="min-w-full divide-y divide-border">
                              <thead>
                                <tr>
                                  {processedData.columns.map((column: string) => (
                                    <th key={column} className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider">
                                      {column}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {processedData.rows.map((row: any, i: number) => (
                                  <tr key={i}>
                                    {processedData.columns.map((column: string) => (
                                      <td key={`${i}-${column}`} className="px-4 py-2 text-sm">
                                        {typeof row[column] === "number" ? 
                                          row[column].toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2
                                          }) : 
                                          row[column]}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-muted/20 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-2">Data Summary</h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Total</p>
                            <p className="font-medium">{processedData.summary.total.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Average</p>
                            <p className="font-medium">{processedData.summary.average.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Minimum</p>
                            <p className="font-medium">{processedData.summary.min.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Maximum</p>
                            <p className="font-medium">{processedData.summary.max.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Outliers</p>
                            <p className="font-medium">{processedData.summary.outliers}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        onClick={handleDownloadResults}
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download Results
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No Data Available</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Process your data first to view visualizations
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setActiveTab("process")}
                      >
                        Go to Processing
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DataAnalysisPage;
