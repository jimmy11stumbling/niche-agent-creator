
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Plus, Save, Play, FileDown, FileUp, CheckCircle, ArrowRight 
} from "lucide-react";
import TemplateGalleryDialog from "../dialogs/TemplateGalleryDialog";

interface WorkflowToolbarProps {
  isDirty: boolean;
  isLoading: boolean;
  onNewWorkflow: () => void;
  onShowSaveDialog: () => void;
  onDuplicateWorkflow: () => void;
  onSelectTemplate: (templateId: string) => void;
  onExportWorkflow: () => void;
  onImportWorkflow: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onValidateWorkflow: () => void;
  onRunWorkflow: () => void;
}

const WorkflowToolbar: React.FC<WorkflowToolbarProps> = ({
  isDirty,
  isLoading,
  onNewWorkflow,
  onShowSaveDialog,
  onDuplicateWorkflow,
  onSelectTemplate,
  onExportWorkflow,
  onImportWorkflow,
  onValidateWorkflow,
  onRunWorkflow
}) => {
  return (
    <div className="bg-card p-2 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onNewWorkflow}>
          <FileDown className="h-4 w-4 mr-1" />
          New
        </Button>
        
        <Button
          variant={isDirty ? "default" : "outline"}
          size="sm"
          onClick={onShowSaveDialog}
        >
          <Save className="h-4 w-4 mr-1" />
          Save
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicateWorkflow}
        >
          <Plus className="h-4 w-4 mr-1" />
          Duplicate
        </Button>
        
        <TemplateGalleryDialog onSelectTemplate={onSelectTemplate}>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Template
          </Button>
        </TemplateGalleryDialog>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={onExportWorkflow}>
          <FileDown className="h-4 w-4 mr-1" />
          Export
        </Button>
        
        <div className="relative">
          <Input
            type="file"
            id="import-workflow"
            accept=".json"
            className="sr-only"
            onChange={onImportWorkflow}
          />
          <Label
            htmlFor="import-workflow"
            className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            <FileUp className="h-4 w-4 mr-1" />
            Import
          </Label>
        </div>
        
        <Button variant="outline" size="sm" onClick={onValidateWorkflow}>
          <CheckCircle className="h-4 w-4 mr-1" />
          Validate
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onRunWorkflow}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-1">
                <ArrowRight className="h-4 w-4" />
              </div>
              Running...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-1" />
              Run
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WorkflowToolbar;
