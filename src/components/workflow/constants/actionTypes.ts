
import { ActionType } from "@/types/workflow";

export const ACTION_TYPES: ActionType[] = [
  "HTTP", 
  "Email", 
  "DataProcessing", 
  "Notification", 
  "Custom", 
  "HttpRequest", 
  "DatabaseOperation", 
  "MessageQueue", 
  "ScriptExecution", 
  "DummyAction",
  "WebCrawling",
  "AICompletion",
  "FileOperation"
];

export const ACTION_TYPE_PARAMS: Record<ActionType, Record<string, any>> = {
  HTTP: {
    method: "GET",
    url: "https://api.example.com/data",
    headers: {},
  },
  Email: {
    to: "",
    subject: "",
    body: "",
  },
  DataProcessing: {
    dataSource: "file://uploads/data.csv",
    transformations: [],
    outputFormat: "json",
    validation: false,
    validationRules: {}
  },
  Notification: {
    message: "",
    type: "info",
  },
  Custom: {},
  HttpRequest: {
    method: "GET",
    url: "https://api.example.com/endpoint",
    headers: {}
  },
  DatabaseOperation: {
    operation: "query",
    query: "SELECT * FROM table"
  },
  MessageQueue: {
    queueName: "default",
    message: {}
  },
  ScriptExecution: {
    script: "console.log('Hello, World!');"
  },
  DummyAction: {
    description: "This is a dummy action for testing"
  },
  WebCrawling: {
    url: "https://example.com",
    depth: 2,
    followLinks: false,
    maxPages: 10,
    excludePatterns: "",
    outputFormat: "json",
    extractRules: ""
  },
  AICompletion: {
    model: "gpt-4-turbo",
    prompt: "",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0
  },
  FileOperation: {
    operation: "read",
    filePath: "",
    encoding: "utf8",
    content: ""
  }
};
