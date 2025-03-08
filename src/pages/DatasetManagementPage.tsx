
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, FileIcon, UploadIcon, DatabaseIcon, BrainIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import DatasetUploader from "@/components/dataset/DatasetUploader";
import DatasetPreprocessor from "@/components/dataset/DatasetPreprocessor";
import ModelSelector from "@/components/dataset/ModelSelector";
import DatasetList from "@/components/dataset/DatasetList";
import MultiAgentSettings from "@/components/dataset/MultiAgentSettings";

const DatasetManagementPage = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [currentDataset, setCurrentDataset] = useState<any>(null);
  const [preprocessedData, setPreprocessedData] = useState<any>(null);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDatasetUpload = (dataset: any) => {
    setCurrentDataset(dataset);
    setActiveTab("preprocess");
  };

  const handlePreprocessComplete = (data: any) => {
    setPreprocessedData(data);
    setActiveTab("model");
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    setActiveTab("train");
  };

  const handleStartTraining = async () => {
    if (!preprocessedData || !selectedModel) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate training process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      setIsProcessing(false);
      setActiveTab("results");
    } catch (error) {
      console.error("Training error:", error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-8">
          <Alert className="bg-primary/5 border-primary/20 mb-6">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Dataset Creation Station</AlertTitle>
            <AlertDescription>
              Upload, preprocess, and use datasets to train models or enhance your workflow automations.
              Combine multiple agents for collaborative insights and improved responses.
            </AlertDescription>
          </Alert>

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dataset Management</h1>
            <div className="flex gap-2">
              <Link to="/workflow-designer">
                <Button variant="outline" size="sm">
                  Workflow Designer
                </Button>
              </Link>
              <Link to="/data-analysis">
                <Button variant="outline" size="sm">
                  Data Analysis
                </Button>
              </Link>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl mx-auto">
              <TabsTrigger value="upload" className="flex items-center gap-1">
                <UploadIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="preprocess" disabled={!currentDataset} className="flex items-center gap-1">
                <FileIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Preprocess</span>
              </TabsTrigger>
              <TabsTrigger value="model" disabled={!preprocessedData} className="flex items-center gap-1">
                <BrainIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Model</span>
              </TabsTrigger>
              <TabsTrigger value="train" disabled={!selectedModel} className="flex items-center gap-1">
                <DatabaseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Train</span>
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-1">
                <DatabaseIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Results</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload New Dataset</CardTitle>
                    <CardDescription>
                      Upload your dataset files for processing and training
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetUploader onUploadComplete={handleDatasetUpload} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Existing Datasets</CardTitle>
                    <CardDescription>
                      Select from your previously uploaded datasets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DatasetList onSelect={setCurrentDataset} />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preprocess" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Preprocess Dataset</CardTitle>
                  <CardDescription>
                    Configure preprocessing options for your dataset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {currentDataset && (
                    <DatasetPreprocessor 
                      dataset={currentDataset} 
                      onComplete={handlePreprocessComplete} 
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="model" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Select Model</CardTitle>
                  <CardDescription>
                    Choose a model for training or fine-tuning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModelSelector onSelect={handleModelSelect} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="train" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Training Configuration</CardTitle>
                    <CardDescription>
                      Configure training parameters and start the process
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Dataset Information</h3>
                      <p className="text-sm text-muted-foreground">
                        Dataset: {currentDataset?.name || "None"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Preprocessed: {preprocessedData ? "Yes" : "No"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Selected Model: {selectedModel || "None"}
                      </p>
                    </div>
                    
                    <Button 
                      onClick={handleStartTraining} 
                      disabled={isProcessing || !preprocessedData || !selectedModel}
                      className="w-full"
                    >
                      {isProcessing ? "Processing..." : "Start Training"}
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Multi-Agent Collaboration</CardTitle>
                    <CardDescription>
                      Configure multiple agents to collaborate during training
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MultiAgentSettings />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Results & Deployment</CardTitle>
                  <CardDescription>
                    View training results and deploy your model
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-md">
                      <p className="text-center text-muted-foreground">
                        {isProcessing 
                          ? "Training in progress..." 
                          : preprocessedData 
                            ? "Training complete. Your model is ready for deployment." 
                            : "No training data available."
                        }
                      </p>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        disabled={!preprocessedData || isProcessing}
                      >
                        Download Model
                      </Button>
                      <Button 
                        disabled={!preprocessedData || isProcessing}
                      >
                        Deploy to Workflow
                      </Button>
                    </div>
                  </div>
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

export default DatasetManagementPage;
