
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, Award, Zap, Clock } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const ModelSelector = ({ selectedModel, onSelectModel }: ModelSelectorProps) => {
  const [modelDetails, setModelDetails] = useState<{ [key: string]: any }>({
    "llama-3.2-3B": {
      downloadTime: "~10 minutes",
      compatibleDevices: ["CPU", "GPU (1GB+)"],
      popularity: 98,
    },
    "llama-3.2-8B": {
      downloadTime: "~25 minutes",
      compatibleDevices: ["GPU (2GB+)"],
      popularity: 92,
    },
    "llama-3.2-70B": {
      downloadTime: "~2 hours",
      compatibleDevices: ["GPU (8GB+)"],
      popularity: 87,
    },
  });

  const models = [
    {
      id: "llama-3.2-3B",
      name: "Llama 3.2 3B",
      description: "Compact and efficient model ideal for most use cases",
      size: "3 GB",
      specs: "3 billion parameters, good balance of size and capability",
      strengths: ["Fast response times", "Low resource requirements", "Good for basic conversations"],
      recommended: true,
      huggingFaceId: "meta-llama/Meta-Llama-3.2-3B"
    },
    {
      id: "llama-3.2-8B",
      name: "Llama 3.2 8B",
      description: "Better reasoning and knowledge at a larger size",
      size: "8 GB",
      specs: "8 billion parameters, improved reasoning capabilities",
      strengths: ["Better factual accuracy", "Improved reasoning", "Good code generation"],
      recommended: false,
      huggingFaceId: "meta-llama/Meta-Llama-3.2-8B-Instruct"
    },
    {
      id: "llama-3.2-70B",
      name: "Llama 3.2 70B",
      description: "Enterprise-grade model with advanced capabilities",
      size: "70 GB",
      specs: "70 billion parameters, advanced reasoning and knowledge",
      strengths: ["Advanced reasoning", "Complex task handling", "Near-state-of-the-art performance"],
      recommended: false,
      huggingFaceId: "meta-llama/Meta-Llama-3.2-70B-Instruct"
    },
  ];

  // Function to initialize HF pipeline
  const initializeHuggingFaceModel = async (modelId: string) => {
    try {
      // In a real implementation, this would use the HF transformers library to load the model
      // For example:
      // const { pipeline } = await import('@huggingface/transformers');
      // const model = await pipeline('text-generation', modelId);
      // return model;
      
      console.log(`Initializing HuggingFace model: ${modelId}`);
      return true;
    } catch (error) {
      console.error("Error initializing HuggingFace model:", error);
      return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Choose a Language Model</h3>
        <p className="text-sm text-muted-foreground">
          Select the language model that will power your AI agent
        </p>
      </div>

      <RadioGroup
        value={selectedModel}
        onValueChange={(value) => {
          onSelectModel(value);
          // This would trigger model initialization in a real implementation
          const model = models.find(m => m.id === value);
          if (model) {
            initializeHuggingFaceModel(model.huggingFaceId);
          }
        }}
        className="grid gap-4"
      >
        {models.map((model) => (
          <div key={model.id} className="relative">
            {model.recommended && (
              <div className="absolute -top-2 -right-2 z-10">
                <Badge variant="default" className="bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              </div>
            )}
            
            <Card className={`cursor-pointer transition-all hover:border-primary ${selectedModel === model.id ? "border-primary" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base flex items-center">
                    {model.name}
                  </CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{model.specs}</p>
                        <p className="text-xs mt-1">HuggingFace ID: {model.huggingFaceId}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>{model.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Model Size</p>
                    <p className="text-sm text-muted-foreground">{model.size}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Best For</p>
                    <div className="flex flex-wrap gap-1">
                      {model.strengths.map((strength, i) => (
                        <span key={i} className="inline-flex items-center text-xs bg-secondary text-secondary-foreground rounded-full px-2 py-0.5">
                          <Zap className="h-3 w-3 mr-1" />
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-sm font-medium">Download Time</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {modelDetails[model.id]?.downloadTime}
                    </p>
                  </div>
                  
                  <div className="space-y-1 mt-2">
                    <p className="text-sm font-medium">Compatible With</p>
                    <div className="flex flex-wrap gap-1">
                      {modelDetails[model.id]?.compatibleDevices.map((device: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {device}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center">
                  <RadioGroupItem value={model.id} id={model.id} className="peer sr-only" />
                  <Label
                    htmlFor={model.id}
                    className="flex flex-1 cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover px-3 py-2 text-center text-sm font-medium ring-offset-background peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary"
                  >
                    Select this model
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default ModelSelector;
