
import * as React from "react";
import { cn } from "@/lib/utils";

interface FileUploaderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFilesSelected?: (files: FileList | null) => void;
  className?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
}

const FileUploader = React.forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ className, onFilesSelected, maxSize, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && maxSize) {
        // Check if any file exceeds the max size
        for (let i = 0; i < files.length; i++) {
          if (files[i].size > maxSize) {
            alert(`File ${files[i].name} exceeds the maximum size of ${maxSize / 1024 / 1024}MB`);
            e.target.value = "";
            return;
          }
        }
      }
      onFilesSelected?.(files);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        if (props.multiple === false && e.dataTransfer.files.length > 1) {
          alert("Only one file is allowed");
          return;
        }
        
        if (maxSize) {
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            if (e.dataTransfer.files[i].size > maxSize) {
              alert(`File ${e.dataTransfer.files[i].name} exceeds the maximum size of ${maxSize / 1024 / 1024}MB`);
              return;
            }
          }
        }
        
        onFilesSelected?.(e.dataTransfer.files);
        
        // Update the input's files
        if (inputRef.current) {
          // Create a DataTransfer object to set the files property of the input
          const dataTransfer = new DataTransfer();
          for (let i = 0; i < e.dataTransfer.files.length; i++) {
            dataTransfer.items.add(e.dataTransfer.files[i]);
          }
          inputRef.current.files = dataTransfer.files;
        }
      }
    };

    return (
      <div
        className={cn(
          "relative",
          dragActive ? "border-primary" : "border-input",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          className="sr-only"
          onChange={handleChange}
          ref={(el) => {
            // Handle both the forwarded ref and the local ref
            if (typeof ref === "function") {
              ref(el);
            } else if (ref) {
              ref.current = el;
            }
            inputRef.current = el;
          }}
          {...props}
        />
      </div>
    );
  }
);

FileUploader.displayName = "FileUploader";

export { FileUploader };
