
import { WorkflowTemplate } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";

export const DEFAULT_WORKFLOW = {
  id: uuidv4(),
  name: "New Workflow",
  description: "A new workflow",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  version: "1.0.0",
  tasks: [],
  transitions: [],
};

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "simple-schedule",
    name: "Simple Scheduled Task",
    description: "Run a task on a regular schedule",
    category: "Basic",
    workflow: {
      name: "Simple Scheduled Task",
      description: "Run a task on a regular schedule",
      tasks: [
        {
          id: uuidv4(),
          name: "Daily Schedule",
          type: "Trigger",
          triggerType: "Schedule",
          parameters: {
            cron: "0 9 * * *",
            timezone: "UTC",
          },
          position: { x: 100, y: 100 },
        },
      ],
      transitions: [],
    },
  },
  {
    id: "webhook-handler",
    name: "Webhook Handler",
    description: "Process incoming webhook data",
    category: "Integration",
    workflow: {
      name: "Webhook Handler",
      description: "Process incoming webhook data",
      tasks: [
        {
          id: uuidv4(),
          name: "Webhook Trigger",
          type: "Trigger",
          triggerType: "WebHook",
          parameters: {
            endpoint: "/api/webhook/custom",
            method: "POST",
          },
          position: { x: 100, y: 100 },
        },
      ],
      transitions: [],
    },
  },
  {
    id: "conditional-workflow",
    name: "Conditional Workflow",
    description: "Execute different actions based on conditions",
    category: "Logic",
    workflow: {
      name: "Conditional Workflow",
      description: "Execute different actions based on conditions",
      tasks: [
        {
          id: uuidv4(),
          name: "Start",
          type: "Trigger",
          triggerType: "UserAction",
          parameters: {
            actionType: "button_click",
          },
          position: { x: 100, y: 100 },
        },
        {
          id: uuidv4(),
          name: "Check Value",
          type: "Condition",
          conditionLogic: "value > 100",
          position: { x: 300, y: 100 },
        },
        {
          id: uuidv4(),
          name: "High Value Action",
          type: "Action",
          actionType: "Notification",
          parameters: {
            message: "High value detected!",
            type: "warning",
          },
          position: { x: 500, y: 50 },
        },
        {
          id: uuidv4(),
          name: "Low Value Action",
          type: "Action",
          actionType: "Notification",
          parameters: {
            message: "Normal value.",
            type: "info",
          },
          position: { x: 500, y: 150 },
        },
      ],
      transitions: [],
    },
  },
  {
    id: "data-processing-template",
    name: "Data Processing Pipeline",
    description: "Process and transform data from various sources",
    category: "Data",
    workflow: {
      name: "Data Processing Pipeline",
      description: "Process and transform data from various sources",
      tasks: [
        {
          id: uuidv4(),
          name: "Data Source Trigger",
          type: "Trigger",
          triggerType: "Event",
          parameters: {
            eventType: "data.new",
          },
          position: { x: 100, y: 100 },
        },
        {
          id: uuidv4(),
          name: "Process Data",
          type: "Action",
          actionType: "DataProcessing",
          parameters: {
            dataSource: "event.data",
            transformations: [
              { type: "normalize" }
            ],
            outputFormat: "json",
            validation: true,
            validationRules: {
              schema: {
                required: ["id", "name"],
                properties: {
                  id: { type: "string" },
                  name: { type: "string" }
                }
              }
            }
          },
          position: { x: 300, y: 100 },
        },
        {
          id: uuidv4(),
          name: "Data Validation",
          type: "Condition",
          conditionLogic: "data.validated === true",
          position: { x: 500, y: 100 },
        }
      ],
      transitions: [],
    },
  },
];
