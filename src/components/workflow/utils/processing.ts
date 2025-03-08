import { Task } from "@/types/workflow";

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
    
    // Limit cache size
    if (processingCache.size > 50) {
      const firstKey = processingCache.keys().next().value;
      processingCache.delete(firstKey);
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

// Apply transformations to data with better error handling
const applyTransformations = (data: any, transformations: any[]): any => {
  if (!Array.isArray(transformations) || transformations.length === 0) {
    return data;
  }
  
  let processedData = { ...data };
  
  try {
    transformations.forEach(transform => {
      if (!transform || !transform.type) {
        console.warn("Invalid transformation object:", transform);
        return;
      }
      
      console.log(`Applying transformation: ${transform.type}`);
      
      switch (transform.type) {
        case "normalize":
          processedData = normalizeData(processedData, transform.config);
          break;
        case "filter":
          processedData = filterData(processedData, transform.config);
          break;
        case "augment":
          processedData = augmentData(processedData, transform.config);
          break;
        case "aggregate":
          processedData = aggregateData(processedData, transform.config);
          break;
        case "sort":
          processedData = sortData(processedData, transform.config);
          break;
        default:
          console.warn(`Unknown transformation type: ${transform.type}`);
      }
    });
    
    return processedData;
  } catch (error) {
    console.error("Error applying transformations:", error);
    return data; // Return original data on error
  }
};

// Normalize data
const normalizeData = (data: any, config?: any): any => {
  // In a real application, this would implement data normalization logic
  return { ...data, normalized: true };
};

// Filter data
const filterData = (data: any, config?: any): any => {
  // In a real application, this would filter the data based on conditions
  return { ...data, filtered: true };
};

// Augment data
const augmentData = (data: any, config?: any): any => {
  // In a real application, this would add additional data or enrich existing data
  return { ...data, augmented: true };
};

// Aggregate data
const aggregateData = (data: any, config?: any): any => {
  // In a real application, this would perform aggregation operations (sum, avg, etc)
  return { ...data, aggregated: true };
};

// Sort data
const sortData = (data: any, config?: any): any => {
  // In a real application, this would sort data based on specified fields
  return { ...data, sorted: true };
};

// Validate data against rules
const validateData = (data: any, rules: any): any => {
  console.log("Validating data against rules");
  // In a real app this would check data against defined rules
  // For now, we just simulate the validation
  return { ...data, validated: true };
};

// Format data for output with robust error handling
const formatData = (data: any, outputFormat: string = 'json'): any => {
  if (!outputFormat) {
    return data;
  }
  
  try {
    console.log(`Formatting data to: ${outputFormat}`);
    const format = outputFormat.toLowerCase();
    
    switch (format) {
      case "json":
        return typeof data === 'string' ? data : JSON.stringify(data, null, 2);
      case "csv":
        return convertToCSV(data);
      case "xml":
        return convertToXML(data);
      case "text":
      case "txt":
        return typeof data === 'string' ? data : JSON.stringify(data);
      default:
        console.warn(`Unsupported output format: ${format}, returning as-is`);
        return data;
    }
  } catch (error) {
    console.error("Error formatting data:", error);
    return typeof data === 'string' ? data : JSON.stringify(data);
  }
};

// Helper to convert data to CSV format
const convertToCSV = (data: any): string => {
  // Simple CSV conversion simulation
  if (Array.isArray(data)) {
    try {
      // Get headers
      const headers = Object.keys(data[0] || {});
      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            JSON.stringify(row[header] || '')
          ).join(',')
        )
      ];
      return csvRows.join('\n');
    } catch (e) {
      console.error("Error converting to CSV:", e);
      return "data,in,csv,format";
    }
  }
  return "data,in,csv,format";
};

// Helper to convert data to XML format
const convertToXML = (data: any): string => {
  // Simple XML conversion simulation
  const toXML = (obj: any, rootName: string = 'root'): string => {
    if (typeof obj !== 'object' || obj === null) {
      return `<${rootName}>${obj}</${rootName}>`;
    }
    
    if (Array.isArray(obj)) {
      return `<${rootName}>${
        obj.map(item => toXML(item, 'item')).join('')
      }</${rootName}>`;
    }
    
    return `<${rootName}>${
      Object.entries(obj).map(([key, value]) => 
        toXML(value, key)
      ).join('')
    }</${rootName}>`;
  };
  
  try {
    return toXML(data, 'data');
  } catch (e) {
    console.error("Error converting to XML:", e);
    return "<data><error>Failed to convert to XML</error></data>";
  }
};
