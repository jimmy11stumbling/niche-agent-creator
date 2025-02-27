
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, LucideIcon, Zap, Cpu, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Model {
  id: string;
  name: string;
  description: string;
  requiresAuth?: boolean;
}

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  models?: Model[];
}

// Default models if none are provided
const DEFAULT_MODELS: Model[] = [
  { 
    id: "gemma-2b", 
    name: "Gemma-2B", 
    description: "Google's 2B parameter open model with good performance for lightweight applications",
    requiresAuth: false
  },
  { 
    id: "llama-3.1-1B", 
    name: "Llama 3.1 1B", 
    description: "Meta's smallest Llama model, good balance of size and performance",
    requiresAuth: true
  },
  { 
    id: "llama-3.2-3B", 
    name: "Llama 3.2 3B", 
    description: "Meta's cutting-edge 3B parameter model with state-of-the-art performance",
    requiresAuth: true
  },
  { 
    id: "mistral-7b", 
    name: "Mistral 7B", 
    description: "Mistral AI's 7B parameter model with excellent reasoning capabilities", 
    requiresAuth: false
  },
];

const ModelSelector = ({ selectedModel, onSelectModel, models = DEFAULT_MODELS }: ModelSelectorProps) => {
  const [selectedModelDetails, setSelectedModelDetails] = useState<Model>(
    models.find(model => model.id === selectedModel) || models[0]
  );

  const handleModelChange = (modelId: string) => {
    onSelectModel(modelId);
    setSelectedModelDetails(models.find(model => model.id === modelId) || models[0]);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Select Model</h3>
        <p className="text-sm text-muted-foreground">
          Choose the AI model that powers your agent
        </p>
        <Select value={selectedModel} onValueChange={handleModelChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Available Models</SelectLabel>
              {models.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <span className="flex items-center">
                    {model.name}
                    {model.requiresAuth && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        Auth Required
                      </Badge>
                    )}
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      {selectedModelDetails && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">{selectedModelDetails.name}</CardTitle>
                {selectedModelDetails.requiresAuth && (
                  <Badge variant="outline" className="mt-1">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Requires Hugging Face Token
                  </Badge>
                )}
              </div>
              <ModelIcon modelId={selectedModelDetails.id} />
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              {selectedModelDetails.description}
            </CardDescription>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Type:</span> Text Generation
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-medium">Size:</span> {getSizeLabel(selectedModelDetails.id)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper to get model size for display
const getSizeLabel = (modelId: string): string => {
  if (modelId.includes("3.2-3B") || modelId.includes("3B")) return "3B parameters";
  if (modelId.includes("1B")) return "1B parameters";
  if (modelId.includes("2b") || modelId.includes("2B")) return "2B parameters";
  if (modelId.includes("7b") || modelId.includes("7B")) return "7B parameters";
  return "Unknown size";
};

// Icon component based on model
const ModelIcon = ({ modelId }: { modelId: string }) => {
  if (modelId.includes("llama")) {
    return <Zap className="h-5 w-5 text-blue-500" />;
  } else if (modelId.includes("gemma")) {
    return <CheckCircle className="h-5 w-5 text-green-500" />;
  } else if (modelId.includes("mistral")) {
    return <Cpu className="h-5 w-5 text-purple-500" />;
  }
  return <Cpu className="h-5 w-5 text-gray-500" />;
};

export default ModelSelector;
