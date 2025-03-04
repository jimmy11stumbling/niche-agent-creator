
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface ValidationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  validationErrors: string[];
}

const ValidationDialog: React.FC<ValidationDialogProps> = ({
  open,
  onOpenChange,
  validationErrors,
}) => {
  const hasErrors = validationErrors.length > 0;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {!hasErrors ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Workflow Valid
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-5 w-5 text-destructive" />
                Validation Failed
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {!hasErrors ? (
          <div className="py-4">
            <p className="text-sm">Your workflow is valid and ready to run.</p>
          </div>
        ) : (
          <div className="py-4">
            <p className="mb-4 text-sm">
              Please fix the following issues before running your workflow:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ValidationDialog;
