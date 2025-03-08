
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CircleCheckIcon } from "lucide-react";

interface ModelSelectorProps {
  onSelect: (modelId: string) => void;
}

const models = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    description: "Advanced language model for complex tasks and reasoning",
    capabilities: ["Text Generation", "Code", "Reasoning", "Creative Writing"],
    size: "1.8 trillion parameters",
    badge: "Recommended"
  },
  {
    id: "llama-3.1-small",
    name: "Llama 3.1 Small",
    provider: "Meta",
    description: "Compact but powerful general-purpose language model",
    capabilities: ["Text Generation", "Summarization", "Q&A"],
    size: "8B parameters",
    badge: "Efficient"
  },
  {
    id: "claude-3-sonnet",
    name: "Claude 3 Sonnet",
    provider: "Anthropic",
    description: "Balanced performance for enterprise applications",
    capabilities: ["Text Generation", "Document Analysis", "Creative Content"],
    size: "~70B parameters",
    badge: null
  },
  {
    id: "mistral-large",
    name: "Mistral Large",
    provider: "Mistral AI",
    description: "High-performance language model for complex tasks",
    capabilities: ["Text Generation", "Reasoning", "Structured Output"],
    size: "~45B parameters",
    badge: null
  },
  {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Mistral AI",
    description: "Mixture-of-experts model with balanced capabilities",
    capabilities: ["Text Generation", "Multilingual", "Code"],
    size: "46.7B parameters",
    badge: "Multi-expert"
  }
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ onSelect }) => {
  const [selectedModelId, setSelectedModelId] = useState<string>("");

  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
  };

  const handleConfirm = () => {
    if (selectedModelId) {
      onSelect(selectedModelId);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <RadioGroup 
          value={selectedModelId} 
          onValueChange={handleModelSelect}
          className="space-y-3"
        >
          {models.map((model) => (
            <Card 
              key={model.id}
              className={`border transition-all ${selectedModelId === model.id ? 'border-primary' : 'hover:border-gray-300'}`}
            >
              <CardContent className="p-4 flex items-start gap-3">
                <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Label 
                      htmlFor={model.id} 
                      className="font-medium text-base cursor-pointer"
                    >
                      {model.name}
                      {selectedModelId === model.id && (
                        <CircleCheckIcon className="h-4 w-4 inline-block ml-2 text-primary" />
                      )}
                    </Label>
                    {model.badge && (
                      <Badge variant="outline" className="ml-2">
                        {model.badge}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">{model.provider}</span> • {model.size}
                  </p>
                  
                  <p className="text-sm mt-1">
                    {model.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {model.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {capability}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </RadioGroup>
      </div>
      
      <Button
        onClick={handleConfirm}
        disabled={!selectedModelId}
        className="w-full"
      >
        Select Model
      </Button>
    </div>
  );
};

export default ModelSelector;
