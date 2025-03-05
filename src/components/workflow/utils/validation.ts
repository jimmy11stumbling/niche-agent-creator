
import { Workflow, Task } from "@/types/workflow";

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
  
  validateDataProcessingTasks(workflow.tasks, errors);
  
  return errors;
};

// Validate data processing tasks
const validateDataProcessingTasks = (tasks: Task[], errors: string[]) => {
  // Check for data processing tasks and their configurations
  const dataProcessingTasks = tasks.filter(
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
};
