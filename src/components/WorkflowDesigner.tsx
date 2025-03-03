
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import { Task, Workflow, Transition, TaskType, ActionType } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";
import { 
  Plus, Save, Play, Trash2, Settings, ArrowRight, Check, Copy, 
  FileDown, FileUp, AlertTriangle, CheckCircle, ZapIcon, AlertCircle, XCircle 
} from "lucide-react";

// Default workflow template
const DEFAULT_WORKFLOW: Workflow = {
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
const TASK_TEMPLATES: Record<TaskType, Partial<Task>> = {
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
const ACTION_TYPE_PARAMS: Record<ActionType, Record<string, any>> = {
  "HttpRequest": { url: "", method: "GET", headers: {}, body: "" },
  "DatabaseOperation": { operation: "query", query: "", parameters: {} },
  "MessageQueue": { queue: "", message: "" },
  "ScriptExecution": { script: "", args: [] },
  "DummyAction": { delayMs: 1000, result: "success" },
};

interface TaskNodeProps {
  task: Task;
  selected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
}

// TaskNode component for visual representation of tasks
const TaskNode: React.FC<TaskNodeProps> = ({ task, selected, onSelect, onMove }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Get the background color based on task type
  const getBackgroundColor = () => {
    switch (task.type) {
      case "Trigger":
        return "bg-blue-100 border-blue-300";
      case "Action":
        return "bg-green-100 border-green-300";
      case "Condition":
        return "bg-amber-100 border-amber-300";
      case "SubWorkflow":
        return "bg-purple-100 border-purple-300";
      default:
        return "bg-slate-100 border-slate-300";
    }
  };

  // Get the icon based on task type
  const getIcon = () => {
    switch (task.type) {
      case "Trigger":
        return <ZapIcon className="h-4 w-4 text-blue-600" />;
      case "Action":
        return <Play className="h-4 w-4 text-green-600" />;
      case "Condition":
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      case "SubWorkflow":
        return <Copy className="h-4 w-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (nodeRef.current) {
      setDragging(true);
      const rect = nodeRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      onSelect(task.id);
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging && nodeRef.current) {
      const canvas = nodeRef.current.parentElement;
      if (canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const newX = e.clientX - canvasRect.left - offset.x;
        const newY = e.clientY - canvasRect.top - offset.y;
        
        onMove(task.id, { x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  return (
    <div
      ref={nodeRef}
      className={`absolute p-3 rounded-lg cursor-grab shadow-sm border ${getBackgroundColor()} ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      style={{
        left: `${task.position.x}px`,
        top: `${task.position.y}px`,
        minWidth: "160px",
      }}
      onMouseDown={handleMouseDown}
      onClick={() => onSelect(task.id)}
    >
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="font-medium text-sm">{task.name}</span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">{task.type}</div>
    </div>
  );
};

interface TransitionLineProps {
  sourceTask: Task;
  targetTask: Task;
  condition?: string;
  selected: boolean;
}

// TransitionLine component for visualizing connections between tasks
const TransitionLine: React.FC<TransitionLineProps> = ({
  sourceTask,
  targetTask,
  condition,
  selected,
}) => {
  // Calculate the center points of the tasks
  const sourceCenter = {
    x: sourceTask.position.x + 80, // Assuming task width is approximately 160px
    y: sourceTask.position.y + 30, // Assuming task height is approximately 60px
  };
  
  const targetCenter = {
    x: targetTask.position.x + 80,
    y: targetTask.position.y + 30,
  };

  // Calculate the path for a curved line
  const midX = (sourceCenter.x + targetCenter.x) / 2;
  const midY = (sourceCenter.y + targetCenter.y) / 2;
  
  const path = `M ${sourceCenter.x} ${sourceCenter.y} Q ${midX + 30} ${midY} ${targetCenter.x} ${targetCenter.y}`;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={selected ? "#0284c7" : "#94a3b8"}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray={condition ? "5,5" : undefined}
      />
      <polygon
        points={`${targetCenter.x},${targetCenter.y} ${targetCenter.x - 6},${targetCenter.y - 4} ${targetCenter.x - 6},${targetCenter.y + 4}`}
        fill={selected ? "#0284c7" : "#94a3b8"}
        transform={`rotate(${Math.atan2(
          targetCenter.y - midY,
          targetCenter.x - midX
        ) * (180 / Math.PI)}, ${targetCenter.x}, ${targetCenter.y})`}
      />
      
      {condition && (
        <text
          x={midX}
          y={midY - 10}
          textAnchor="middle"
          fill="#6b7280"
          fontSize="10"
          fontFamily="sans-serif"
          className="select-none"
        >
          {condition.length > 20 ? condition.substring(0, 20) + "..." : condition}
        </text>
      )}
    </g>
  );
};

interface WorkflowDesignerProps {
  workflowId?: string;
}

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflowId }) => {
  const [workflow, setWorkflow] = useState<Workflow>(DEFAULT_WORKFLOW);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedTransitionId, setSelectedTransitionId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [connectingSourceId, setConnectingSourceId] = useState<string | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState<{
    sourceId: string;
    targetPos: { x: number; y: number };
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationDialog, setShowValidationDialog] = useState<boolean>(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<Task | null>(null);
  const [transitionBeingEdited, setTransitionBeingEdited] = useState<Transition | null>(null);
  const [savedWorkflows, setSavedWorkflows] = useState<Workflow[]>([]);
  const [activeTab, setActiveTab] = useState<string>("editor");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Template gallery with predefined workflows
  const workflowTemplates = [
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

  // Mock function to fetch workflow
  const fetchWorkflow = async (id: string): Promise<Workflow> => {
    // In a real app, this would be an API call
    const savedWorkflowsString = localStorage.getItem("workflows");
    const savedWorkflows = savedWorkflowsString
      ? JSON.parse(savedWorkflowsString)
      : [];

    const foundWorkflow = savedWorkflows.find((w: Workflow) => w.id === id);
    if (foundWorkflow) {
      return foundWorkflow;
    }

    throw new Error("Workflow not found");
  };

  // Setup query to fetch workflow if ID is provided
  const { data: fetchedWorkflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => workflowId ? fetchWorkflow(workflowId) : Promise.resolve(null),
    enabled: !!workflowId,
  });

  // Update workflow when fetched data changes
  useEffect(() => {
    if (fetchedWorkflow) {
      setWorkflow(fetchedWorkflow);
    }
  }, [fetchedWorkflow]);

  // Load saved workflows
  useEffect(() => {
    const savedWorkflowsString = localStorage.getItem("workflows");
    if (savedWorkflowsString) {
      try {
        const parsed = JSON.parse(savedWorkflowsString);
        setSavedWorkflows(parsed);
      } catch (e) {
        console.error("Error parsing saved workflows:", e);
      }
    }
  }, []);

  // Helper to find a task by ID
  const getTaskById = (id: string) => {
    return workflow.tasks.find((task) => task.id === id) || null;
  };

  // Add a new task to the workflow
  const handleAddTask = (type: TaskType) => {
    const newTaskId = uuidv4();
    const centerX = canvasRef.current ? canvasRef.current.clientWidth / 2 - 80 : 300;
    const centerY = canvasRef.current ? canvasRef.current.clientHeight / 2 - 30 : 200;
    
    const newTask: Task = {
      id: newTaskId,
      name: `New ${type}`,
      ...TASK_TEMPLATES[type],
      position: { x: centerX, y: centerY },
    } as Task;
    
    setWorkflow((prev) => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      updatedAt: new Date().toISOString(),
    }));
    
    setSelectedTaskId(newTaskId);
    setIsDirty(true);
    
    toast({
      title: "Task Added",
      description: `Added a new ${type} task to the workflow`,
    });
  };

  // Start creating a connection between tasks
  const handleStartConnecting = (sourceId: string) => {
    setConnecting(true);
    setConnectingSourceId(sourceId);
  };

  // Update the position of a connection in progress
  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (connecting && connectingSourceId && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setConnectionInProgress({
        sourceId: connectingSourceId,
        targetPos: { x, y },
      });
    }
  };

  // Complete a connection between tasks
  const handleCanvasClick = (e: React.MouseEvent) => {
    // If not connecting or a task is already selected, do nothing
    if (!connecting || !connectingSourceId) {
      if (!selectedTaskId && !selectedTransitionId) {
        // Deselect everything when clicking on the canvas
        setSelectedTaskId(null);
        setSelectedTransitionId(null);
      }
      return;
    }
    
    setConnecting(false);
    setConnectionInProgress(null);
    setConnectingSourceId(null);
  };

  // Create a connection when a task is clicked while connecting
  const handleTaskSelectWhileConnecting = (targetId: string) => {
    if (connecting && connectingSourceId) {
      // Check if connection already exists
      const existingConnection = workflow.transitions.find(
        (t) => t.sourceTaskId === connectingSourceId && t.targetTaskId === targetId
      );
      
      if (existingConnection) {
        toast({
          title: "Connection Exists",
          description: "This connection already exists",
          variant: "destructive",
        });
        return;
      }
      
      // Check if it's the same task
      if (connectingSourceId === targetId) {
        toast({
          title: "Invalid Connection",
          description: "Cannot connect a task to itself",
          variant: "destructive",
        });
        return;
      }
      
      const newTransitionId = uuidv4();
      const newTransition: Transition = {
        id: newTransitionId,
        sourceTaskId: connectingSourceId,
        targetTaskId: targetId,
      };
      
      setWorkflow((prev) => ({
        ...prev,
        transitions: [...prev.transitions, newTransition],
        updatedAt: new Date().toISOString(),
      }));
      
      setSelectedTransitionId(newTransitionId);
      setIsDirty(true);
      
      toast({
        title: "Connection Created",
        description: "Tasks connected successfully",
      });
    }
    
    // End connecting mode
    setConnecting(false);
    setConnectionInProgress(null);
    setConnectingSourceId(null);
  };

  // Handle task selection
  const handleTaskSelect = (id: string) => {
    if (connecting && connectingSourceId) {
      handleTaskSelectWhileConnecting(id);
    } else {
      setSelectedTaskId(id);
      setSelectedTransitionId(null);
    }
  };

  // Handle transition selection
  const handleTransitionSelect = (id: string) => {
    setSelectedTransitionId(id);
    setSelectedTaskId(null);
  };

  // Move a task to a new position
  const handleTaskMove = (id: string, position: { x: number; y: number }) => {
    setWorkflow((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, position } : task
      ),
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  };

  // Delete a selected task
  const handleDeleteTask = () => {
    if (selectedTaskId) {
      // First, remove all transitions connected to this task
      const filteredTransitions = workflow.transitions.filter(
        (t) => t.sourceTaskId !== selectedTaskId && t.targetTaskId !== selectedTaskId
      );
      
      setWorkflow((prev) => ({
        ...prev,
        tasks: prev.tasks.filter((task) => task.id !== selectedTaskId),
        transitions: filteredTransitions,
        updatedAt: new Date().toISOString(),
      }));
      
      setSelectedTaskId(null);
      setIsDirty(true);
      
      toast({
        title: "Task Deleted",
        description: "Task and its connections removed",
      });
    }
  };

  // Delete a selected transition
  const handleDeleteTransition = () => {
    if (selectedTransitionId) {
      setWorkflow((prev) => ({
        ...prev,
        transitions: prev.transitions.filter((t) => t.id !== selectedTransitionId),
        updatedAt: new Date().toISOString(),
      }));
      
      setSelectedTransitionId(null);
      setIsDirty(true);
      
      toast({
        title: "Connection Deleted",
        description: "Connection between tasks removed",
      });
    }
  };

  // Save the workflow
  const handleSaveWorkflow = () => {
    const existingWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
    
    const workflowToSave = {
      ...workflow,
      updatedAt: new Date().toISOString(),
    };
    
    let updatedWorkflows;
    
    // Check if workflow already exists
    const existingIndex = existingWorkflows.findIndex((w: Workflow) => w.id === workflow.id);
    
    if (existingIndex !== -1) {
      // Update existing workflow
      updatedWorkflows = [...existingWorkflows];
      updatedWorkflows[existingIndex] = workflowToSave;
    } else {
      // Add new workflow
      updatedWorkflows = [...existingWorkflows, workflowToSave];
    }
    
    localStorage.setItem("workflows", JSON.stringify(updatedWorkflows));
    setSavedWorkflows(updatedWorkflows);
    setIsDirty(false);
    
    toast({
      title: "Workflow Saved",
      description: "Workflow saved successfully",
    });
    
    setShowSaveDialog(false);
  };

  // Load an existing workflow
  const handleLoadWorkflow = (workflowToLoad: Workflow) => {
    setWorkflow(workflowToLoad);
    setSelectedTaskId(null);
    setSelectedTransitionId(null);
    setIsDirty(false);
    
    toast({
      title: "Workflow Loaded",
      description: `Loaded workflow: ${workflowToLoad.name}`,
    });
  };

  // Apply a workflow template
  const handleApplyTemplate = (templateId: string) => {
    const template = workflowTemplates.find((t) => t.id === templateId);
    
    if (template) {
      const newId = workflowId || uuidv4();
      
      // Create a copy of the template workflow with a new ID
      const newWorkflow: Workflow = {
        ...template.workflow,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Connect tasks from the template
      if (template.id === "scheduled-http-request" && newWorkflow.tasks.length >= 2) {
        const triggerId = newWorkflow.tasks[0].id;
        const actionId = newWorkflow.tasks[1].id;
        
        newWorkflow.transitions = [
          {
            id: uuidv4(),
            sourceTaskId: triggerId,
            targetTaskId: actionId,
          },
        ];
      } else if (template.id === "conditional-execution" && newWorkflow.tasks.length >= 4) {
        const triggerId = newWorkflow.tasks[0].id;
        const conditionId = newWorkflow.tasks[1].id;
        const highValueId = newWorkflow.tasks[2].id;
        const lowValueId = newWorkflow.tasks[3].id;
        
        newWorkflow.transitions = [
          {
            id: uuidv4(),
            sourceTaskId: triggerId,
            targetTaskId: conditionId,
          },
          {
            id: uuidv4(),
            sourceTaskId: conditionId,
            targetTaskId: highValueId,
            condition: "data.value > 100",
          },
          {
            id: uuidv4(),
            sourceTaskId: conditionId,
            targetTaskId: lowValueId,
            condition: "data.value <= 100",
          },
        ];
      }
      
      setWorkflow(newWorkflow);
      setSelectedTaskId(null);
      setSelectedTransitionId(null);
      setIsDirty(true);
      
      toast({
        title: "Template Applied",
        description: `Applied template: ${template.name}`,
      });
    }
  };

  // Export workflow to JSON
  const handleExportWorkflow = () => {
    const workflowJson = JSON.stringify(workflow, null, 2);
    const blob = new Blob([workflowJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workflow.name.replace(/\s+/g, "_")}_workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Workflow Exported",
      description: "Workflow JSON has been downloaded",
    });
  };

  // Import workflow from JSON
  const handleImportWorkflow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          try {
            const importedWorkflow = JSON.parse(event.target.result as string);
            
            // Validate the imported workflow
            if (!importedWorkflow.id || !importedWorkflow.tasks || !importedWorkflow.transitions) {
              throw new Error("Invalid workflow format");
            }
            
            // Assign a new ID if not loading an existing workflow
            if (!workflowId) {
              importedWorkflow.id = uuidv4();
            }
            
            setWorkflow(importedWorkflow);
            setSelectedTaskId(null);
            setSelectedTransitionId(null);
            setIsDirty(true);
            
            toast({
              title: "Workflow Imported",
              description: "Workflow loaded from JSON file",
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid workflow JSON format",
              variant: "destructive",
            });
          }
        }
      };
      
      reader.readAsText(file);
    }
  };

  // Validate the workflow
  const validateWorkflow = () => {
    const errors: string[] = [];
    
    // Check for at least one task
    if (workflow.tasks.length === 0) {
      errors.push("Workflow must have at least one task");
    }
    
    // Check for at least one trigger
    const hasTrigger = workflow.tasks.some((task) => task.type === "Trigger");
    if (!hasTrigger) {
      errors.push("Workflow must have at least one trigger task");
    }
    
    // Check for disconnected tasks
    const connectedTaskIds = new Set<string>();
    
    // Add all source and target task IDs from transitions
    workflow.transitions.forEach((transition) => {
      connectedTaskIds.add(transition.sourceTaskId);
      connectedTaskIds.add(transition.targetTaskId);
    });
    
    // Find disconnected tasks (except triggers which can be standalone)
    const disconnectedTasks = workflow.tasks.filter(
      (task) => task.type !== "Trigger" && !connectedTaskIds.has(task.id)
    );
    
    if (disconnectedTasks.length > 0) {
      errors.push(`Found ${disconnectedTasks.length} disconnected non-trigger tasks`);
    }
    
    // Check for tasks with invalid types
    const invalidTypeTasks = workflow.tasks.filter(
      (task) => !["Trigger", "Action", "Condition", "SubWorkflow"].includes(task.type)
    );
    
    if (invalidTypeTasks.length > 0) {
      errors.push(`Found ${invalidTypeTasks.length} tasks with invalid types`);
    }
    
    setValidationErrors(errors);
    setShowValidationDialog(true);
    
    return errors.length === 0;
  };

  // Run the workflow (simulation)
  const handleRunWorkflow = () => {
    if (!validateWorkflow()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate workflow execution
    setTimeout(() => {
      toast({
        title: "Workflow Started",
        description: "Workflow execution has been initiated",
      });
      
      // Record execution in localStorage
      const executions = JSON.parse(localStorage.getItem("workflowExecutions") || "[]");
      const newExecution = {
        id: uuidv4(),
        workflowId: workflow.id,
        workflowVersion: workflow.version,
        status: "Running",
        startTime: new Date().toISOString(),
        tasks: workflow.tasks.map((task) => ({
          taskId: task.id,
          status: "Pending",
        })),
      };
      
      executions.push(newExecution);
      localStorage.setItem("workflowExecutions", JSON.stringify(executions));
      
      // Simulate execution completion after delay
      setTimeout(() => {
        const updatedExecutions = JSON.parse(
          localStorage.getItem("workflowExecutions") || "[]"
        );
        const executionIndex = updatedExecutions.findIndex(
          (e: any) => e.id === newExecution.id
        );
        
        if (executionIndex !== -1) {
          updatedExecutions[executionIndex] = {
            ...updatedExecutions[executionIndex],
            status: "Completed",
            endTime: new Date().toISOString(),
            tasks: workflow.tasks.map((task) => ({
              taskId: task.id,
              status: "Completed",
              startTime: new Date(Date.now() - 5000).toISOString(),
              endTime: new Date().toISOString(),
            })),
          };
          
          localStorage.setItem(
            "workflowExecutions",
            JSON.stringify(updatedExecutions)
          );
          
          toast({
            title: "Workflow Completed",
            description: "Workflow execution finished successfully",
          });
        }
        
        setIsLoading(false);
      }, 3000);
    }, 1000);
  };

  // Edit a task's properties
  const handleEditTask = () => {
    if (selectedTaskId) {
      const task = getTaskById(selectedTaskId);
      if (task) {
        setTaskBeingEdited({ ...task });
      }
    }
  };

  // Edit a transition's properties
  const handleEditTransition = () => {
    if (selectedTransitionId) {
      const transition = workflow.transitions.find(
        (t) => t.id === selectedTransitionId
      );
      if (transition) {
        setTransitionBeingEdited({ ...transition });
      }
    }
  };

  // Save task changes
  const handleSaveTaskChanges = () => {
    if (taskBeingEdited) {
      setWorkflow((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.id === taskBeingEdited.id ? taskBeingEdited : task
        ),
        updatedAt: new Date().toISOString(),
      }));
      
      setTaskBeingEdited(null);
      setIsDirty(true);
      
      toast({
        title: "Task Updated",
        description: "Task properties saved successfully",
      });
    }
  };

  // Save transition changes
  const handleSaveTransitionChanges = () => {
    if (transitionBeingEdited) {
      setWorkflow((prev) => ({
        ...prev,
        transitions: prev.transitions.map((transition) =>
          transition.id === transitionBeingEdited.id
            ? transitionBeingEdited
            : transition
        ),
        updatedAt: new Date().toISOString(),
      }));
      
      setTransitionBeingEdited(null);
      setIsDirty(true);
      
      toast({
        title: "Transition Updated",
        description: "Transition properties saved successfully",
      });
    }
  };

  // Update task being edited
  const updateTaskBeingEdited = (field: string, value: any) => {
    if (taskBeingEdited) {
      if (field === "actionType" && taskBeingEdited.type === "Action") {
        // When action type changes, update parameters with defaults
        setTaskBeingEdited({
          ...taskBeingEdited,
          actionType: value as ActionType,
          parameters: ACTION_TYPE_PARAMS[value as ActionType],
        });
      } else if (field.startsWith("parameters.") && taskBeingEdited.parameters) {
        // Handle nested parameters
        const paramName = field.split(".")[1];
        setTaskBeingEdited({
          ...taskBeingEdited,
          parameters: {
            ...taskBeingEdited.parameters,
            [paramName]: value,
          },
        });
      } else {
        // Handle regular fields
        setTaskBeingEdited({
          ...taskBeingEdited,
          [field]: value,
        });
      }
    }
  };

  // Create a new workflow
  const handleNewWorkflow = () => {
    if (isDirty) {
      setShowSaveDialog(true);
    } else {
      setWorkflow({
        ...DEFAULT_WORKFLOW,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      setSelectedTaskId(null);
      setSelectedTransitionId(null);
      
      toast({
        title: "New Workflow",
        description: "Created a new workflow",
      });
    }
  };

  // Create a duplicate of the current workflow
  const handleDuplicateWorkflow = () => {
    const newWorkflow = {
      ...workflow,
      id: uuidv4(),
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setWorkflow(newWorkflow);
    setIsDirty(true);
    
    toast({
      title: "Workflow Duplicated",
      description: "Created a copy of the current workflow",
    });
  };

  // Render editor sidebar based on selection
  const renderEditorSidebar = () => {
    if (selectedTaskId) {
      const task = getTaskById(selectedTaskId);
      if (!task) return null;
      
      return (
        <div className="p-4 border-l border-border h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Task Properties</h3>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditTask}
                className="mr-2"
              >
                <Settings className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteTask}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="font-medium">ID</Label>
              <Input value={task.id} readOnly className="mt-1 bg-muted" />
            </div>
            
            <div>
              <Label className="font-medium">Name</Label>
              <Input value={task.name} readOnly className="mt-1 bg-muted" />
            </div>
            
            <div>
              <Label className="font-medium">Type</Label>
              <Input value={task.type} readOnly className="mt-1 bg-muted" />
            </div>
            
            {task.type === "Action" && (
              <div>
                <Label className="font-medium">Action Type</Label>
                <Input
                  value={task.actionType}
                  readOnly
                  className="mt-1 bg-muted"
                />
              </div>
            )}
            
            {task.type === "Condition" && task.conditionLogic && (
              <div>
                <Label className="font-medium">Condition Logic</Label>
                <Textarea
                  value={task.conditionLogic}
                  readOnly
                  className="mt-1 bg-muted"
                />
              </div>
            )}
            
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Parameters</h4>
              <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                {JSON.stringify(task.parameters, null, 2)}
              </pre>
            </div>
            
            <div className="pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => handleStartConnecting(task.id)}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Connect to Another Task
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    if (selectedTransitionId) {
      const transition = workflow.transitions.find(
        (t) => t.id === selectedTransitionId
      );
      if (!transition) return null;
      
      const sourceTask = getTaskById(transition.sourceTaskId);
      const targetTask = getTaskById(transition.targetTaskId);
      
      return (
        <div className="p-4 border-l border-border h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Transition Properties</h3>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditTransition}
                className="mr-2"
              >
                <Settings className="h-4 w-4 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteTransition}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="font-medium">ID</Label>
              <Input
                value={transition.id}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
            
            <div>
              <Label className="font-medium">Source Task</Label>
              <Input
                value={sourceTask ? sourceTask.name : "Unknown"}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
            
            <div>
              <Label className="font-medium">Target Task</Label>
              <Input
                value={targetTask ? targetTask.name : "Unknown"}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
            
            <div>
              <Label className="font-medium">Condition</Label>
              <Textarea
                value={transition.condition || "No condition (always execute)"}
                readOnly
                className="mt-1 bg-muted"
              />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="p-4 border-l border-border h-full overflow-y-auto">
        <h3 className="text-lg font-medium mb-4">Workflow Designer</h3>
        
        <p className="text-muted-foreground mb-4">
          Select a task or transition to view and edit its properties.
        </p>
        
        <div className="space-y-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleAddTask("Trigger")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Trigger
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleAddTask("Action")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Action
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleAddTask("Condition")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Condition
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleAddTask("SubWorkflow")}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sub-Workflow
          </Button>
        </div>
        
        <Separator className="my-4" />
        
        <div className="space-y-4 mb-6">
          <h4 className="text-sm font-medium">Workflow Properties</h4>
          
          <div>
            <Label>Name</Label>
            <Input
              value={workflow.name}
              onChange={(e) =>
                setWorkflow((prev) => ({
                  ...prev,
                  name: e.target.value,
                  updatedAt: new Date().toISOString(),
                }))
              }
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea
              value={workflow.description}
              onChange={(e) =>
                setWorkflow((prev) => ({
                  ...prev,
                  description: e.target.value,
                  updatedAt: new Date().toISOString(),
                }))
              }
              className="mt-1"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <div className="bg-card p-2 border-b flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleNewWorkflow}>
            <FileDown className="h-4 w-4 mr-1" />
            New
          </Button>
          
          <Button
            variant={isDirty ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleDuplicateWorkflow}
          >
            <Copy className="h-4 w-4 mr-1" />
            Duplicate
          </Button>
          
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Template
            </Button>
          </DialogTrigger>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleExportWorkflow}>
            <FileDown className="h-4 w-4 mr-1" />
            Export
          </Button>
          
          <div className="relative">
            <Input
              type="file"
              id="import-workflow"
              accept=".json"
              className="sr-only"
              onChange={handleImportWorkflow}
            />
            <Label
              htmlFor="import-workflow"
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            >
              <FileUp className="h-4 w-4 mr-1" />
              Import
            </Label>
          </div>
          
          <Button variant="outline" size="sm" onClick={validateWorkflow}>
            <CheckCircle className="h-4 w-4 mr-1" />
            Validate
          </Button>
          
          <Button
            variant="default"
            size="sm"
            onClick={handleRunWorkflow}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin mr-1">
                  <ArrowRight className="h-4 w-4" />
                </div>
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Main Editor */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="border-b rounded-none p-0 px-2">
          <TabsTrigger
            value="editor"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Editor
          </TabsTrigger>
          <TabsTrigger
            value="saved"
            className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
          >
            Saved Workflows
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="flex-1 flex p-0 m-0 border-0">
          <div
            ref={canvasRef}
            className="flex-1 relative bg-slate-50 overflow-auto min-h-[500px]"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          >
            {/* Tasks */}
            {workflow.tasks.map((task) => (
              <TaskNode
                key={task.id}
                task={task}
                selected={selectedTaskId === task.id}
                onSelect={handleTaskSelect}
                onMove={handleTaskMove}
              />
            ))}
            
            {/* Connections SVG Layer */}
            <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {workflow.transitions.map((transition) => {
                const sourceTask = getTaskById(transition.sourceTaskId);
                const targetTask = getTaskById(transition.targetTaskId);
                
                if (!sourceTask || !targetTask) return null;
                
                return (
                  <TransitionLine
                    key={transition.id}
                    sourceTask={sourceTask}
                    targetTask={targetTask}
                    condition={transition.condition}
                    selected={selectedTransitionId === transition.id}
                  />
                );
              })}
              
              {/* Connection in progress */}
              {connectionInProgress && (
                <g>
                  <path
                    d={`M ${
                      getTaskById(connectionInProgress.sourceId)?.position.x || 0
                    } ${
                      getTaskById(connectionInProgress.sourceId)?.position.y || 0
                    } L ${connectionInProgress.targetPos.x} ${
                      connectionInProgress.targetPos.y
                    }`}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                    fill="none"
                  />
                </g>
              )}
            </svg>
          </div>
          
          {/* Editor Sidebar */}
          <div className="w-80">{renderEditorSidebar()}</div>
        </TabsContent>
        
        <TabsContent
          value="saved"
          className="p-4 data-[state=active]:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {savedWorkflows.length === 0 ? (
            <div className="col-span-3 text-center p-8">
              <h3 className="text-lg font-medium mb-2">No Saved Workflows</h3>
              <p className="text-muted-foreground mb-4">
                You haven't saved any workflows yet. Create and save a workflow to see it here.
              </p>
              <Button onClick={handleNewWorkflow}>Create New Workflow</Button>
            </div>
          ) : (
            <>
              {savedWorkflows.map((savedWorkflow) => (
                <Card key={savedWorkflow.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle>{savedWorkflow.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-sm text-muted-foreground mb-2">
                      {savedWorkflow.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tasks: {savedWorkflow.tasks.length} | Transitions:{" "}
                      {savedWorkflow.transitions.length}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Last updated:{" "}
                      {new Date(savedWorkflow.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => handleLoadWorkflow(savedWorkflow)}
                    >
                      Load Workflow
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Task Edit Dialog */}
      <Dialog open={taskBeingEdited !== null} onOpenChange={(open) => !open && setTaskBeingEdited(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Modify the properties of the selected task
            </DialogDescription>
          </DialogHeader>
          
          {taskBeingEdited && (
            <div className="py-2 space-y-4">
              <div>
                <Label htmlFor="task-name">Task Name</Label>
                <Input
                  id="task-name"
                  value={taskBeingEdited.name}
                  onChange={(e) =>
                    updateTaskBeingEdited("name", e.target.value)
                  }
                />
              </div>
              
              <div>
                <Label htmlFor="task-type">Task Type</Label>
                <Select
                  value={taskBeingEdited.type}
                  onValueChange={(value) =>
                    updateTaskBeingEdited("type", value)
                  }
                  disabled
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Trigger">Trigger</SelectItem>
                    <SelectItem value="Action">Action</SelectItem>
                    <SelectItem value="Condition">Condition</SelectItem>
                    <SelectItem value="SubWorkflow">SubWorkflow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Action-specific UI */}
              {taskBeingEdited.type === "Action" && (
                <div>
                  <Label htmlFor="action-type">Action Type</Label>
                  <Select
                    value={taskBeingEdited.actionType || "HttpRequest"}
                    onValueChange={(value) =>
                      updateTaskBeingEdited("actionType", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HttpRequest">HTTP Request</SelectItem>
                      <SelectItem value="DatabaseOperation">
                        Database Operation
                      </SelectItem>
                      <SelectItem value="MessageQueue">Message Queue</SelectItem>
                      <SelectItem value="ScriptExecution">
                        Script Execution
                      </SelectItem>
                      <SelectItem value="DummyAction">
                        Dummy Action (Testing)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Condition-specific UI */}
              {taskBeingEdited.type === "Condition" && (
                <div>
                  <Label htmlFor="condition-logic">Condition Logic</Label>
                  <Textarea
                    id="condition-logic"
                    value={taskBeingEdited.conditionLogic || ""}
                    onChange={(e) =>
                      updateTaskBeingEdited("conditionLogic", e.target.value)
                    }
                    placeholder="JavaScript expression, e.g., data.value > 10"
                  />
                </div>
              )}
              
              {/* HTTP Request parameters */}
              {taskBeingEdited.type === "Action" &&
                taskBeingEdited.actionType === "HttpRequest" && (
                  <>
                    <div>
                      <Label htmlFor="http-url">URL</Label>
                      <Input
                        id="http-url"
                        value={taskBeingEdited.parameters.url || ""}
                        onChange={(e) =>
                          updateTaskBeingEdited("parameters.url", e.target.value)
                        }
                        placeholder="https://api.example.com/endpoint"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="http-method">Method</Label>
                      <Select
                        value={taskBeingEdited.parameters.method || "GET"}
                        onValueChange={(value) =>
                          updateTaskBeingEdited("parameters.method", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}
              
              {/* Script Execution parameters */}
              {taskBeingEdited.type === "Action" &&
                taskBeingEdited.actionType === "ScriptExecution" && (
                  <div>
                    <Label htmlFor="script-content">Script Content</Label>
                    <Textarea
                      id="script-content"
                      value={taskBeingEdited.parameters.script || ""}
                      onChange={(e) =>
                        updateTaskBeingEdited(
                          "parameters.script",
                          e.target.value
                        )
                      }
                      className="font-mono"
                      placeholder="console.log('Hello, World!');"
                    />
                  </div>
                )}
              
              {/* Trigger parameters */}
              {taskBeingEdited.type === "Trigger" && (
                <div>
                  <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
                  <Input
                    id="schedule"
                    value={taskBeingEdited.parameters.schedule || ""}
                    onChange={(e) =>
                      updateTaskBeingEdited(
                        "parameters.schedule",
                        e.target.value
                      )
                    }
                    placeholder="0 0 * * *"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: minute hour day-of-month month day-of-week
                  </p>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTaskBeingEdited(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTaskChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Transition Edit Dialog */}
      <Dialog
        open={transitionBeingEdited !== null}
        onOpenChange={(open) => !open && setTransitionBeingEdited(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Transition</DialogTitle>
            <DialogDescription>
              Modify the properties of the selected transition
            </DialogDescription>
          </DialogHeader>
          
          {transitionBeingEdited && (
            <div className="py-2 space-y-4">
              <div>
                <Label htmlFor="condition">Condition (Optional)</Label>
                <Textarea
                  id="condition"
                  value={transitionBeingEdited.condition || ""}
                  onChange={(e) =>
                    setTransitionBeingEdited({
                      ...transitionBeingEdited,
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
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTransitionBeingEdited(null)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTransitionChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Template Gallery Dialog */}
      <Dialog>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Workflow Templates</DialogTitle>
            <DialogDescription>
              Select a template to quickly create a workflow
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              {workflowTemplates.map((template) => (
                <Card
                  key={template.id}
                  className="cursor-pointer hover:border-primary transition-all"
                  onClick={() => handleApplyTemplate(template.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-2">{template.description}</p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span className="bg-slate-100 px-2 py-1 rounded">
                        {template.category}
                      </span>
                      <span className="ml-2">
                        {template.workflow.tasks.length} tasks
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
      
      {/* Validation Dialog */}
      <Dialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
      >
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
            <Button onClick={() => setShowValidationDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Workflow</DialogTitle>
            <DialogDescription>
              Enter a name and description for your workflow
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workflow-name">Name</Label>
              <Input
                id="workflow-name"
                value={workflow.name}
                onChange={(e) =>
                  setWorkflow((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="workflow-description">Description</Label>
              <Textarea
                id="workflow-description"
                value={workflow.description}
                onChange={(e) =>
                  setWorkflow((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWorkflow}>Save Workflow</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowDesigner;
