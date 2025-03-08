
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileIcon, MoreHorizontalIcon, TrashIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Dataset {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

interface DatasetListProps {
  onSelect: (dataset: Dataset) => void;
}

const DatasetList: React.FC<DatasetListProps> = ({ onSelect }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading datasets from storage
    const loadSavedDatasets = () => {
      const savedDatasets = localStorage.getItem("datasets");
      if (savedDatasets) {
        try {
          setDatasets(JSON.parse(savedDatasets));
        } catch (error) {
          console.error("Error parsing saved datasets:", error);
          setDatasets([]);
        }
      } else {
        // Create sample datasets for demo
        const sampleDatasets: Dataset[] = [
          {
            id: "ds-1",
            name: "customer_feedback.csv",
            size: 1024 * 25,
            type: "text/csv",
            uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: "ds-2",
            name: "product_reviews.json",
            size: 1024 * 87,
            type: "application/json",
            uploadedAt: new Date(Date.now() - 86400000).toISOString(),
          },
          {
            id: "ds-3",
            name: "support_tickets.xlsx",
            size: 1024 * 156,
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            uploadedAt: new Date().toISOString(),
          },
        ];
        
        setDatasets(sampleDatasets);
        localStorage.setItem("datasets", JSON.stringify(sampleDatasets));
      }
      setLoading(false);
    };

    loadSavedDatasets();
  }, []);

  const handleDelete = (id: string) => {
    const updatedDatasets = datasets.filter(dataset => dataset.id !== id);
    setDatasets(updatedDatasets);
    localStorage.setItem("datasets", JSON.stringify(updatedDatasets));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        <span className="ml-2">Loading datasets...</span>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-md">
        <FileIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No datasets available. Upload a new dataset to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {datasets.map((dataset) => (
        <div 
          key={dataset.id}
          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileIcon className="h-10 w-10 text-primary/70" />
            <div>
              <p className="font-medium text-sm">{dataset.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(dataset.size)} • {formatDate(dataset.uploadedAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onSelect(dataset)}
            >
              Select
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontalIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleDelete(dataset.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DatasetList;
