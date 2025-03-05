
import { Workflow, Task, ActionType } from "@/types/workflow";
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
  
  // Check workflow name
  if (!workflow.name || workflow.name.trim() === '') {
    errors.push("Workflow must have a name");
  }
  
  // Check for at least one task
  if (workflow.tasks.length === 0) {
    errors.push("Workflow must have at least one task");
    return errors; // Early return if no tasks to avoid further errors
  }
  
  // Check for at least one trigger
  const hasTrigger = workflow.tasks.some((task) => task.type === "Trigger");
  if (!hasTrigger) {
    errors.push("Workflow must have at least one trigger task");
  }
  
  // Check for task names
  const emptyNameTasks = workflow.tasks.filter(task => !task.name || task.name.trim() === '');
  if (emptyNameTasks.length > 0) {
    errors.push(`Found ${emptyNameTasks.length} tasks without names`);
  }
  
  // Check for duplicate task names
  const taskNames = workflow.tasks.map(task => task.name);
  const uniqueTaskNames = new Set(taskNames);
  if (uniqueTaskNames.size !== taskNames.length) {
    errors.push("Task names must be unique");
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
  
  // Check for invalid transitions
  workflow.transitions.forEach(transition => {
    const sourceExists = workflow.tasks.some(task => task.id === transition.sourceTaskId);
    const targetExists = workflow.tasks.some(task => task.id === transition.targetTaskId);
    
    if (!sourceExists || !targetExists) {
      errors.push(`Transition ${transition.id.substring(0, 8)} references missing task(s)`);
    }
    
    // Check for conditions on transitions from condition tasks
    const sourceTask = workflow.tasks.find(task => task.id === transition.sourceTaskId);
    if (sourceTask?.type === "Condition" && !transition.condition) {
      errors.push(`Transition from condition task '${sourceTask.name}' must have a condition`);
    }
  });
  
  // Check for data processing tasks and their configurations
  const dataProcessingTasks = workflow.tasks.filter(
    (task) => task.type === "Action" && task.actionType === "DataProcessing"
  );
  
  dataProcessingTasks.forEach(task => {
    // Check if data source is configured
    if (!task.parameters?.dataSource) {
      errors.push(`Data processing task '${task.name}' is missing a data source`);
    }
    
    // Check if output format is specified
    if (!task.parameters?.outputFormat) {
      errors.push(`Data processing task '${task.name}' is missing an output format`);
    }
    
    // Check for data validation settings
    if (task.parameters?.validation === true && !task.parameters?.validationRules) {
      errors.push(`Data processing task '${task.name}' has validation enabled but no rules defined`);
    }
  });
  
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

// Process data according to task configuration
export const processData = async (task: Task, inputData: any) => {
  // In a real application, this would call APIs or services to process data
  console.log(`Processing data with task: ${task.name}`);
  
  if (!task.parameters) {
    throw new Error("Task parameters are not defined");
  }
  
  const { dataSource, transformations, outputFormat, validation, validationRules } = task.parameters;
  
  // Simulate data processing
  let processedData = { ...inputData };
  
  // Apply transformations
  if (transformations && Array.isArray(transformations)) {
    transformations.forEach(transform => {
      console.log(`Applying transformation: ${transform.type}`);
      // Simulate different types of transformations
      switch (transform.type) {
        case "normalize":
          // Normalize text data - simulated
          processedData = { ...processedData, normalized: true };
          break;
        case "filter":
          // Filter data - simulated
          processedData = { ...processedData, filtered: true };
          break;
        case "augment":
          // Augment data - simulated
          processedData = { ...processedData, augmented: true };
          break;
        default:
          console.log(`Unknown transformation type: ${transform.type}`);
      }
    });
  }
  
  // Apply validation if enabled
  if (validation && validationRules) {
    console.log("Validating data against rules");
    // Simulate validation - in a real app this would check against rules
    processedData = { ...processedData, validated: true };
  }
  
  // Format data according to output format
  console.log(`Formatting data to: ${outputFormat}`);
  
  // Simulate different output formats
  let formattedData;
  switch (outputFormat) {
    case "json":
      formattedData = JSON.stringify(processedData);
      break;
    case "csv":
      // Simple CSV simulation
      formattedData = "data,in,csv,format";
      break;
    default:
      formattedData = processedData;
  }
  
  return {
    data: formattedData,
    metadata: {
      processedAt: new Date().toISOString(),
      taskId: task.id,
      transformations: transformations ? transformations.length : 0,
      validated: !!validation
    }
  };
};
