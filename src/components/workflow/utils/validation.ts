
import { Workflow, Task, Transition } from "@/types/workflow";

// Validate the workflow
export const validateWorkflow = (workflow: Workflow) => {
  const errors: string[] = [];
  
  try {
    // Check workflow name
    if (!workflow.name || workflow.name.trim() === '') {
      errors.push("Workflow must have a name");
    }
    
    // Check for at least one task
    if (!workflow.tasks || workflow.tasks.length === 0) {
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
      
      // Add more specific information about duplicate names
      const nameCounts: Record<string, number> = {};
      taskNames.forEach(name => {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      });
      
      Object.entries(nameCounts)
        .filter(([_, count]) => count > 1)
        .forEach(([name, count]) => {
          errors.push(`Name "${name}" is used ${count} times`);
        });
    }
    
    // Check for disconnected tasks
    const connectedTaskIds = new Set<string>();
    
    // Add all source and target task IDs from transitions
    if (workflow.transitions && workflow.transitions.length > 0) {
      workflow.transitions.forEach((transition) => {
        if (transition.sourceTaskId) connectedTaskIds.add(transition.sourceTaskId);
        if (transition.targetTaskId) connectedTaskIds.add(transition.targetTaskId);
      });
    }
    
    // Find disconnected tasks (except triggers which can be standalone)
    const disconnectedTasks = workflow.tasks.filter(
      (task) => task.type !== "Trigger" && !connectedTaskIds.has(task.id)
    );
    
    if (disconnectedTasks.length > 0) {
      errors.push(`Found ${disconnectedTasks.length} disconnected non-trigger tasks`);
      disconnectedTasks.forEach(task => {
        errors.push(`Task "${task.name}" is disconnected`);
      });
    }
    
    // Check for tasks with invalid types
    const validTaskTypes = ["Trigger", "Action", "Condition", "SubWorkflow"];
    const invalidTypeTasks = workflow.tasks.filter(
      (task) => !validTaskTypes.includes(task.type)
    );
    
    if (invalidTypeTasks.length > 0) {
      errors.push(`Found ${invalidTypeTasks.length} tasks with invalid types`);
      invalidTypeTasks.forEach(task => {
        errors.push(`Task "${task.name}" has invalid type: ${task.type}`);
      });
    }
    
    // Check for invalid transitions
    if (workflow.transitions && workflow.transitions.length > 0) {
      workflow.transitions.forEach(transition => {
        const sourceExists = workflow.tasks.some(task => task.id === transition.sourceTaskId);
        const targetExists = workflow.tasks.some(task => task.id === transition.targetTaskId);
        
        if (!sourceExists || !targetExists) {
          const transitionId = transition.id.substring(0, 8);
          errors.push(`Transition ${transitionId} references missing task(s)`);
          
          if (!sourceExists) {
            errors.push(`Transition ${transitionId}: source task ID ${transition.sourceTaskId} not found`);
          }
          
          if (!targetExists) {
            errors.push(`Transition ${transitionId}: target task ID ${transition.targetTaskId} not found`);
          }
        }
        
        // Check for conditions on transitions from condition tasks
        const sourceTask = workflow.tasks.find(task => task.id === transition.sourceTaskId);
        if (sourceTask?.type === "Condition" && !transition.condition) {
          errors.push(`Transition from condition task '${sourceTask.name}' must have a condition`);
        }
      });
    }
    
    validateDataProcessingTasks(workflow.tasks, errors);
    validateWebCrawlingTasks(workflow.tasks, errors);
    validateAICompletionTasks(workflow.tasks, errors);
    
  } catch (error) {
    console.error("Error in workflow validation:", error);
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
  
  return errors;
};

// Validate data processing tasks
const validateDataProcessingTasks = (tasks: Task[], errors: string[]) => {
  // Check for data processing tasks and their configurations
  const dataProcessingTasks = tasks.filter(
    (task) => task.type === "Action" && task.actionType === "DataProcessing"
  );
  
  dataProcessingTasks.forEach(task => {
    try {
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
      
      // Check transformations if present
      if (task.parameters?.transformations && 
          Array.isArray(task.parameters.transformations) && 
          task.parameters.transformations.length > 0) {
        
        const invalidTransforms = task.parameters.transformations.filter(
          t => !t.type || typeof t.type !== 'string'
        );
        
        if (invalidTransforms.length > 0) {
          errors.push(`Data processing task '${task.name}' has ${invalidTransforms.length} invalid transformations`);
        }
      }
    } catch (error) {
      console.error("Error validating data processing task:", error);
      errors.push(`Error validating data processing task '${task.name}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};

// Validate web crawling tasks
const validateWebCrawlingTasks = (tasks: Task[], errors: string[]) => {
  const webCrawlingTasks = tasks.filter(
    (task) => task.type === "Action" && task.actionType === "WebCrawling"
  );
  
  webCrawlingTasks.forEach(task => {
    try {
      // Check for URL
      if (!task.parameters?.url) {
        errors.push(`Web crawling task '${task.name}' is missing a URL`);
      } else {
        // Simple URL validation
        try {
          new URL(task.parameters.url);
        } catch (e) {
          errors.push(`Web crawling task '${task.name}' has an invalid URL: ${task.parameters.url}`);
        }
      }
      
      // Check for reasonable depth
      if (task.parameters?.depth !== undefined && 
          (isNaN(Number(task.parameters.depth)) || Number(task.parameters.depth) < 1 || Number(task.parameters.depth) > 10)) {
        errors.push(`Web crawling task '${task.name}' has an invalid crawl depth (should be 1-10)`);
      }
      
      // Check for reasonable page limit
      if (task.parameters?.maxPages !== undefined && 
          (isNaN(Number(task.parameters.maxPages)) || Number(task.parameters.maxPages) < 1 || Number(task.parameters.maxPages) > 1000)) {
        errors.push(`Web crawling task '${task.name}' has an invalid max pages limit (should be 1-1000)`);
      }
    } catch (error) {
      console.error("Error validating web crawling task:", error);
      errors.push(`Error validating web crawling task '${task.name}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};

// Validate AI completion tasks
const validateAICompletionTasks = (tasks: Task[], errors: string[]) => {
  const aiCompletionTasks = tasks.filter(
    (task) => task.type === "Action" && task.actionType === "AICompletion"
  );
  
  aiCompletionTasks.forEach(task => {
    try {
      // Check for model
      if (!task.parameters?.model) {
        errors.push(`AI completion task '${task.name}' is missing a model`);
      }
      
      // Check for prompt
      if (!task.parameters?.prompt) {
        errors.push(`AI completion task '${task.name}' is missing a prompt`);
      }
      
      // Check temperature is in valid range
      if (task.parameters?.temperature !== undefined && 
          (isNaN(Number(task.parameters.temperature)) || 
           Number(task.parameters.temperature) < 0 || 
           Number(task.parameters.temperature) > 2)) {
        errors.push(`AI completion task '${task.name}' has an invalid temperature (should be 0-2)`);
      }
      
      // Check max tokens is positive
      if (task.parameters?.maxTokens !== undefined && 
          (isNaN(Number(task.parameters.maxTokens)) || Number(task.parameters.maxTokens) < 1)) {
        errors.push(`AI completion task '${task.name}' has an invalid maxTokens value (should be positive)`);
      }
    } catch (error) {
      console.error("Error validating AI completion task:", error);
      errors.push(`Error validating AI completion task '${task.name}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  });
};
