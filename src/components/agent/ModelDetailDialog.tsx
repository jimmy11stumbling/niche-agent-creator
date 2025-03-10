
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ModelStats from "./ModelStats";
import { Download, ExternalLink, Check, AlertTriangle, Info } from "lucide-react";

interface ModelDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  model: {
    id: string;
    name: string;
    description: string;
    size?: string;
    parameterCount?: string;
    responseSpeed: number;
    contextWindow: number;
    reasoning: number;
    accuracy: number;
    languageSupport?: string[];
    specializations?: string[];
    requiresAuth?: boolean;
    downloadSize?: string;
    publisher?: string;
    license?: string;
    releaseDate?: string;
    isAlreadyDownloaded?: boolean;
  };
  onDownload: (modelId: string) => void;
  isDownloading: boolean;
}

const ModelDetailDialog = ({ 
  isOpen, 
  onClose, 
  model, 
  onDownload,
  isDownloading
}: ModelDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{model.name}</span>
            {model.parameterCount && (
              <Badge variant="outline" className="bg-primary/10">
                {model.parameterCount}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {model.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-2">
          <ModelStats model={model} />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1 text-blue-500" />
                Model Details
              </h4>
              <ul className="space-y-2">
                {model.publisher && (
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span className="font-medium">{model.publisher}</span>
                  </li>
                )}
                {model.license && (
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium">{model.license}</span>
                  </li>
                )}
                {model.releaseDate && (
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Released:</span>
                    <span className="font-medium">{model.releaseDate}</span>
                  </li>
                )}
                {model.downloadSize && (
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Download Size:</span>
                    <span className="font-medium">{model.downloadSize}</span>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-1 text-green-500" />
                Capabilities
              </h4>
              <ul className="space-y-1">
                {[
                  "Text generation",
                  "Question answering",
                  "Summarization",
                  model.contextWindow >= 6 ? "Long-form content" : null,
                  model.reasoning >= 7 ? "Complex reasoning" : null,
                  model.accuracy >= 8 ? "High factual accuracy" : null,
                ]
                  .filter(Boolean)
                  .map((capability, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                      {capability}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          {model.requiresAuth && (
            <div className="bg-amber-50 p-3 rounded-md flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">Authentication Required</h4>
                <p className="text-sm text-amber-700 mt-1">
                  This model requires a Hugging Face authentication token. You'll be prompted 
                  to enter your token before downloading.
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />
        
        <DialogFooter className="gap-2 sm:gap-0">
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-auto">
              Close
            </Button>
            <Button 
              onClick={() => onDownload(model.id)}
              disabled={isDownloading || model.isAlreadyDownloaded}
              className="flex-1 sm:flex-auto"
            >
              {model.isAlreadyDownloaded ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Downloaded
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Model
                </>
              )}
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="mt-2 w-full sm:w-auto sm:mt-0" asChild>
            <a 
              href={`https://huggingface.co/${model.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              View on Hugging Face
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelDetailDialog;
