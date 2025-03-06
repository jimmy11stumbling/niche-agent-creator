
// Action type parameters used in the workflow editor
// This defines the parameters needed for different action types

export const ACTION_TYPE_PARAMS = {
  HTTP: {
    url: "",
    method: "GET",
    headers: {},
    body: ""
  },
  HttpRequest: {
    url: "",
    method: "GET",
    headers: {},
    body: ""
  },
  ScriptExecution: {
    script: "",
    timeout: 30000,
    arguments: []
  },
  DataProcessing: {
    dataSource: "csv",
    dataPath: "",
    transformations: [],
    outputFormat: "json",
    validation: false,
    validationRules: ""
  },
  EmailSending: {
    to: "",
    subject: "",
    body: "",
    attachments: []
  },
  DatabaseOperation: {
    operation: "query",
    query: "",
    parameters: {}
  },
  WebhookTrigger: {
    endpoint: "",
    method: "POST",
    authentication: {}
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
  MessageQueue: {
    queueType: "rabbitmq",
    connectionString: "",
    queueName: "",
    message: "",
    messageType: "json"
  },
  FileOperation: {
    operation: "read",
    filePath: "",
    encoding: "utf8",
    content: ""
  }
};

export default ACTION_TYPE_PARAMS;
