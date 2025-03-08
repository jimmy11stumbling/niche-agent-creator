
import { Task } from "@/types/workflow";
import { applyTransformations } from "./processing/transformations";
import { formatData } from "./processing/formatters";

// Memoization cache for processed results
const processingCache = new Map<string, any>();

// Helper to find a task by ID with error handling
export const getTaskById = (tasks: Task[], id: string): Task | null => {
  if (!tasks || !Array.isArray(tasks) || !id) return null;
  return tasks.find((task) => task.id === id) || null;
};

// Process data according to task configuration with error handling and caching
export const processData = async (task: Task, inputData: any) => {
  try {
    if (!task) {
      throw new Error("Task is undefined or null");
    }
    
    console.log(`Processing data with task: ${task.name}`);
    
    if (!task.parameters) {
      throw new Error("Task parameters are not defined");
    }
    
    // Create a cache key based on task and input data
    const cacheKey = JSON.stringify({
      taskId: task.id,
      taskParams: task.parameters,
      inputDataHash: JSON.stringify(inputData).slice(0, 100) // Only use first part of data for hash
    });
    
    // Check cache before processing
    if (processingCache.has(cacheKey)) {
      console.log("Using cached processing result");
      return processingCache.get(cacheKey);
    }
    
    const { dataSource, transformations, outputFormat, validation, validationRules } = task.parameters;
    
    // Validate input data
    let processedData = validateInputData(inputData);
    
    // Apply transformations
    if (transformations && Array.isArray(transformations)) {
      processedData = applyTransformations(processedData, transformations);
    }
    
    // Apply validation if enabled
    if (validation && validationRules) {
      processedData = validateData(processedData, validationRules);
    }
    
    // Format data according to output format
    const formattedData = formatData(processedData, outputFormat);
    
    const result = {
      data: formattedData,
      metadata: {
        processedAt: new Date().toISOString(),
        taskId: task.id,
        taskName: task.name,
        taskType: task.type,
        actionType: task.actionType,
        transformations: transformations ? transformations.length : 0,
        validated: !!validation
      }
    };
    
    // Store in cache
    processingCache.set(cacheKey, result);
    
    // Limit cache size to prevent memory leaks
    if (processingCache.size > 100) {
      const oldestKey = processingCache.keys().next().value;
      processingCache.delete(oldestKey);
    }
    
    return result;
  } catch (error) {
    console.error("Error in data processing:", error);
    throw new Error(`Data processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Validate input data with better error handling
const validateInputData = (inputData: any): any => {
  if (inputData === undefined || inputData === null) {
    return {}; // Return empty object as fallback
  }
  
  try {
    // If it's a string that looks like JSON, try to parse it
    if (typeof inputData === 'string') {
      const trimmed = inputData.trim();
      if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || 
          (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
        return JSON.parse(trimmed);
      }
    }
    return inputData;
  } catch (error) {
    console.warn("Could not parse input data as JSON:", error);
    return inputData; // Return original if parsing fails
  }
};

// Validate data against rules
const validateData = (data: any, rules: any): any => {
  console.log("Validating data against rules");
  
  try {
    let isValid = true;
    const validationMessages: string[] = [];
    
    if (rules.schema) {
      // Simple JSON Schema validation
      const { required, properties } = rules.schema;
      
      // Check required fields
      if (Array.isArray(required)) {
        required.forEach(field => {
          if (data[field] === undefined) {
            isValid = false;
            validationMessages.push(`Missing required field: ${field}`);
          }
        });
      }
      
      // Check property types
      if (properties && typeof properties === 'object') {
        Object.entries(properties).forEach(([field, schema]: [string, any]) => {
          if (data[field] !== undefined) {
            const fieldType = schema.type;
            const actualType = typeof data[field];
            
            // Type validation
            if (fieldType && actualType !== fieldType && 
                !(fieldType === 'number' && !isNaN(Number(data[field])))) {
              isValid = false;
              validationMessages.push(
                `Field ${field} has wrong type: expected ${fieldType}, got ${actualType}`
              );
            }
            
            // String pattern validation
            if (fieldType === 'string' && schema.pattern) {
              const regex = new RegExp(schema.pattern);
              if (!regex.test(data[field])) {
                isValid = false;
                validationMessages.push(
                  `Field ${field} does not match pattern: ${schema.pattern}`
                );
              }
            }
            
            // Number range validation
            if (fieldType === 'number') {
              const value = Number(data[field]);
              if (schema.minimum !== undefined && value < schema.minimum) {
                isValid = false;
                validationMessages.push(
                  `Field ${field} is less than minimum: ${schema.minimum}`
                );
              }
              if (schema.maximum !== undefined && value > schema.maximum) {
                isValid = false;
                validationMessages.push(
                  `Field ${field} is greater than maximum: ${schema.maximum}`
                );
              }
            }
          }
        });
      }
    }
    
    return {
      ...data,
      validated: true,
      isValid,
      validationMessages: validationMessages.length ? validationMessages : undefined
    };
  } catch (error) {
    console.error("Error validating data:", error);
    return {
      ...data,
      validated: false,
      isValid: false,
      validationMessages: [`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
};

// Expose function to clear processing cache for testing or memory management
export const clearProcessingCache = () => {
  processingCache.clear();
  console.log("Processing cache cleared");
};
