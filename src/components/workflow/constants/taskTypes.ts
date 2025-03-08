
import { TaskType } from "@/types/workflow";

export const TASK_TYPES: TaskType[] = ["Trigger", "Action", "Condition", "SubWorkflow"];

export const DEFAULT_TASK_NAME: Record<TaskType, string> = {
  Trigger: "New Trigger",
  Action: "New Action",
  Condition: "New Condition",
  SubWorkflow: "New Sub-Workflow",
};

// Templates for each task type
export const TASK_TEMPLATES: Record<string, any> = {
  Trigger: {
    type: "Trigger",
    triggerType: "Schedule",
    parameters: {
      schedule: "0 0 * * *",
    },
  },
  Action: {
    type: "Action",
    actionType: "HTTP",
    parameters: {
      method: "GET",
      url: "https://api.example.com/data",
      headers: {},
    },
  },
  DataProcessing: {
    type: "Action",
    actionType: "DataProcessing",
    parameters: {
      dataSource: "file://uploads/data.csv",
      transformations: [],
      outputFormat: "json",
      validation: false,
      validationRules: {}
    },
  },
  Condition: {
    type: "Condition",
    conditionLogic: "data.value > 0",
  },
  SubWorkflow: {
    type: "SubWorkflow",
    parameters: {
      workflowId: "",
    },
  },
};
