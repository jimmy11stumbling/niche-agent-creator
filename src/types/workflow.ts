
export type TaskType = "Action" | "Condition" | "Trigger" | "SubWorkflow";
export type ActionType = "HttpRequest" | "DatabaseOperation" | "MessageQueue" | "ScriptExecution" | "DataProcessing" | "DummyAction";

export interface RetryPolicy {
  attempts: number;
  backoffStrategy: "fixed" | "exponential" | "linear";
  initialInterval: number; // in milliseconds
}

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  actionType?: ActionType;
  conditionLogic?: string;
  subWorkflowId?: string;
  parameters: Record<string, any>;
  dependencies: string[];
  retryPolicy?: RetryPolicy;
  timeout?: number; // in milliseconds
  position: { x: number; y: number };
}

export interface Transition {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  condition?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  tasks: Task[];
  transitions: Transition[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  workflowVersion: number;
  status: "Running" | "Completed" | "Failed" | "Cancelled";
  startTime: string;
  endTime?: string;
  tasks: {
    taskId: string;
    status: "Pending" | "Running" | "Completed" | "Failed" | "Skipped";
    startTime?: string;
    endTime?: string;
    error?: string;
  }[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Workflow;
}
