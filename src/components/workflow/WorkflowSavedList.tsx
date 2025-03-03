
import React from "react";
import { Workflow } from "@/types/workflow";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkflowSavedListProps {
  workflows: Workflow[];
  onLoadWorkflow: (workflow: Workflow) => void;
  onNewWorkflow: () => void;
}

const WorkflowSavedList: React.FC<WorkflowSavedListProps> = ({
  workflows,
  onLoadWorkflow,
  onNewWorkflow,
}) => {
  if (workflows.length === 0) {
    return (
      <div className="col-span-3 text-center p-8">
        <h3 className="text-lg font-medium mb-2">No Saved Workflows</h3>
        <p className="text-muted-foreground mb-4">
          You haven't saved any workflows yet. Create and save a workflow to see it here.
        </p>
        <Button onClick={onNewWorkflow}>Create New Workflow</Button>
      </div>
    );
  }

  return (
    <>
      {workflows.map((savedWorkflow) => (
        <Card key={savedWorkflow.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle>{savedWorkflow.name}</CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground mb-2">
              {savedWorkflow.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Tasks: {savedWorkflow.tasks.length} | Transitions:{" "}
              {savedWorkflow.transitions.length}
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated:{" "}
              {new Date(savedWorkflow.updatedAt).toLocaleDateString()}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => onLoadWorkflow(savedWorkflow)}
            >
              Load Workflow
            </Button>
          </CardFooter>
        </Card>
      ))}
    </>
  );
};

export default WorkflowSavedList;
