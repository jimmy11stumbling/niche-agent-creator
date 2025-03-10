
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Cpu, 
  Zap, 
  Database, 
  Scale, 
  Clock, 
  MessageSquare, 
  FileText, 
  Languages, 
  Info 
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ModelStatsProps {
  model: {
    id: string;
    name: string;
    size?: string;
    parameterCount?: string;
    responseSpeed: number;
    contextWindow: number;
    reasoning: number;
    accuracy: number;
    languageSupport?: string[];
    specializations?: string[];
    requiresAuth?: boolean;
  };
}

const ModelStats = ({ model }: ModelStatsProps) => {
  return (
    <Card className="border">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium flex items-center">
              <Cpu className="h-4 w-4 mr-1.5 text-primary" />
              {model.name}
            </h3>
            {model.size && (
              <p className="text-xs text-muted-foreground">
                Size: {model.size}
              </p>
            )}
          </div>
          
          {model.parameterCount && (
            <Badge variant="outline" className="text-xs bg-primary/10">
              {model.parameterCount}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1">
              <div className="text-xs flex items-center">
                <Zap className="h-3 w-3 mr-1 text-amber-500" />
                Response Speed
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs">How quickly the model processes prompts and generates responses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{model.responseSpeed}/10</span>
            </div>
            <Progress value={model.responseSpeed * 10} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="text-xs flex items-center">
                <Database className="h-3 w-3 mr-1 text-blue-500" />
                Context Window
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs">How much information the model can remember during a conversation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{model.contextWindow}/10</span>
            </div>
            <Progress value={model.contextWindow * 10} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="text-xs flex items-center">
                <Scale className="h-3 w-3 mr-1 text-green-500" />
                Reasoning
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs">The model's ability to think logically and solve complex problems</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{model.reasoning}/10</span>
            </div>
            <Progress value={model.reasoning * 10} className="h-1.5" />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <div className="text-xs flex items-center">
                <MessageSquare className="h-3 w-3 mr-1 text-purple-500" />
                Accuracy
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-3 w-3 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      <p className="text-xs">How factual and reliable the model's outputs are</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-xs font-medium">{model.accuracy}/10</span>
            </div>
            <Progress value={model.accuracy * 10} className="h-1.5" />
          </div>
        </div>

        {model.languageSupport && model.languageSupport.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center mb-1.5">
              <Languages className="h-3.5 w-3.5 mr-1 text-indigo-500" />
              <span className="text-xs font-medium">Language Support</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {model.languageSupport.slice(0, 5).map((language, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {language}
                </Badge>
              ))}
              {model.languageSupport.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{model.languageSupport.length - 5} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {model.specializations && model.specializations.length > 0 && (
          <div className="pt-1">
            <div className="flex items-center mb-1.5">
              <FileText className="h-3.5 w-3.5 mr-1 text-teal-500" />
              <span className="text-xs font-medium">Specializations</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {model.specializations.slice(0, 3).map((specialization, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-teal-500/10">
                  {specialization}
                </Badge>
              ))}
              {model.specializations.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{model.specializations.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {model.requiresAuth && (
          <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-1.5 rounded-sm flex items-start">
            <Info className="h-3.5 w-3.5 mr-1 mt-0.5 flex-shrink-0" />
            <span>Requires Hugging Face authentication</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelStats;
