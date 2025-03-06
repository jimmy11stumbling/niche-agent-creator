import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Task, Workflow, Transition } from "@/types/workflow";
import { v4 as uuidv4 } from "uuid";
import { 
  fetchWorkflow, validateWorkflow, applyTemplate, 
  getTaskById, saveWorkflow 
} from "../utils";
import { DEFAULT_WORKFLOW, TASK_TEMPLATES, WORKFLOW_TEMPLATES } from "../constants";
import { ACTION_TYPE_PARAMS } from "../utils/actionTypeParams";

export const useWorkflowEditor = (workflowId?: string) => {
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

  const { data: fetchedWorkflow } = useQuery({
    queryKey: ["workflow", workflowId],
    queryFn: () => workflowId ? fetchWorkflow(workflowId) : Promise.resolve(null),
    enabled: !!workflowId,
  });

  useEffect(() => {
    if (fetchedWorkflow) {
      setWorkflow(fetchedWorkflow);
    }
  }, [fetchedWorkflow]);

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

  const handleAddTask = (type: any) => {
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

  const handleStartConnecting = (sourceId: string) => {
    setConnecting(true);
    setConnectingSourceId(sourceId);
  };

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

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (!connecting || !connectingSourceId) {
      if (!selectedTaskId && !selectedTransitionId) {
        setSelectedTaskId(null);
        setSelectedTransitionId(null);
      }
      return;
    }
    
    setConnecting(false);
    setConnectionInProgress(null);
    setConnectingSourceId(null);
  };

  const handleTaskSelectWhileConnecting = (targetId: string) => {
    if (connecting && connectingSourceId) {
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
    
    setConnecting(false);
    setConnectionInProgress(null);
    setConnectingSourceId(null);
  };

  const handleTaskSelect = (id: string) => {
    if (connecting && connectingSourceId) {
      handleTaskSelectWhileConnecting(id);
    } else {
      setSelectedTaskId(id);
      setSelectedTransitionId(null);
    }
  };

  const handleTransitionSelect = (id: string) => {
    setSelectedTransitionId(id);
    setSelectedTaskId(null);
  };

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

  const handleDeleteTask = () => {
    if (selectedTaskId) {
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

  const handleSaveWorkflow = () => {
    const updatedWorkflows = saveWorkflow(workflow);
    setSavedWorkflows(updatedWorkflows);
    setIsDirty(false);
    
    toast({
      title: "Workflow Saved",
      description: "Workflow saved successfully",
    });
    
    setShowSaveDialog(false);
  };

  const handleWorkflowFieldChange = (field: string, value: string) => {
    setWorkflow((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
    setIsDirty(true);
  };

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

  const handleApplyTemplate = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find((t) => t.id === templateId);
    
    if (template) {
      const newWorkflow = applyTemplate(template, workflowId);
      
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

  const handleImportWorkflow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target) {
          try {
            const importedWorkflow = JSON.parse(event.target.result as string);
            
            if (!importedWorkflow.id || !importedWorkflow.tasks || !importedWorkflow.transitions) {
              throw new Error("Invalid workflow format");
            }
            
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

  const handleValidateWorkflow = () => {
    const errors = validateWorkflow(workflow);
    setValidationErrors(errors);
    setShowValidationDialog(true);
    return errors.length === 0;
  };

  const handleRunWorkflow = () => {
    if (!handleValidateWorkflow()) {
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: "Workflow Started",
        description: "Workflow execution has been initiated",
      });
      
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

  const handleEditTask = () => {
    if (selectedTaskId) {
      const task = getTaskById(workflow.tasks, selectedTaskId);
      if (task) {
        setTaskBeingEdited({ ...task });
      }
    }
  };

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

  const updateTaskBeingEdited = (field: string, value: any) => {
    if (taskBeingEdited) {
      if (field === "actionType" && taskBeingEdited.type === "Action") {
        setTaskBeingEdited({
          ...taskBeingEdited,
          actionType: value as any,
          parameters: ACTION_TYPE_PARAMS[value as any],
        });
      } else if (field.startsWith("parameters.") && taskBeingEdited.parameters) {
        const paramName = field.split(".")[1];
        setTaskBeingEdited({
          ...taskBeingEdited,
          parameters: {
            ...taskBeingEdited.parameters,
            [paramName]: value,
          },
        });
      } else {
        setTaskBeingEdited({
          ...taskBeingEdited,
          [field]: value,
        });
      }
    }
  };

  const getTransitionTaskNames = () => {
    if (!transitionBeingEdited) return { sourceTaskName: '', targetTaskName: '' };
    
    const sourceTask = getTaskById(workflow.tasks, transitionBeingEdited.sourceTaskId);
    const targetTask = getTaskById(workflow.tasks, transitionBeingEdited.targetTaskId);
    
    return {
      sourceTaskName: sourceTask?.name || 'Unknown',
      targetTaskName: targetTask?.name || 'Unknown'
    };
  };

  return {
    workflow,
    selectedTaskId,
    selectedTransitionId,
    connectionInProgress,
    validationErrors,
    showValidationDialog,
    taskBeingEdited,
    transitionBeingEdited,
    savedWorkflows,
    activeTab,
    isLoading,
    isDirty,
    showSaveDialog,
    canvasRef,
    getTransitionTaskNames,
    setActiveTab,
    setShowValidationDialog,
    setShowSaveDialog,
    handleAddTask,
    handleStartConnecting,
    handleCanvasMouseMove,
    handleCanvasClick,
    handleTaskSelect,
    handleTransitionSelect,
    handleTaskMove,
    handleDeleteTask,
    handleDeleteTransition,
    handleSaveWorkflow,
    handleWorkflowFieldChange,
    handleLoadWorkflow,
    handleApplyTemplate,
    handleExportWorkflow,
    handleImportWorkflow,
    handleValidateWorkflow,
    handleRunWorkflow,
    handleEditTask,
    handleEditTransition,
    handleSaveTaskChanges,
    handleSaveTransitionChanges,
    handleNewWorkflow,
    handleDuplicateWorkflow,
    updateTaskBeingEdited
  };
};
