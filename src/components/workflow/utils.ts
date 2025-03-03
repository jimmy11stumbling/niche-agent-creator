
import { Workflow, Task } from "@/types/workflow";
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

// Validate the workflow
export const validateWorkflow = (workflow: Workflow) => {
  const errors: string[] = [];
  
  // Check for at least one task
  if (workflow.tasks.length === 0) {
    errors.push("Workflow must have at least one task");
  }
  
  // Check for at least one trigger
  const hasTrigger = workflow.tasks.some((task) => task.type === "Trigger");
  if (!hasTrigger) {
    errors.push("Workflow must have at least one trigger task");
  }
  
  // Check for disconnected tasks
  const connectedTaskIds = new Set<string>();
  
  // Add all source and target task IDs from transitions
  workflow.transitions.forEach((transition) => {
    connectedTaskIds.add(transition.sourceTaskId);
    connectedTaskIds.add(transition.targetTaskId);
  });
  
  // Find disconnected tasks (except triggers which can be standalone)
  const disconnectedTasks = workflow.tasks.filter(
    (task) => task.type !== "Trigger" && !connectedTaskIds.has(task.id)
  );
  
  if (disconnectedTasks.length > 0) {
    errors.push(`Found ${disconnectedTasks.length} disconnected non-trigger tasks`);
  }
  
  // Check for tasks with invalid types
  const invalidTypeTasks = workflow.tasks.filter(
    (task) => !["Trigger", "Action", "Condition", "SubWorkflow"].includes(task.type)
  );
  
  if (invalidTypeTasks.length > 0) {
    errors.push(`Found ${invalidTypeTasks.length} tasks with invalid types`);
  }
  
  return errors;
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
  }
  
  return newWorkflow;
};

// Helper to find a task by ID
export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id) || null;
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
