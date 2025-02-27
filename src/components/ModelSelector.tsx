
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Info, Award, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelSelectorProps {
  selectedModel: string;
  onSelectModel: (model: string) => void;
}

const ModelSelector = ({ selectedModel, onSelectModel }: ModelSelectorProps) => {
  const models = [
    {
      id: "llama-3.2-3B",
      name: "Llama 3.2 3B",
      description: "Compact and efficient model ideal for most use cases",
      size: "3 GB",
      specs: "3 billion parameters, good balance of size and capability",
      strengths: ["Fast response times", "Low resource requirements", "Good for basic conversations"],
      recommended: true,
    },
    {
      id: "llama-3.2-8B",
      name: "Llama 3.2 8B",
      description: "Better reasoning and knowledge at a larger size",
      size: "8 GB",
      specs: "8 billion parameters, improved reasoning capabilities",
      strengths: ["Better factual accuracy", "Improved reasoning", "Good code generation"],
      recommended: false,
    },
    {
      id: "llama-3.2-70B",
      name: "Llama 3.2 70B",
      description: "Enterprise-grade model with advanced capabilities",
      size: "70 GB",
      specs: "70 billion parameters, advanced reasoning and knowledge",
      strengths: ["Advanced reasoning", "Complex task handling", "Near-state-of-the-art performance"],
      recommended: false,
    },
  ];

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
        onValueChange={onSelectModel}
        className="grid gap-4"
      >
        {models.map((model) => (
          <div key={model.id} className="relative">
            {model.recommended && (
              <div className="absolute -top-2 -right-2 z-10">
                <span className="bg-primary text-primary-foreground text-xs py-1 px-2 rounded-full flex items-center">
                  <Award className="h-3 w-3 mr-1" />
                  Recommended
                </span>
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
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{model.specs}</p>
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
