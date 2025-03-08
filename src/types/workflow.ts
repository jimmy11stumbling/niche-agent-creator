
export type Workflow = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  version?: string;
  tasks: Task[];
  transitions: Transition[];
};

export type Position = {
  x: number;
  y: number;
};

export type Task = {
  id: string;
  name: string;
  type: TaskType;
  position: Position;
  actionType?: ActionType;
  triggerType?: TriggerType;
  conditionLogic?: string;
  parameters?: Record<string, any>;
};

export type Transition = {
  id: string;
  sourceTaskId: string;
  targetTaskId: string;
  condition?: string;
};

export type TaskType = "Trigger" | "Action" | "Condition" | "SubWorkflow";

export type ActionType = 
  | "HTTP" 
  | "Email" 
  | "DataProcessing" 
  | "Notification" 
  | "Custom"
  | "HttpRequest"
  | "DatabaseOperation"
  | "MessageQueue"
  | "ScriptExecution"
  | "DummyAction"
  | "WebCrawling"  
  | "AICompletion"
  | "FileOperation";

export type TriggerType = "Schedule" | "WebHook" | "Event" | "UserAction";

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  category: string;
  workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">;
};

export type SavedWorkflow = {
  id: string;
  name: string;
  description: string;
  updatedAt: string;
  taskCount: number;
  category: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: string[];
};

export type DataTransformation = {
  type: string;
  config?: Record<string, any>;
};

export type DataProcessingParams = {
  dataSource: string;
  transformations?: DataTransformation[];
  outputFormat: string;
  validation?: boolean;
  validationRules?: Record<string, any>;
};
