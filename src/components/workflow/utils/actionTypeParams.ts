
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
  }
};

export default ACTION_TYPE_PARAMS;
