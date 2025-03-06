
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { FileUpload, Database, BarChart2, Filter, FileJson, Zap } from "lucide-react";

const DataAnalysisPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("upload");
  const [dataSource, setDataSource] = useState("");
  const [dataPreview, setDataPreview] = useState<any[]>([]);
  const [dataColumns, setDataColumns] = useState<string[]>([]);
  const [transformations, setTransformations] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);

  // Sample chart data for demonstration
  const sampleChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const pieData = [
    { name: 'Category A', value: 400 },
    { name: 'Category B', value: 300 },
    { name: 'Category C', value: 300 },
    { name: 'Category D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Simulate data parsing - in a real app this would parse CSV, JSON, etc.
        const mockData = [
          { id: 1, name: "Product A", category: "Electronics", price: 299.99, stock: 45 },
          { id: 2, name: "Product B", category: "Clothing", price: 59.99, stock: 120 },
          { id: 3, name: "Product C", category: "Electronics", price: 199.99, stock: 30 },
          { id: 4, name: "Product D", category: "Home", price: 99.99, stock: 75 },
          { id: 5, name: "Product E", category: "Clothing", price: 49.99, stock: 200 },
        ];
        
        setDataPreview(mockData);
        setDataColumns(Object.keys(mockData[0]));
        setDataSource(file.name);
        
        toast({
          title: "File Loaded",
          description: `Successfully loaded data from ${file.name}`,
        });
        
        setActiveTab("transform");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to parse the data file",
          variant: "destructive",
        });
      }
    };

    reader.readAsText(file);
  };

  const handleAddTransformation = (transform: string) => {
    if (!transformations.includes(transform)) {
      setTransformations([...transformations, transform]);
      
      toast({
        title: "Transformation Added",
        description: `Added ${transform} transformation to the pipeline`,
      });
    }
  };

  const handleRemoveTransformation = (transform: string) => {
    setTransformations(transformations.filter(t => t !== transform));
  };

  const handleProcessData = () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      // Mock analysis results
      setAnalysisResults({
        summary: {
          rowCount: dataPreview.length,
          columnCount: dataColumns.length,
          transformations: transformations.length,
          processingTime: "0.24 seconds"
        },
        stats: {
          "price": {
            min: 49.99,
            max: 299.99,
            avg: 142.59,
            median: 99.99
          },
          "stock": {
            min: 30,
            max: 200,
            avg: 94,
            median: 75
          }
        }
      });
      
      setIsProcessing(false);
      setActiveTab("visualize");
      
      toast({
        title: "Processing Complete",
        description: "Data processed successfully. View your results.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Data Analysis Workbench</h1>
            <p className="text-muted-foreground mb-8">
              Upload, transform, and visualize your data with our integrated analysis tools
            </p>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <FileUpload className="h-4 w-4" />
                  <span>1. Data Source</span>
                </TabsTrigger>
                <TabsTrigger value="transform" disabled={!dataSource} className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>2. Transforms</span>
                </TabsTrigger>
                <TabsTrigger value="process" disabled={!dataSource} className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span>3. Process</span>
                </TabsTrigger>
                <TabsTrigger value="visualize" disabled={!analysisResults} className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>4. Visualize</span>
                </TabsTrigger>
              </TabsList>

              {/* Data Source Tab */}
              <TabsContent value="upload" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Select Data Source</CardTitle>
                    <CardDescription>
                      Upload a file or connect to a database to begin analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <FileUpload className="h-5 w-5 text-primary" />
                          <span>Upload File</span>
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                          <Input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".csv,.json,.xlsx,.txt"
                            onChange={handleFileUpload}
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            <FileJson className="h-10 w-10 text-muted-foreground mb-2" />
                            <span className="text-muted-foreground">
                              Drag & drop a file here or click to browse
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                              Supports CSV, JSON, Excel, and text files
                            </span>
                          </Label>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                          <Database className="h-5 w-5 text-primary" />
                          <span>Connect to Database</span>
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="db-type">Database Type</Label>
                            <select
                              id="db-type"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                            >
                              <option value="postgres">PostgreSQL</option>
                              <option value="mysql">MySQL</option>
                              <option value="sqlite">SQLite</option>
                              <option value="mssql">Microsoft SQL Server</option>
                            </select>
                          </div>
                          <div>
                            <Label htmlFor="connection-string">Connection String</Label>
                            <Input
                              id="connection-string"
                              placeholder="postgresql://user:password@localhost:5432/database"
                            />
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => {
                              toast({
                                title: "Database Connection",
                                description: "This feature is coming soon in the next release",
                              });
                            }}
                          >
                            Connect to Database
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {dataSource && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Data Preview</CardTitle>
                      <CardDescription>
                        Preview of the first 5 rows from {dataSource}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-72 w-full">
                        <div className="w-full overflow-auto">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="border-b">
                                {dataColumns.map((col) => (
                                  <th key={col} className="px-4 py-2 text-left font-medium">{col}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {dataPreview.map((row, i) => (
                                <tr key={i} className="border-b">
                                  {dataColumns.map((col) => (
                                    <td key={col} className="px-4 py-2">{row[col]}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </ScrollArea>
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => setActiveTab("transform")}>
                        Continue to Transformations
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              {/* Transformations Tab */}
              <TabsContent value="transform" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Data Transformations</CardTitle>
                    <CardDescription>
                      Add transformations to process your data before analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-lg font-medium mb-3">Available Transformations</h3>
                        <div className="space-y-2">
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleAddTransformation("Filter")}
                          >
                            <Filter className="h-4 w-4 mr-2" /> Filter Rows
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleAddTransformation("Sort")}
                          >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 4h13M3 8h9M3 12h9M3 16h9M3 20h9M17 8l4 4-4 4" />
                            </svg> 
                            Sort Data
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleAddTransformation("Group")}
                          >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M16 3h5v5h-5zM16 16h5v5h-5zM3 3h5v5H3zM3 16h5v5H3zM8 12h8" />
                            </svg>
                            Group By
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleAddTransformation("Aggregate")}
                          >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M3 3v18h18" />
                              <path d="M18 9l-5-6-4 8-3-2" />
                            </svg>
                            Aggregate
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start" 
                            onClick={() => handleAddTransformation("Join")}
                          >
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="9" r="5" />
                              <circle cx="15" cy="15" r="5" />
                            </svg>
                            Join Datasets
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-3">Transformation Pipeline</h3>
                        {transformations.length === 0 ? (
                          <div className="border rounded-md p-8 text-center text-muted-foreground">
                            No transformations added yet. Select transformations from the left panel.
                          </div>
                        ) : (
                          <div className="border rounded-md p-4">
                            <ol className="space-y-2">
                              {transformations.map((transform, idx) => (
                                <li key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                  <span className="flex items-center">
                                    <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full mr-2">
                                      {idx + 1}
                                    </span>
                                    {transform}
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveTransformation(transform)}
                                  >
                                    ✕
                                  </Button>
                                </li>
                              ))}
                            </ol>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("upload")}>
                      Back
                    </Button>
                    <Button onClick={() => setActiveTab("process")}>
                      Continue to Processing
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Process Tab */}
              <TabsContent value="process" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Process Data</CardTitle>
                    <CardDescription>
                      Configure processing options and run the data pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="output-format">Output Format</Label>
                          <select
                            id="output-format"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                            <option value="excel">Excel</option>
                            <option value="sql">SQL</option>
                          </select>
                        </div>
                        
                        <div>
                          <Label htmlFor="processing-options">Advanced Options</Label>
                          <Textarea
                            id="processing-options"
                            placeholder="{}"
                            className="font-mono"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Optional: JSON configuration for advanced processing options
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="border rounded-md p-4">
                          <h3 className="font-medium mb-2">Processing Summary</h3>
                          <ul className="space-y-1 text-sm">
                            <li><span className="font-medium">Data Source:</span> {dataSource}</li>
                            <li><span className="font-medium">Rows:</span> {dataPreview.length}</li>
                            <li><span className="font-medium">Columns:</span> {dataColumns.length}</li>
                            <li><span className="font-medium">Transformations:</span> {transformations.length}</li>
                          </ul>
                        </div>
                        
                        <Button 
                          className="w-full"
                          onClick={handleProcessData}
                          disabled={isProcessing}
                        >
                          {isProcessing ? "Processing..." : "Process Data"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("transform")}>
                      Back
                    </Button>
                    <Button disabled={!analysisResults} onClick={() => setActiveTab("visualize")}>
                      View Results
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Visualize Tab */}
              <TabsContent value="visualize" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Results</CardTitle>
                    <CardDescription>
                      View insights and visualizations from your processed data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {analysisResults && (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <Card className="bg-primary/5">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-muted-foreground text-sm">Rows Processed</p>
                                <p className="text-3xl font-bold">{analysisResults.summary.rowCount}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-muted-foreground text-sm">Columns</p>
                                <p className="text-3xl font-bold">{analysisResults.summary.columnCount}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-muted-foreground text-sm">Transformations</p>
                                <p className="text-3xl font-bold">{analysisResults.summary.transformations}</p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="bg-primary/5">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <p className="text-muted-foreground text-sm">Processing Time</p>
                                <p className="text-3xl font-bold">{analysisResults.summary.processingTime}</p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Card>
                            <CardHeader>
                              <CardTitle>Price Distribution</CardTitle>
                            </CardHeader>
                            <CardContent className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={sampleChartData}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="name" />
                                  <YAxis />
                                  <Tooltip />
                                  <Legend />
                                  <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader>
                              <CardTitle>Category Breakdown</CardTitle>
                            </CardHeader>
                            <CardContent className="h-72">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                  </Pie>
                                  <Tooltip />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle>Statistical Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="overflow-auto">
                              <table className="w-full border-collapse">
                                <thead>
                                  <tr className="border-b">
                                    <th className="px-4 py-2 text-left font-medium">Metric</th>
                                    <th className="px-4 py-2 text-left font-medium">Price</th>
                                    <th className="px-4 py-2 text-left font-medium">Stock</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b">
                                    <td className="px-4 py-2 font-medium">Minimum</td>
                                    <td className="px-4 py-2">${analysisResults.stats.price.min}</td>
                                    <td className="px-4 py-2">{analysisResults.stats.stock.min}</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="px-4 py-2 font-medium">Maximum</td>
                                    <td className="px-4 py-2">${analysisResults.stats.price.max}</td>
                                    <td className="px-4 py-2">{analysisResults.stats.stock.max}</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="px-4 py-2 font-medium">Average</td>
                                    <td className="px-4 py-2">${analysisResults.stats.price.avg}</td>
                                    <td className="px-4 py-2">{analysisResults.stats.stock.avg}</td>
                                  </tr>
                                  <tr className="border-b">
                                    <td className="px-4 py-2 font-medium">Median</td>
                                    <td className="px-4 py-2">${analysisResults.stats.price.median}</td>
                                    <td className="px-4 py-2">{analysisResults.stats.stock.median}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => setActiveTab("process")}>
                      Back
                    </Button>
                    <Button 
                      onClick={() => {
                        toast({
                          title: "Export Complete",
                          description: "Analysis results have been exported",
                        });
                      }}
                    >
                      Export Results
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DataAnalysisPage;
