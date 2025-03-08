
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface DatasetPreprocessorProps {
  dataset: any;
  onComplete: (preprocessedData: any) => void;
}

const DatasetPreprocessor: React.FC<DatasetPreprocessorProps> = ({ dataset, onComplete }) => {
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [options, setOptions] = useState({
    normalizeText: true,
    removeStopwords: true,
    tokenize: true,
    maxTokenLength: 512,
    language: "english",
    splitRatio: 80, // 80% training, 20% validation
  });

  const handleOptionChange = (key: string, value: any) => {
    setOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePreprocess = async () => {
    setProcessing(true);
    setProgress(0);

    // Simulate preprocessing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setProcessing(false);
            const preprocessedData = {
              id: dataset.id,
              originalName: dataset.name,
              preprocessedAt: new Date().toISOString(),
              options: options,
              stats: {
                totalRecords: 1000,
                trainingSplit: Math.floor(1000 * options.splitRatio / 100),
                validationSplit: Math.floor(1000 * (100 - options.splitRatio) / 100),
                tokens: options.tokenize ? 15000 : 0,
                vocabulary: 5000
              }
            };
            onComplete(preprocessedData);
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 100);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Text Processing</h3>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="normalize" 
                  checked={options.normalizeText}
                  onCheckedChange={(checked) => 
                    handleOptionChange("normalizeText", checked === true)
                  }
                />
                <Label htmlFor="normalize">Normalize text (lowercase, remove punctuation)</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="stopwords" 
                  checked={options.removeStopwords}
                  onCheckedChange={(checked) => 
                    handleOptionChange("removeStopwords", checked === true)
                  }
                />
                <Label htmlFor="stopwords">Remove stopwords</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="tokenize" 
                  checked={options.tokenize}
                  onCheckedChange={(checked) => 
                    handleOptionChange("tokenize", checked === true)
                  }
                />
                <Label htmlFor="tokenize">Tokenize</Label>
              </div>
              
              <div className="pt-1">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={options.language}
                  onValueChange={(value) => handleOptionChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Data Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="maxTokens">Max token length</Label>
                <Input 
                  id="maxTokens" 
                  type="number" 
                  value={options.maxTokenLength}
                  onChange={(e) => handleOptionChange("maxTokenLength", parseInt(e.target.value))}
                  min={1}
                  max={2048}
                />
              </div>
              
              <div>
                <Label htmlFor="splitRatio">Training/Validation Split (%)</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    id="splitRatio" 
                    type="number" 
                    value={options.splitRatio}
                    onChange={(e) => handleOptionChange("splitRatio", parseInt(e.target.value))}
                    min={50}
                    max={95}
                  />
                  <span className="text-sm text-muted-foreground w-40">
                    {options.splitRatio}% training, {100 - options.splitRatio}% validation
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-3">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-medium mb-2">Dataset Information</h3>
          <p className="text-sm">
            <span className="font-medium">File:</span> {dataset.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Size:</span> {(dataset.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-sm">
            <span className="font-medium">Type:</span> {dataset.type}
          </p>
        </div>
        
        {processing && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Processing...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button 
          onClick={handlePreprocess} 
          disabled={processing}
          className="w-full"
        >
          {processing ? "Processing..." : "Process Dataset"}
        </Button>
      </div>
    </div>
  );
};

export default DatasetPreprocessor;
