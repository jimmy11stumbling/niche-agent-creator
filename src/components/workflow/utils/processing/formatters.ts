
// Helper functions for data formatting to make processing.ts smaller

// Helper to convert data to CSV format
export const convertToCSV = (data: any): string => {
  // Simple CSV conversion simulation
  if (Array.isArray(data)) {
    try {
      // Get headers from first object or return empty for empty array
      if (data.length === 0) return "";
      
      // Get all unique headers across all objects in the array
      const headers = Array.from(
        new Set(
          data.flatMap(obj => Object.keys(obj))
        )
      );
      
      // Create CSV rows
      const csvRows = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => {
            const cell = row[header] ?? '';
            // Quote strings with commas and escape quotes
            if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
              return `"${cell.replace(/"/g, '""')}"`;
            }
            return cell;
          }).join(',')
        )
      ];
      return csvRows.join('\n');
    } catch (e) {
      console.error("Error converting to CSV:", e);
      return "error,converting,to,csv";
    }
  } else if (typeof data === 'object' && data !== null) {
    // Handle single object
    try {
      const headers = Object.keys(data);
      const values = headers.map(h => {
        const cell = data[h];
        if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      
      return `${headers.join(',')}\n${values.join(',')}`;
    } catch (e) {
      console.error("Error converting object to CSV:", e);
      return "error,converting,to,csv";
    }
  }
  
  return "data,in,csv,format";
};

// Helper to convert data to XML format
export const convertToXML = (data: any): string => {
  // XML conversion
  const toXML = (obj: any, rootName: string = 'root'): string => {
    if (obj === null) {
      return `<${rootName} />`;
    }
    
    if (obj === undefined) {
      return `<${rootName} />`;
    }
    
    if (typeof obj !== 'object') {
      return `<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
    }
    
    if (Array.isArray(obj)) {
      return `<${rootName}>${
        obj.map((item, index) => toXML(item, 'item')).join('')
      }</${rootName}>`;
    }
    
    return `<${rootName}>${
      Object.entries(obj).map(([key, value]) => {
        // Create valid XML element name
        const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
        return toXML(value, safeKey);
      }).join('')
    }</${rootName}>`;
  };
  
  try {
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + toXML(data, 'data');
  } catch (e) {
    console.error("Error converting to XML:", e);
    return '<data><error>Failed to convert to XML</error></data>';
  }
};

// Escape XML special characters
const escapeXml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Format data for output with robust error handling
export const formatData = (data: any, outputFormat: string = 'json'): any => {
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
