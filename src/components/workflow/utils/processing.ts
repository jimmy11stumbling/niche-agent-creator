
import { Task } from "@/types/workflow";

// Helper to find a task by ID
export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id) || null;
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
