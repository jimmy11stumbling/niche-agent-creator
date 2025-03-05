
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, Database 
} from "lucide-react";
import { Workflow } from "@/types/workflow";

interface WorkflowControlsProps {
  workflow: Workflow;
  onAddTask: (type: string) => void;
  onWorkflowChange: (field: string, value: string) => void;
}

const WorkflowControls: React.FC<WorkflowControlsProps> = ({
  workflow,
  onAddTask,
  onWorkflowChange,
}) => {
  return (
    <div className="p-4 border-l border-border h-full overflow-y-auto">
      <h3 className="text-lg font-medium mb-4">Workflow Designer</h3>
      
      <p className="text-muted-foreground mb-4">
        Select a task or transition to view and edit its properties.
      </p>
      
      <div className="space-y-2 mb-6">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Trigger")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Trigger
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Action")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Action
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("DataProcessing")}
        >
          <Database className="h-4 w-4 mr-2" />
          Add Data Processing
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("Condition")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => onAddTask("SubWorkflow")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sub-Workflow
        </Button>
      </div>
      
      <Separator className="my-4" />
      
      <div className="space-y-4 mb-6">
        <h4 className="text-sm font-medium">Workflow Properties</h4>
        
        <div>
          <Label>Name</Label>
          <Input
            value={workflow.name}
            onChange={(e) => onWorkflowChange("name", e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div>
          <Label>Description</Label>
          <Textarea
            value={workflow.description}
            onChange={(e) => onWorkflowChange("description", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default WorkflowControls;
