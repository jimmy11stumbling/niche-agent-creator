
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu, Sparkles, Zap, AlertTriangle, Server, Circle, CheckCircle, Info, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AgentModelCardProps {
  model: {
    id: string;
    name: string;
    provider: string;
    description: string;
    size: string;
    capabilities: string[];
    badge?: string;
    requiresAuth?: boolean;
    isDownloaded?: boolean;
    downloadProgress?: number;
    isDownloading?: boolean;
  };
  onDownloadModel: (modelId: string) => void;
  isSelected?: boolean;
  onSelect?: (modelId: string) => void;
}

const AgentModelCard = ({ 
  model, 
  onDownloadModel, 
  isSelected, 
  onSelect 
}: AgentModelCardProps) => {
  const getProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'openai':
        return <Sparkles className="h-4 w-4 text-green-500" />;
      case 'meta':
      case 'meta ai':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'anthropic':
        return <Circle className="h-4 w-4 text-purple-500" />;
      case 'mistral':
      case 'mistral ai':
        return <Cpu className="h-4 w-4 text-indigo-500" />;
      case 'google':
        return <Server className="h-4 w-4 text-red-500" />;
      default:
        return <Cpu className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className={`transition-all ${isSelected ? 'border-primary' : 'hover:border-gray-300'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getProviderIcon(model.provider)}
            <div>
              <CardTitle className="text-base">{model.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                {model.provider}
                <span className="text-muted-foreground/50 mx-1">•</span>
                {model.size}
              </CardDescription>
            </div>
          </div>
          
          {model.badge && (
            <Badge variant={model.badge === "Recommended" ? "default" : "secondary"} className="ml-2">
              {model.badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm">{model.description}</p>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {model.capabilities.map((capability, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {capability}
            </Badge>
          ))}
        </div>
        
        {model.requiresAuth && (
          <div className="mt-2 flex items-center bg-amber-50 p-1.5 rounded text-xs text-amber-600">
            <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>Requires Hugging Face authentication</span>
          </div>
        )}
        
        {model.isDownloading && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Downloading...</span>
              <span>{model.downloadProgress}%</span>
            </div>
            <Progress value={model.downloadProgress} className="h-1" />
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        {onSelect && (
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onSelect(model.id)}
            className={isSelected ? "text-primary" : ""}
          >
            {isSelected ? (
              <>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                Selected
              </>
            ) : (
              "Select Model"
            )}
          </Button>
        )}
        
        <div className="flex ml-auto">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8"
                >
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View model details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {!model.isDownloaded && !model.isDownloading && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDownloadModel(model.id)}
              className="ml-2"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          )}
          
          {model.isDownloaded && (
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Downloaded
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default AgentModelCard;
