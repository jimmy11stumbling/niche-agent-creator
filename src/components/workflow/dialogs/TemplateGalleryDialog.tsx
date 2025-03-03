
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { WORKFLOW_TEMPLATES } from "../constants";

interface TemplateGalleryDialogProps {
  children: React.ReactNode;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateGalleryDialog: React.FC<TemplateGalleryDialogProps> = ({
  children,
  onSelectTemplate,
}) => {
  return (
    <Dialog>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Workflow Templates</DialogTitle>
          <DialogDescription>
            Select a template to quickly create a workflow
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {WORKFLOW_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer hover:border-primary transition-all"
                onClick={() => onSelectTemplate(template.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{template.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <span className="bg-slate-100 px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <span className="ml-2">
                      {template.workflow.tasks.length} tasks
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGalleryDialog;
