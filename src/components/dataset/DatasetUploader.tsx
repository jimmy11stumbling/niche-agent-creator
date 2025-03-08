
import { useState } from "react";
import { FileUploader } from "@/components/ui/file-uploader";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UploadIcon } from "lucide-react";

interface DatasetUploaderProps {
  onUploadComplete: (dataset: any) => void;
}

const DatasetUploader: React.FC<DatasetUploaderProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploading(false);
            onUploadComplete({
              id: Date.now().toString(),
              name: file.name,
              size: file.size,
              type: file.type,
              uploadedAt: new Date().toISOString(),
              content: "Sample dataset content",
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          accept=".csv,.json,.txt,.xlsx"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <UploadIcon className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm font-medium mb-1">
            Drag & drop your dataset file or click to browse
          </p>
          <p className="text-xs text-gray-500">
            Supports CSV, JSON, TXT, and Excel files
          </p>
        </label>
      </div>

      {file && (
        <div className="bg-gray-50 p-3 rounded-md">
          <p className="text-sm font-medium">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024).toFixed(2)} KB - {file.type || "Unknown type"}
          </p>
          
          {uploading && (
            <Progress value={progress} className="h-1 mt-2" />
          )}
          
          <div className="mt-3">
            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Upload Dataset"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatasetUploader;
