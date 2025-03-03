
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {validationErrors.length === 0 ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Workflow Valid
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Validation Issues
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {validationErrors.length === 0 ? (
          <div className="py-4">
            <p>Your workflow is valid and ready to run.</p>
          </div>
        ) : (
          <div className="py-4">
            <p className="mb-4">
              Please fix the following issues before running your workflow:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index} className="text-sm text-destructive">
                  {error}
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
