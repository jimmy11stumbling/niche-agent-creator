
import React from "react";
import { Transition } from "@/types/workflow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TransitionDialogProps {
  transition: Transition | null;
  onSave: () => void;
  onCancel: () => void;
  updateTransition: (transition: Transition) => void;
  sourceTaskName: string;
  targetTaskName: string;
}

const TransitionDialog: React.FC<TransitionDialogProps> = ({
  transition,
  onSave,
  onCancel,
  updateTransition,
  sourceTaskName,
  targetTaskName,
}) => {
  if (!transition) return null;

  return (
    <Dialog open={transition !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Transition</DialogTitle>
          <DialogDescription>
            Modify the properties of the selected transition
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-2 space-y-4">
          <div>
            <Label>Source Task</Label>
            <div className="p-2 border rounded bg-muted text-sm">
              {sourceTaskName || "Unknown"}
            </div>
          </div>
          
          <div>
            <Label>Target Task</Label>
            <div className="p-2 border rounded bg-muted text-sm">
              {targetTaskName || "Unknown"}
            </div>
          </div>
          
          <div>
            <Label htmlFor="condition">Condition (Optional)</Label>
            <Textarea
              id="condition"
              value={transition.condition || ""}
              onChange={(e) =>
                updateTransition({
                  ...transition,
                  condition: e.target.value,
                })
              }
              placeholder="JavaScript expression, e.g., data.status === 'success'"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Leave empty for unconditional execution
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransitionDialog;
