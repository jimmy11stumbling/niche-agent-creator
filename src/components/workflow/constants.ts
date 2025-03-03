
import { ActionType, TaskType } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";

// Default workflow template
export const DEFAULT_WORKFLOW = {
  id: uuidv4(),
  name: "New Workflow",
  description: "Workflow description",
  tasks: [],
  transitions: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: 1,
};

// Task templates for different task types
export const TASK_TEMPLATES: Record<TaskType, Partial<any>> = {
  "Trigger": {
    type: "Trigger",
    parameters: { schedule: "0 0 * * *" }, // Daily at midnight
    dependencies: [],
  },
  "Action": {
    type: "Action",
    actionType: "HttpRequest",
    parameters: { url: "", method: "GET" },
    dependencies: [],
  },
  "Condition": {
    type: "Condition",
    conditionLogic: "data.value > 10",
    parameters: {},
    dependencies: [],
  },
  "SubWorkflow": {
    type: "SubWorkflow",
    subWorkflowId: "",
    parameters: {},
    dependencies: [],
  },
};

// Action type specific parameters
export const ACTION_TYPE_PARAMS: Record<ActionType, Record<string, any>> = {
  "HttpRequest": { url: "", method: "GET", headers: {}, body: "" },
  "DatabaseOperation": { operation: "query", query: "", parameters: {} },
  "MessageQueue": { queue: "", message: "" },
  "ScriptExecution": { script: "", args: [] },
  "DummyAction": { delayMs: 1000, result: "success" },
};

// Template gallery with predefined workflows
export const WORKFLOW_TEMPLATES = [
  {
    id: "scheduled-http-request",
    name: "Scheduled HTTP Request",
    description: "Regularly fetch data from an API",
    category: "Data Integration",
    workflow: {
      id: uuidv4(),
      name: "Scheduled API Fetch",
      description: "Fetch data from an API on a schedule",
      tasks: [
        {
          id: uuidv4(),
          name: "Daily Trigger",
          type: "Trigger" as TaskType,
          parameters: { schedule: "0 9 * * *" },
          dependencies: [],
          position: { x: 100, y: 100 },
        },
        {
          id: uuidv4(),
          name: "Fetch Data",
          type: "Action" as TaskType,
          actionType: "HttpRequest" as ActionType,
          parameters: { url: "https://api.example.com/data", method: "GET" },
          dependencies: [],
          position: { x: 300, y: 100 },
        },
      ],
      transitions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  },
  {
    id: "conditional-execution",
    name: "Conditional Execution",
    description: "Execute different paths based on conditions",
    category: "Process Automation",
    workflow: {
      id: uuidv4(),
      name: "Conditional Workflow",
      description: "Branch execution based on conditions",
      tasks: [
        {
          id: uuidv4(),
          name: "Start",
          type: "Trigger" as TaskType,
          parameters: { schedule: "manual" },
          dependencies: [],
          position: { x: 100, y: 150 },
        },
        {
          id: uuidv4(),
          name: "Check Value",
          type: "Condition" as TaskType,
          conditionLogic: "data.value > 100",
          parameters: {},
          dependencies: [],
          position: { x: 300, y: 150 },
        },
        {
          id: uuidv4(),
          name: "High Value Action",
          type: "Action" as TaskType,
          actionType: "DummyAction" as ActionType,
          parameters: { result: "high_value_processed" },
          dependencies: [],
          position: { x: 500, y: 50 },
        },
        {
          id: uuidv4(),
          name: "Low Value Action",
          type: "Action" as TaskType,
          actionType: "DummyAction" as ActionType,
          parameters: { result: "low_value_processed" },
          dependencies: [],
          position: { x: 500, y: 250 },
        },
      ],
      transitions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
    },
  },
];
