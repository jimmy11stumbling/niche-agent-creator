
// Helper functions for data transformations to make processing.ts smaller

// Normalize data
export const normalizeData = (data: any, config?: any): any => {
  try {
    if (Array.isArray(data)) {
      // If data is an array, normalize each item
      return data.map(item => normalizeObject(item, config));
    } else if (typeof data === 'object' && data !== null) {
      // If data is an object, normalize it
      return normalizeObject(data, config);
    }
    // Return data as is if it's not an object or array
    return data;
  } catch (error) {
    console.error("Error normalizing data:", error);
    return { ...data, normalized: true, error: "Normalization failed" };
  }
};

// Helper for normalizing an object
const normalizeObject = (obj: any, config?: any): any => {
  // Default implementation - in a real app this would properly normalize fields
  const result: Record<string, any> = {};
  
  // Convert all keys to lowercase (or apply other normalization rules from config)
  Object.keys(obj).forEach(key => {
    const normalizedKey = config?.keyCasing === 'lowercase' 
      ? key.toLowerCase() 
      : key;
      
    result[normalizedKey] = obj[key];
  });
  
  return { ...result, normalized: true };
};

// Filter data
export const filterData = (data: any, config?: any): any => {
  try {
    if (!config || !config.conditions) {
      return data; // No conditions to filter by
    }
    
    if (Array.isArray(data)) {
      // Apply filter to array data
      return data.filter(item => matchesConditions(item, config.conditions));
    }
    
    // For single objects, return if it matches conditions, otherwise empty object
    return matchesConditions(data, config.conditions) ? data : {};
  } catch (error) {
    console.error("Error filtering data:", error);
    return data; // Return original on error
  }
};

// Helper to check if an item matches filter conditions
const matchesConditions = (item: any, conditions: any[]): boolean => {
  // This is a simple implementation - a real one would handle complex conditions
  return conditions.every(condition => {
    const { field, operator, value } = condition;
    if (!field || !operator) return true;
    
    const fieldValue = item[field];
    
    switch (operator) {
      case 'equals': return fieldValue === value;
      case 'notEquals': return fieldValue !== value;
      case 'contains': return String(fieldValue).includes(value);
      case 'greaterThan': return fieldValue > value;
      case 'lessThan': return fieldValue < value;
      default: return true;
    }
  });
};

// Augment data
export const augmentData = (data: any, config?: any): any => {
  try {
    if (!config || !config.fields) {
      return { ...data, augmented: true };
    }
    
    if (Array.isArray(data)) {
      // Augment each item in array
      return data.map(item => {
        const augmentedItem = { ...item };
        config.fields.forEach((field: any) => {
          if (field.name && field.value !== undefined) {
            augmentedItem[field.name] = field.value;
          }
        });
        return { ...augmentedItem, augmented: true };
      });
    }
    
    // Augment single object
    const augmentedData = { ...data };
    config.fields.forEach((field: any) => {
      if (field.name && field.value !== undefined) {
        augmentedData[field.name] = field.value;
      }
    });
    
    return { ...augmentedData, augmented: true };
  } catch (error) {
    console.error("Error augmenting data:", error);
    return { ...data, augmented: true, error: "Augmentation failed" };
  }
};

// Aggregate data
export const aggregateData = (data: any, config?: any): any => {
  try {
    if (!Array.isArray(data)) {
      return data; // Only arrays can be aggregated
    }
    
    if (!config || !config.operations) {
      return { aggregated: true, count: data.length };
    }
    
    const result: Record<string, any> = { 
      aggregated: true,
      count: data.length 
    };
    
    config.operations.forEach((op: any) => {
      if (!op.field || !op.type) return;
      
      const field = op.field;
      const outputName = op.outputName || `${op.type}_${field}`;
      
      switch (op.type) {
        case 'sum':
          result[outputName] = data.reduce(
            (sum, item) => sum + (Number(item[field]) || 0), 
            0
          );
          break;
        case 'avg':
          result[outputName] = data.length ? 
            data.reduce((sum, item) => sum + (Number(item[field]) || 0), 0) / data.length : 
            0;
          break;
        case 'min':
          result[outputName] = data.length ? 
            Math.min(...data.map(item => Number(item[field]) || 0)) : 
            null;
          break;
        case 'max':
          result[outputName] = data.length ? 
            Math.max(...data.map(item => Number(item[field]) || 0)) : 
            null;
          break;
        case 'concat':
          result[outputName] = data.map(item => item[field]).join(op.separator || ',');
          break;
      }
    });
    
    return result;
  } catch (error) {
    console.error("Error aggregating data:", error);
    return { aggregated: true, error: "Aggregation failed", count: Array.isArray(data) ? data.length : 0 };
  }
};

// Sort data
export const sortData = (data: any, config?: any): any => {
  try {
    if (!Array.isArray(data)) {
      return data; // Only arrays can be sorted
    }
    
    if (!config || !config.field) {
      return [...data]; // No sort config
    }
    
    const { field, direction = 'asc' } = config;
    
    return [...data].sort((a, b) => {
      if (a[field] === undefined && b[field] === undefined) return 0;
      if (a[field] === undefined) return 1;
      if (b[field] === undefined) return -1;
      
      const valueA = a[field];
      const valueB = b[field];
      
      // Compare based on type
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return direction === 'asc' ? 
          valueA.localeCompare(valueB) : 
          valueB.localeCompare(valueA);
      }
      
      // For numbers and other types
      return direction === 'asc' ? 
        (valueA > valueB ? 1 : -1) : 
        (valueA < valueB ? 1 : -1);
    });
  } catch (error) {
    console.error("Error sorting data:", error);
    return data; // Return original on error
  }
};

// Apply multiple transformations
export const applyTransformations = (data: any, transformations: any[]): any => {
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
