
import { Workflow } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";

// Mock function to fetch workflow
export const fetchWorkflow = async (id: string): Promise<Workflow> => {
  // In a real app, this would be an API call
  const savedWorkflowsString = localStorage.getItem("workflows");
  const savedWorkflows = savedWorkflowsString
    ? JSON.parse(savedWorkflowsString)
    : [];

  const foundWorkflow = savedWorkflows.find((w: Workflow) => w.id === id);
  if (foundWorkflow) {
    return foundWorkflow;
  }

  throw new Error("Workflow not found");
};

// Save workflow to localStorage
export const saveWorkflow = (workflow: Workflow) => {
  const existingWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
  
  const workflowToSave = {
    ...workflow,
    updatedAt: new Date().toISOString(),
  };
  
  let updatedWorkflows;
  
  // Check if workflow already exists
  const existingIndex = existingWorkflows.findIndex((w: Workflow) => w.id === workflow.id);
  
  if (existingIndex !== -1) {
    // Update existing workflow
    updatedWorkflows = [...existingWorkflows];
    updatedWorkflows[existingIndex] = workflowToSave;
  } else {
    // Add new workflow
    updatedWorkflows = [...existingWorkflows, workflowToSave];
  }
  
  localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
  return updatedWorkflows;
};

// Apply a workflow template to a new or existing workflow
export const applyTemplate = (template: any, workflowId?: string) => {
  const newId = workflowId || uuidv4();
  
  // Create a copy of the template workflow with a new ID
  const newWorkflow: Workflow = {
    ...template.workflow,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Connect tasks from the template
  if (template.id === "scheduled-http-request" && newWorkflow.tasks.length >= 2) {
    const triggerId = newWorkflow.tasks[0].id;
    const actionId = newWorkflow.tasks[1].id;
    
    newWorkflow.transitions = [
      {
        id: uuidv4(),
        sourceTaskId: triggerId,
        targetTaskId: actionId,
      },
    ];
  } else if (template.id === "conditional-execution" && newWorkflow.tasks.length >= 4) {
    const triggerId = newWorkflow.tasks[0].id;
    const conditionId = newWorkflow.tasks[1].id;
    const highValueId = newWorkflow.tasks[2].id;
    const lowValueId = newWorkflow.tasks[3].id;
    
    newWorkflow.transitions = [
      {
        id: uuidv4(),
        sourceTaskId: triggerId,
        targetTaskId: conditionId,
      },
      {
        id: uuidv4(),
        sourceTaskId: conditionId,
        targetTaskId: highValueId,
        condition: "data.value > 100",
      },
      {
        id: uuidv4(),
        sourceTaskId: conditionId,
        targetTaskId: lowValueId,
        condition: "data.value <= 100",
      },
    ];
  } else if (template.id === "data-processing-pipeline" && newWorkflow.tasks.length >= 3) {
    const triggerId = newWorkflow.tasks[0].id;
    const processingId = newWorkflow.tasks[1].id;
    const validationId = newWorkflow.tasks[2].id;
    
    newWorkflow.transitions = [
      {
        id: uuidv4(),
        sourceTaskId: triggerId,
        targetTaskId: processingId,
      },
      {
        id: uuidv4(),
        sourceTaskId: processingId,
        targetTaskId: validationId,
      }
    ];
  }
  
  return newWorkflow;
};
