
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Download, Check, FileJson, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: any; // Using any for simplicity, but should be properly typed
}

const ExportDialog = ({ open, onOpenChange, agent }: ExportDialogProps) => {
  const { toast } = useToast();
  const [exportFormat, setExportFormat] = useState<"json" | "text">("json");
  const [copySuccess, setCopySuccess] = useState(false);
  const [exportOptions, setExportOptions] = useState({
    includeSystemPrompt: true,
    includeExampleConversations: true,
    includeMetadata: false,
  });

  const handleCopyToClipboard = () => {
    const exportContent = prepareExportContent();
    navigator.clipboard.writeText(exportContent);
    
    setCopySuccess(true);
    toast({
      title: "Copied to clipboard",
      description: `Agent configuration has been copied as ${exportFormat.toUpperCase()}`,
    });
    
    setTimeout(() => {
      setCopySuccess(false);
    }, 2000);
  };

  const prepareExportContent = (): string => {
    // Filter agent data based on export options
    const exportData = {
      name: agent.name,
      niche: agent.niche,
      description: agent.description,
      personality: agent.personality,
      ...(exportOptions.includeSystemPrompt ? { systemPrompt: agent.systemPrompt } : {}),
      ...(exportOptions.includeExampleConversations && agent.exampleConversations ? 
        { exampleConversations: agent.exampleConversations } : {}),
      ...(exportOptions.includeMetadata ? {
        selectedModel: agent.selectedModel,
        deploymentMethod: agent.deploymentMethod,
        createdAt: new Date().toISOString(),
      } : {})
    };
    
    if (exportFormat === "json") {
      return JSON.stringify(exportData, null, 2);
    } else {
      // Text format
      return Object.entries(exportData)
        .map(([key, value]) => {
          if (key === "systemPrompt" || key === "exampleConversations") {
            return `# ${key.charAt(0).toUpperCase() + key.slice(1)}\n${value}`;
          }
          return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`;
        })
        .join('\n\n');
    }
  };

  const handleDownload = () => {
    const exportContent = prepareExportContent();
    const blob = new Blob([exportContent], { type: exportFormat === "json" ? "application/json" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${agent.name.replace(/\s+/g, "_").toLowerCase()}_config.${exportFormat === "json" ? "json" : "txt"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download started",
      description: `Agent configuration is being downloaded as ${exportFormat.toUpperCase()}`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Agent Configuration</DialogTitle>
          <DialogDescription>
            Export your agent settings to reuse or share with others.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="json" value={exportFormat} onValueChange={(value) => setExportFormat(value as "json" | "text")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="json" className="flex items-center gap-1">
              <FileJson className="h-4 w-4" />
              JSON
            </TabsTrigger>
            <TabsTrigger value="text" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeSystemPrompt" 
                checked={exportOptions.includeSystemPrompt}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeSystemPrompt: checked === true }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="includeSystemPrompt">Include System Prompt</Label>
                <p className="text-sm text-muted-foreground">
                  Export the system instructions for this agent
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeExampleConversations" 
                checked={exportOptions.includeExampleConversations}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeExampleConversations: checked === true }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="includeExampleConversations">Include Example Conversations</Label>
                <p className="text-sm text-muted-foreground">
                  Export example conversation data
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="includeMetadata" 
                checked={exportOptions.includeMetadata}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, includeMetadata: checked === true }))
                }
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="includeMetadata">Include Metadata</Label>
                <p className="text-sm text-muted-foreground">
                  Export additional settings like model selection and deployment method
                </p>
              </div>
            </div>
          </div>
          
          <TabsContent value="json" className="mt-4 relative">
            <pre className="bg-secondary/50 p-3 rounded-md text-xs overflow-auto max-h-60 whitespace-pre-wrap">
              {prepareExportContent()}
            </pre>
          </TabsContent>
          
          <TabsContent value="text" className="mt-4 relative">
            <pre className="bg-secondary/50 p-3 rounded-md text-xs overflow-auto max-h-60 whitespace-pre-wrap">
              {prepareExportContent()}
            </pre>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-between flex-row">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleCopyToClipboard}
            >
              {copySuccess ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
