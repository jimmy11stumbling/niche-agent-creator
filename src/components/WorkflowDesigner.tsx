
import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workflow, Task, Transition, TaskType, ActionType } from "@/types/workflow";
import {
  PlusIcon,
  SaveIcon,
  PlayIcon,
  TrashIcon,
  ArrowRightIcon,
  Settings2Icon,
  AlertCircleIcon,
  GripVertical,
  Link2Icon,
  XIcon,
  EyeIcon,
  FileIcon,
  FileTextIcon,
  DatabaseIcon,
  MailIcon,
  CodeIcon
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Enhanced Mock API functions with more realistic behavior
const mockFetchWorkflow = async (id: string): Promise<Workflow> => {
  console.log("Fetching workflow with ID:", id);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Check if workflow exists in localStorage
  const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
  const existingWorkflow = savedWorkflows.find((wf: Workflow) => wf.id === id);
  
  if (existingWorkflow) {
    console.log("Found existing workflow:", existingWorkflow);
    return existingWorkflow;
  }
  
  // For demo purposes, return a sample workflow if none exists
  return {
    id,
    name: "Sample Workflow",
    description: "A sample workflow for demonstration",
    tasks: [
      {
        id: "task1",
        name: "Start",
        type: "Trigger",
        parameters: {},
        dependencies: [],
        position: { x: 100, y: 200 }
      },
      {
        id: "task2",
        name: "Process Data",
        type: "Action",
        actionType: "HttpRequest",
        parameters: {
          url: "https://api.example.com/data",
          method: "GET"
        },
        dependencies: ["task1"],
        position: { x: 400, y: 200 }
      },
      {
        id: "task3",
        name: "Check Result",
        type: "Condition",
        conditionLogic: "data.status === 'success'",
        parameters: {},
        dependencies: ["task2"],
        position: { x: 700, y: 200 }
      }
    ],
    transitions: [
      {
        id: "transition1",
        sourceTaskId: "task1",
        targetTaskId: "task2"
      },
      {
        id: "transition2",
        sourceTaskId: "task2",
        targetTaskId: "task3"
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  };
};

// Enhanced save workflow function with localStorage persistence
const mockSaveWorkflow = async (workflow: Workflow): Promise<Workflow> => {
  console.log("Saving workflow:", workflow);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const updatedWorkflow = {
    ...workflow,
    updatedAt: new Date().toISOString(),
    version: workflow.version + 1
  };
  
  // Save to localStorage
  const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
  const existingIndex = savedWorkflows.findIndex((wf: Workflow) => wf.id === workflow.id);
  
  if (existingIndex >= 0) {
    savedWorkflows[existingIndex] = updatedWorkflow;
  } else {
    savedWorkflows.push(updatedWorkflow);
  }
  
  localStorage.setItem("workflows", JSON.stringify(savedWorkflows));
  return updatedWorkflow;
};

// Enhanced run workflow function with execution history
const mockRunWorkflow = async (workflowId: string): Promise<{ executionId: string }> => {
  console.log("Running workflow:", workflowId);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const executionId = uuidv4();
  
  // Save execution record to localStorage
  const executions = JSON.parse(localStorage.getItem("workflow_executions") || "[]");
  executions.push({
    id: executionId,
    workflowId,
    status: "completed", // In a real system, this would initially be "running"
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 5000).toISOString(), // Simulate a 5-second run
    taskResults: []
  });
  
  localStorage.setItem("workflow_executions", JSON.stringify(executions));
  return { executionId };
};

const WorkflowDesigner = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [workflow, setWorkflow] = useState<Workflow>({
    id: workflowId || uuidv4(),
    name: "New Workflow",
    description: "",
    tasks: [],
    transitions: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    version: 1
  });
  
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedTransition, setSelectedTransition] = useState<Transition | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [currentTab, setCurrentTab] = useState("designer");
  const [isAddingTransition, setIsAddingTransition] = useState(false);
  const [transitionSource, setTransitionSource] = useState<string | null>(null);
  const [showWorkflowTemplates, setShowWorkflowTemplates] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  // Fix: Use useQuery with the proper approach for handling data
  const { isLoading: isLoadingWorkflow, data: workflowData } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowId ? mockFetchWorkflow(workflowId) : null,
    enabled: !!workflowId
  });

  // Use useEffect to handle the data when it's available
  useEffect(() => {
    if (workflowData) {
      setWorkflow(workflowData);
    }
  }, [workflowData]);
  
  // Mutation for saving workflow
  const saveWorkflowMutation = useMutation({
    mutationFn: mockSaveWorkflow,
    onSuccess: (data) => {
      setWorkflow(data);
      toast.success("Workflow saved successfully");
      if (!workflowId) {
        navigate(`/workflows/designer/${data.id}`);
      }
    },
    onError: (error) => {
      toast.error("Failed to save workflow");
      console.error("Failed to save workflow:", error);
    }
  });
  
  // Mutation for running workflow
  const runWorkflowMutation = useMutation({
    mutationFn: () => mockRunWorkflow(workflow.id),
    onSuccess: (data) => {
      toast.success(`Workflow execution started: ${data.executionId}`);
      navigate(`/workflows?execution=${data.executionId}`);
    },
    onError: (error) => {
      toast.error("Failed to run workflow");
      console.error("Failed to run workflow:", error);
    }
  });
  
  // Enhanced task creation with improved positioning
  const handleAddTask = (type: TaskType) => {
    // Calculate a good position for the new task
    let newPosition = { x: 200, y: 200 };
    
    if (workflow.tasks.length > 0) {
      // Find the rightmost task
      const rightmostTask = workflow.tasks.reduce((prev, current) => {
        return (prev.position.x > current.position.x) ? prev : current;
      });
      
      // Place new task to the right with some spacing
      newPosition = {
        x: rightmostTask.position.x + 250,
        y: rightmostTask.position.y
      };
    }
    
    const newTask: Task = {
      id: uuidv4(),
      name: `New ${type}`,
      type,
      parameters: {},
      dependencies: [],
      position: newPosition
    };
    
    // Add specific properties based on task type
    if (type === 'Action') {
      newTask.actionType = 'HttpRequest';
    } else if (type === 'Condition') {
      newTask.conditionLogic = '';
    }
    
    setWorkflow(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    
    setSelectedTask(newTask);
  };
  
  // Handle task selection
  const handleSelectTask = (taskId: string) => {
    if (isAddingTransition) {
      if (transitionSource) {
        // Complete the transition creation
        handleAddTransition(transitionSource, taskId);
        setIsAddingTransition(false);
        setTransitionSource(null);
      } else {
        // Start the transition creation
        setTransitionSource(taskId);
        toast.info("Now select a destination task to create a connection");
      }
      return;
    }
    
    const task = workflow.tasks.find(t => t.id === taskId) || null;
    setSelectedTask(task);
    setSelectedTransition(null);
  };
  
  // Handle task update with improved validation
  const handleUpdateTask = (updatedTask: Task) => {
    // Validate task data before updating
    if (!updatedTask.name.trim()) {
      toast.error("Task name cannot be empty");
      return;
    }
    
    setWorkflow(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
    setSelectedTask(updatedTask);
  };
  
  // Enhanced task deletion with proper transition cleanup
  const handleDeleteTask = (taskId: string) => {
    setWorkflow(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId),
      transitions: prev.transitions.filter(
        t => t.sourceTaskId !== taskId && t.targetTaskId !== taskId
      )
    }));
    
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
    
    toast.success("Task deleted");
  };
  
  // Start transition creation mode
  const handleStartTransition = (sourceTaskId: string) => {
    setIsAddingTransition(true);
    setTransitionSource(sourceTaskId);
    toast.info("Now select a destination task to create a connection");
  };
  
  // Cancel transition creation
  const handleCancelTransition = () => {
    setIsAddingTransition(false);
    setTransitionSource(null);
  };
  
  // Handle transition creation with validation
  const handleAddTransition = (sourceTaskId: string, targetTaskId: string) => {
    // Validate the transition
    if (sourceTaskId === targetTaskId) {
      toast.error("Cannot create a transition to the same task");
      return;
    }
    
    // Check if this transition already exists
    const existingTransition = workflow.transitions.find(
      t => t.sourceTaskId === sourceTaskId && t.targetTaskId === targetTaskId
    );
    
    if (existingTransition) {
      toast.error("This connection already exists");
      return;
    }
    
    const newTransition: Transition = {
      id: uuidv4(),
      sourceTaskId,
      targetTaskId
    };
    
    setWorkflow(prev => ({
      ...prev,
      transitions: [...prev.transitions, newTransition]
    }));
    
    setSelectedTransition(newTransition);
    toast.success("Connection created");
  };
  
  // Handle transition selection
  const handleSelectTransition = (transitionId: string) => {
    const transition = workflow.transitions.find(t => t.id === transitionId) || null;
    setSelectedTransition(transition);
    setSelectedTask(null);
  };
  
  // Handle transition update
  const handleUpdateTransition = (updatedTransition: Transition) => {
    setWorkflow(prev => ({
      ...prev,
      transitions: prev.transitions.map(t => 
        t.id === updatedTransition.id ? updatedTransition : t
      )
    }));
    setSelectedTransition(updatedTransition);
  };
  
  // Handle transition deletion
  const handleDeleteTransition = (transitionId: string) => {
    setWorkflow(prev => ({
      ...prev,
      transitions: prev.transitions.filter(t => t.id !== transitionId)
    }));
    
    if (selectedTransition?.id === transitionId) {
      setSelectedTransition(null);
    }
    
    toast.success("Connection deleted");
  };
  
  // Enhanced drag and drop functionality for tasks
  const handleTaskMouseDown = (e: React.MouseEvent, taskId: string) => {
    if (isAddingTransition) return; // Don't start dragging in transition mode
    
    const task = workflow.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setIsDragging(true);
    setSelectedTask(task);
    setSelectedTransition(null);
    
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    
    setDragStartPos({ x: offsetX, y: offsetY });
    
    // Add event listeners to window for mouse move and up
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !canvasRef.current) return;
      
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left - dragStartPos.x;
      const newY = e.clientY - canvasRect.top - dragStartPos.y;
      
      // Update task position
      setWorkflow(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId 
          ? { ...t, position: { x: Math.max(0, newX), y: Math.max(0, newY) } } 
          : t)
      }));
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };
  
  // Validate workflow
  const validateWorkflow = (): boolean => {
    const errors: string[] = [];

    // Check if workflow has a name
    if (!workflow.name.trim()) {
      errors.push("Workflow name cannot be empty");
    }
    
    // Check if workflow has at least one task
    if (workflow.tasks.length === 0) {
      errors.push("Workflow must have at least one task");
    }
    
    // Check if there's a trigger task
    const hasTrigger = workflow.tasks.some(task => task.type === 'Trigger');
    if (!hasTrigger) {
      errors.push("Workflow must have at least one Trigger task");
    }
    
    // Check for orphaned tasks (tasks with no connections)
    workflow.tasks.forEach(task => {
      if (task.type !== 'Trigger') {
        const hasIncoming = workflow.transitions.some(t => t.targetTaskId === task.id);
        if (!hasIncoming) {
          errors.push(`Task "${task.name}" has no incoming connections`);
        }
      }
      
      if (task.type !== 'Action' && task.type !== 'Condition') {
        const hasOutgoing = workflow.transitions.some(t => t.sourceTaskId === task.id);
        if (!hasOutgoing) {
          errors.push(`Task "${task.name}" has no outgoing connections`);
        }
      }
    });
    
    // Check for cycles in the workflow
    // This is a simplified cycle detection - a full implementation would require
    // a more comprehensive graph traversal algorithm
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCycle = (taskId: string): boolean => {
      visited.add(taskId);
      recursionStack.add(taskId);
      
      const outgoingTransitions = workflow.transitions.filter(t => t.sourceTaskId === taskId);
      for (const transition of outgoingTransitions) {
        if (!visited.has(transition.targetTaskId)) {
          if (hasCycle(transition.targetTaskId)) {
            return true;
          }
        } else if (recursionStack.has(transition.targetTaskId)) {
          return true;
        }
      }
      
      recursionStack.delete(taskId);
      return false;
    };
    
    const triggerTasks = workflow.tasks.filter(task => task.type === 'Trigger');
    for (const triggerTask of triggerTasks) {
      if (hasCycle(triggerTask.id)) {
        errors.push("Workflow contains cycles, which are not allowed in a valid workflow");
        break;
      }
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };
  
  // Handle save workflow
  const handleSaveWorkflow = () => {
    // Validate workflow before saving
    if (!workflow.name.trim()) {
      toast.error("Workflow name cannot be empty");
      return;
    }
    
    saveWorkflowMutation.mutate(workflow);
  };
  
  // Handle run workflow
  const handleRunWorkflow = () => {
    // Validate workflow before running
    if (!validateWorkflow()) {
      setPreviewDialogOpen(true);
      return;
    }
    
    runWorkflowMutation.mutate();
  };

  // Load workflow template
  const handleLoadTemplate = (templateId: string) => {
    // Here you would fetch the template from your templates repository
    // For now, we'll just use some hardcoded templates
    const templates = {
      "data-sync": {
        name: "Data Synchronization",
        description: "Sync data between two systems",
        tasks: [
          {
            id: "trigger1",
            name: "Schedule Trigger",
            type: "Trigger",
            parameters: { schedule: "0 0 * * *" },
            dependencies: [],
            position: { x: 100, y: 200 }
          },
          {
            id: "action1",
            name: "Fetch Source Data",
            type: "Action",
            actionType: "HttpRequest",
            parameters: {
              url: "https://source-api.example.com/data",
              method: "GET"
            },
            dependencies: ["trigger1"],
            position: { x: 350, y: 200 }
          },
          {
            id: "action2",
            name: "Transform Data",
            type: "Action",
            actionType: "ScriptExecution",
            parameters: {
              script: "// Transform data here"
            },
            dependencies: ["action1"],
            position: { x: 600, y: 200 }
          },
          {
            id: "action3",
            name: "Send to Target",
            type: "Action",
            actionType: "HttpRequest",
            parameters: {
              url: "https://target-api.example.com/data",
              method: "POST"
            },
            dependencies: ["action2"],
            position: { x: 850, y: 200 }
          }
        ],
        transitions: [
          {
            id: "t1",
            sourceTaskId: "trigger1",
            targetTaskId: "action1"
          },
          {
            id: "t2",
            sourceTaskId: "action1",
            targetTaskId: "action2"
          },
          {
            id: "t3",
            sourceTaskId: "action2",
            targetTaskId: "action3"
          }
        ]
      },
      "approval-process": {
        name: "Approval Process",
        description: "Handle approval workflows with conditions",
        tasks: [
          {
            id: "trigger1",
            name: "Request Submitted",
            type: "Trigger",
            parameters: {},
            dependencies: [],
            position: { x: 100, y: 200 }
          },
          {
            id: "condition1",
            name: "Check Amount",
            type: "Condition",
            conditionLogic: "data.amount > 1000",
            parameters: {},
            dependencies: ["trigger1"],
            position: { x: 350, y: 200 }
          },
          {
            id: "action1",
            name: "Manager Approval",
            type: "Action",
            actionType: "HttpRequest",
            parameters: {
              url: "https://api.example.com/notify/manager",
              method: "POST"
            },
            dependencies: ["condition1"],
            position: { x: 600, y: 100 }
          },
          {
            id: "action2",
            name: "Auto Approval",
            type: "Action",
            actionType: "DatabaseOperation",
            parameters: {
              operation: "UPDATE",
              table: "requests",
              data: { status: "approved" }
            },
            dependencies: ["condition1"],
            position: { x: 600, y: 300 }
          }
        ],
        transitions: [
          {
            id: "t1",
            sourceTaskId: "trigger1",
            targetTaskId: "condition1"
          },
          {
            id: "t2",
            sourceTaskId: "condition1",
            targetTaskId: "action1",
            condition: "data.amount > 1000"
          },
          {
            id: "t3",
            sourceTaskId: "condition1",
            targetTaskId: "action2",
            condition: "data.amount <= 1000"
          }
        ]
      }
    };
    
    const template = templates[templateId as keyof typeof templates];
    if (template) {
      const newWorkflow = {
        ...workflow,
        name: template.name,
        description: template.description,
        tasks: template.tasks,
        transitions: template.transitions
      };
      
      setWorkflow(newWorkflow);
      setShowWorkflowTemplates(false);
      toast.success(`Template "${template.name}" applied successfully`);
    }
  };
  
  // Enhanced canvas rendering with improved visuals and interaction
  const renderCanvas = () => {
    return (
      <div 
        ref={canvasRef}
        className={`relative w-full h-[600px] bg-slate-50 border rounded-lg overflow-auto ${
          isAddingTransition ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onClick={() => {
          if (isAddingTransition) {
            handleCancelTransition();
          }
        }}
      >
        {/* Grid background for better visual orientation */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '25px 25px'
        }}></div>
        
        {/* Render transitions first (so they appear beneath tasks) */}
        <svg className="absolute inset-0 pointer-events-none">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
          </defs>
          
          {workflow.transitions.map(transition => {
            const sourceTask = workflow.tasks.find(t => t.id === transition.sourceTaskId);
            const targetTask = workflow.tasks.find(t => t.id === transition.targetTaskId);
            
            if (!sourceTask || !targetTask) return null;
            
            const startX = sourceTask.position.x + 100;
            const startY = sourceTask.position.y + 30;
            const endX = targetTask.position.x;
            const endY = targetTask.position.y + 30;
            
            // Create a curved path for nicer visualization
            const dx = endX - startX;
            const dy = endY - startY;
            const controlX = startX + dx / 2;
            const controlY = startY + dy / 2;
            const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${endX} ${endY}`;
            
            return (
              <g key={transition.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTransition(transition.id);
                }}
                style={{ pointerEvents: 'all', cursor: 'pointer' }}
              >
                <path
                  d={pathData}
                  fill="none"
                  stroke={selectedTransition?.id === transition.id ? "#0284c7" : "#94a3b8"}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                
                {/* Invisible wider path for easier clicking */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="transparent"
                  strokeWidth="10"
                  style={{ pointerEvents: 'all', cursor: 'pointer' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectTransition(transition.id);
                  }}
                />
                
                {/* Display transition condition if it exists */}
                {transition.condition && (
                  <foreignObject
                    x={controlX - 80}
                    y={controlY - 20}
                    width="160"
                    height="40"
                  >
                    <div className="bg-white border border-slate-200 rounded-md px-2 py-1 text-xs text-center text-slate-700">
                      {transition.condition}
                    </div>
                  </foreignObject>
                )}
              </g>
            );
          })}
          
          {/* Draw the in-progress transition during creation */}
          {isAddingTransition && transitionSource && (
            (() => {
              const sourceTask = workflow.tasks.find(t => t.id === transitionSource);
              if (!sourceTask) return null;
              
              const startX = sourceTask.position.x + 100;
              const startY = sourceTask.position.y + 30;
              
              // Follow mouse position for the end point
              const [mousePos, setMousePos] = useState({ x: startX + 100, y: startY });
              
              useEffect(() => {
                const handleMouseMove = (e: MouseEvent) => {
                  if (!canvasRef.current) return;
                  
                  const canvasRect = canvasRef.current.getBoundingClientRect();
                  setMousePos({
                    x: e.clientX - canvasRect.left,
                    y: e.clientY - canvasRect.top
                  });
                };
                
                window.addEventListener('mousemove', handleMouseMove);
                return () => window.removeEventListener('mousemove', handleMouseMove);
              }, []);
              
              // Create a curved path
              const dx = mousePos.x - startX;
              const dy = mousePos.y - startY;
              const controlX = startX + dx / 2;
              const controlY = startY + dy / 2;
              const pathData = `M ${startX} ${startY} Q ${controlX} ${controlY}, ${mousePos.x} ${mousePos.y}`;
              
              return (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrowhead)"
                />
              );
            })()
          )}
        </svg>
        
        {/* Render tasks */}
        {workflow.tasks.map(task => (
          <div
            key={task.id}
            className={`absolute p-4 rounded-lg shadow-md cursor-grab active:cursor-grabbing ${
              selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''
            } ${
              task.type === 'Action' ? 'bg-blue-100 border-blue-300' :
              task.type === 'Condition' ? 'bg-yellow-100 border-yellow-300' :
              task.type === 'Trigger' ? 'bg-green-100 border-green-300' : 'bg-purple-100 border-purple-300'
            } border-2`}
            style={{
              left: `${task.position.x}px`,
              top: `${task.position.y}px`,
              width: '200px',
              transition: isDragging && selectedTask?.id === task.id ? 'none' : 'box-shadow 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectTask(task.id);
            }}
            onMouseDown={(e) => {
              if (!isAddingTransition) {
                handleTaskMouseDown(e, task.id);
              }
            }}
          >
            <div className="flex items-center mb-2">
              <GripVertical className="h-4 w-4 mr-2 text-gray-400" />
              <div className="font-medium truncate flex-grow">{task.name}</div>
              
              {/* Connection point for creating transitions */}
              <button 
                className="ml-2 p-1 rounded-full hover:bg-blue-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTransition(task.id);
                }}
                title="Create connection"
              >
                <Link2Icon className="h-4 w-4 text-blue-600" />
              </button>
            </div>
            <div className="text-xs text-gray-500 font-medium">{task.type}</div>
            {task.actionType && (
              <div className="text-xs text-gray-500">{task.actionType}</div>
            )}
            {task.conditionLogic && (
              <div className="text-xs text-gray-600 mt-1 bg-white p-1 rounded border border-yellow-200">
                <code>{task.conditionLogic}</code>
              </div>
            )}
            {task.retryPolicy && (
              <div className="text-xs text-gray-500 mt-1">
                Retries: {task.retryPolicy.attempts}
              </div>
            )}
          </div>
        ))}
        
        {/* Add a helper message when the canvas is empty */}
        {workflow.tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Settings2Icon className="mx-auto h-10 w-10 mb-2" />
              <p>Start by adding a task from the panel on the right</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setShowWorkflowTemplates(true)}
              >
                Or use a template
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Enhanced properties panel with more task type options
  const renderPropertiesPanel = () => {
    // Task properties panel
    if (selectedTask) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="taskName">Task Name</Label>
                <Input
                  id="taskName"
                  value={selectedTask.name}
                  onChange={(e) => handleUpdateTask({
                    ...selectedTask,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div>
                <Label>Task Type</Label>
                <div className="text-sm font-medium">{selectedTask.type}</div>
              </div>
              
              {selectedTask.type === 'Action' && (
                <div>
                  <Label htmlFor="actionType">Action Type</Label>
                  <Select
                    value={selectedTask.actionType || 'HttpRequest'}
                    onValueChange={(value) => handleUpdateTask({
                      ...selectedTask,
                      actionType: value as ActionType
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HttpRequest">HTTP Request</SelectItem>
                      <SelectItem value="DatabaseOperation">Database Operation</SelectItem>
                      <SelectItem value="MessageQueue">Message Queue</SelectItem>
                      <SelectItem value="ScriptExecution">Script Execution</SelectItem>
                      <SelectItem value="DummyAction">Dummy Action</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {/* Action-specific parameters */}
                  {selectedTask.actionType === 'HttpRequest' && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="requestUrl">URL</Label>
                      <Input
                        id="requestUrl"
                        placeholder="https://api.example.com/endpoint"
                        value={(selectedTask.parameters as any)?.url || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            url: e.target.value 
                          }
                        })}
                      />
                      
                      <Label htmlFor="requestMethod">Method</Label>
                      <Select
                        value={(selectedTask.parameters as any)?.method || 'GET'}
                        onValueChange={(value) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            method: value 
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select HTTP method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Label htmlFor="requestBody">Request Body (JSON)</Label>
                      <Textarea
                        id="requestBody"
                        placeholder='{"key": "value"}'
                        value={(selectedTask.parameters as any)?.body || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            body: e.target.value 
                          }
                        })}
                      />
                    </div>
                  )}
                  
                  {selectedTask.actionType === 'DatabaseOperation' && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="operation">Operation</Label>
                      <Select
                        value={(selectedTask.parameters as any)?.operation || 'SELECT'}
                        onValueChange={(value) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            operation: value 
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SELECT">SELECT</SelectItem>
                          <SelectItem value="INSERT">INSERT</SelectItem>
                          <SelectItem value="UPDATE">UPDATE</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Label htmlFor="table">Table Name</Label>
                      <Input
                        id="table"
                        placeholder="users"
                        value={(selectedTask.parameters as any)?.table || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            table: e.target.value 
                          }
                        })}
                      />
                      
                      <Label htmlFor="query">SQL Query/Data</Label>
                      <Textarea
                        id="query"
                        placeholder="SELECT * FROM users WHERE id = :id"
                        value={(selectedTask.parameters as any)?.query || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            query: e.target.value 
                          }
                        })}
                      />
                    </div>
                  )}
                  
                  {selectedTask.actionType === 'ScriptExecution' && (
                    <div className="mt-4 space-y-2">
                      <Label htmlFor="scriptType">Script Type</Label>
                      <Select
                        value={(selectedTask.parameters as any)?.scriptType || 'javascript'}
                        onValueChange={(value) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            scriptType: value 
                          }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select script type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="javascript">JavaScript</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="shell">Shell</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Label htmlFor="script">Script Content</Label>
                      <Textarea
                        id="script"
                        placeholder="// Enter your script here"
                        className="h-32 font-mono text-sm"
                        value={(selectedTask.parameters as any)?.script || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            script: e.target.value 
                          }
                        })}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {selectedTask.type === 'Condition' && (
                <div>
                  <Label htmlFor="conditionLogic">Condition Logic</Label>
                  <Textarea
                    id="conditionLogic"
                    value={selectedTask.conditionLogic || ''}
                    onChange={(e) => handleUpdateTask({
                      ...selectedTask,
                      conditionLogic: e.target.value
                    })}
                    placeholder="e.g. data.status === 'success'"
                    className="font-mono text-sm"
                  />
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Use JavaScript expressions to define conditions. The workflow data is available as 'data'.
                  </p>
                </div>
              )}
              
              {selectedTask.type === 'Trigger' && (
                <div>
                  <Label htmlFor="triggerType">Trigger Type</Label>
                  <Select
                    value={(selectedTask.parameters as any)?.triggerType || 'webhook'}
                    onValueChange={(value) => handleUpdateTask({
                      ...selectedTask,
                      parameters: { 
                        ...selectedTask.parameters,
                        triggerType: value 
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select trigger type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="manual">Manual</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {(selectedTask.parameters as any)?.triggerType === 'schedule' && (
                    <div className="mt-2">
                      <Label htmlFor="schedule">Cron Schedule</Label>
                      <Input
                        id="schedule"
                        placeholder="0 0 * * *"
                        value={(selectedTask.parameters as any)?.schedule || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            schedule: e.target.value 
                          }
                        })}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use cron syntax (e.g., "0 0 * * *" for daily at midnight)
                      </p>
                    </div>
                  )}
                  
                  {(selectedTask.parameters as any)?.triggerType === 'webhook' && (
                    <div className="mt-2">
                      <Label htmlFor="webhookPath">Webhook Path</Label>
                      <Input
                        id="webhookPath"
                        placeholder="/hooks/my-workflow"
                        value={(selectedTask.parameters as any)?.webhookPath || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            webhookPath: e.target.value 
                          }
                        })}
                      />
                    </div>
                  )}
                  
                  {(selectedTask.parameters as any)?.triggerType === 'event' && (
                    <div className="mt-2">
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        placeholder="user.created"
                        value={(selectedTask.parameters as any)?.eventName || ''}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            eventName: e.target.value 
                          }
                        })}
                      />
                    </div>
                  )}
                </div>
              )}
              
              {/* Advanced settings section */}
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium mb-2">Advanced Settings</h4>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="timeout">Timeout (ms)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      placeholder="30000"
                      value={selectedTask.timeout || ''}
                      onChange={(e) => handleUpdateTask({
                        ...selectedTask,
                        timeout: e.target.value ? parseInt(e.target.value) : undefined
                      })}
                    />
                  </div>
                  
                  <div>
                    <Label>Retry Policy</Label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <Label htmlFor="retryAttempts" className="text-xs">Attempts</Label>
                        <Input
                          id="retryAttempts"
                          type="number"
                          placeholder="3"
                          value={selectedTask.retryPolicy?.attempts || ''}
                          onChange={(e) => handleUpdateTask({
                            ...selectedTask,
                            retryPolicy: {
                              ...selectedTask.retryPolicy || { backoffStrategy: 'fixed', initialInterval: 1000 },
                              attempts: e.target.value ? parseInt(e.target.value) : 0
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="retryInterval" className="text-xs">Interval (ms)</Label>
                        <Input
                          id="retryInterval"
                          type="number"
                          placeholder="1000"
                          value={selectedTask.retryPolicy?.initialInterval || ''}
                          onChange={(e) => handleUpdateTask({
                            ...selectedTask,
                            retryPolicy: {
                              ...selectedTask.retryPolicy || { backoffStrategy: 'fixed', attempts: 3 },
                              initialInterval: e.target.value ? parseInt(e.target.value) : 1000
                            }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <Label htmlFor="backoffStrategy" className="text-xs">Backoff Strategy</Label>
                      <Select
                        value={selectedTask.retryPolicy?.backoffStrategy || 'fixed'}
                        onValueChange={(value) => handleUpdateTask({
                          ...selectedTask,
                          retryPolicy: {
                            ...selectedTask.retryPolicy || { attempts: 3, initialInterval: 1000 },
                            backoffStrategy: value as 'fixed' | 'exponential' | 'linear'
                          }
                        })}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select strategy" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed</SelectItem>
                          <SelectItem value="exponential">Exponential</SelectItem>
                          <SelectItem value="linear">Linear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTask(selectedTask.id)}
                className="mt-4"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Transition properties panel
    if (selectedTransition) {
      const sourceTask = workflow.tasks.find(t => t.id === selectedTransition.sourceTaskId);
      const targetTask = workflow.tasks.find(t => t.id === selectedTransition.targetTaskId);
      
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>Source Task</Label>
                <div className="text-sm font-medium">
                  {sourceTask?.name || 'Unknown'}
                </div>
              </div>
              
              <div>
                <Label>Target Task</Label>
                <div className="text-sm font-medium">
                  {targetTask?.name || 'Unknown'}
                </div>
              </div>
              
              <div>
                <Label htmlFor="transitionCondition">Condition (Optional)</Label>
                <Textarea
                  id="transitionCondition"
                  value={selectedTransition.condition || ''}
                  onChange={(e) => handleUpdateTransition({
                    ...selectedTransition,
                    condition: e.target.value
                  })}
                  placeholder="Leave empty for unconditional transition"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Define an optional condition for this transition. If empty, the transition is always taken.
                </p>
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTransition(selectedTransition.id)}
                className="mt-4"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Connection
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    // Default properties panel
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6 text-gray-500">
            <Settings2Icon className="mx-auto h-10 w-10 mb-2 text-gray-400" />
            <p>Select a task or connection to edit its properties</p>
            
            {isAddingTransition && (
              <div className="mt-4 p-2 bg-blue-50 rounded border border-blue-200 text-blue-700 text-sm">
                <p className="font-medium">Creating connection</p>
                <p className="text-xs mt-1">Click on another task to complete the connection or click anywhere to cancel.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelTransition}
                  className="mt-2"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  // Render workflow templates dialog
  const renderWorkflowTemplatesDialog = () => {
    return (
      <Dialog open={showWorkflowTemplates} onOpenChange={setShowWorkflowTemplates}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Workflow Templates</DialogTitle>
            <DialogDescription>
              Choose a template to quickly start with a pre-defined workflow
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-all"
              onClick={() => handleLoadTemplate("data-sync")}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <DatabaseIcon className="h-8 w-8 mr-2 text-blue-500" />
                  <div>
                    <h3 className="font-medium">Data Synchronization</h3>
                    <p className="text-xs text-muted-foreground">
                      Sync data between two systems
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>4 tasks: Schedule Trigger → Fetch Source → Transform → Send to Target</p>
                </div>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-all"
              onClick={() => handleLoadTemplate("approval-process")}
            >
              <CardContent className="p-4">
                <div className="flex items-center mb-2">
                  <FileTextIcon className="h-8 w-8 mr-2 text-green-500" />
                  <div>
                    <h3 className="font-medium">Approval Process</h3>
                    <p className="text-xs text-muted-foreground">
                      Handle approval workflows with conditions
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <p>4 tasks: Trigger → Condition → Manager Approval or Auto Approval</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWorkflowTemplates(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Render workflow preview and validation dialog
  const renderPreviewDialog = () => {
    return (
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertCircleIcon className="h-5 w-5 text-amber-500 mr-2" />
              Workflow Validation
            </DialogTitle>
            <DialogDescription>
              Please address the following issues before running the workflow
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {validationErrors.length > 0 ? (
              <div className="space-y-2">
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-start p-2 bg-red-50 border border-red-200 rounded text-sm">
                    <AlertCircleIcon className="h-4 w-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded text-sm flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Workflow is valid and ready to run
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              Close
            </Button>
            {validationErrors.length === 0 && (
              <Button onClick={() => {
                setPreviewDialogOpen(false);
                runWorkflowMutation.mutate();
              }}>
                Run Workflow
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  
  // Loading state
  if (isLoadingWorkflow) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Loading workflow...</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Main render
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Input
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({
                ...prev,
                name: e.target.value
              }))}
              className="text-2xl font-bold bg-transparent border-transparent hover:border-gray-300 focus:border-primary w-auto min-w-[300px]"
            />
            <Badge variant="outline">{`v${workflow.version}`}</Badge>
          </div>
          <div className="flex mt-1 gap-4">
            <Textarea
              value={workflow.description}
              onChange={(e) => setWorkflow(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Add a workflow description..."
              className="h-8 text-sm text-gray-500 bg-transparent border-transparent hover:border-gray-300 focus:border-primary resize-none"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setPreviewDialogOpen(true)}
            className="flex items-center"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Validate
          </Button>
          <Button 
            onClick={handleSaveWorkflow} 
            disabled={saveWorkflowMutation.isPending}
            className="flex items-center"
          >
            <SaveIcon className="h-4 w-4 mr-2" />
            Save{saveWorkflowMutation.isPending ? "ing..." : ""}
          </Button>
          <Button 
            onClick={handleRunWorkflow} 
            disabled={runWorkflowMutation.isPending} 
            variant="secondary"
            className="flex items-center"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="designer">Designer</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>
        
        <TabsContent value="designer">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-9">
              {renderCanvas()}
            </div>
            
            <div className="col-span-3 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-4">Add Task</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3"
                      onClick={() => handleAddTask('Trigger')}
                    >
                      <PlusIcon className="h-5 w-5 mb-1 text-green-500" />
                      <span>Trigger</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3"
                      onClick={() => handleAddTask('Action')}
                    >
                      <PlusIcon className="h-5 w-5 mb-1 text-blue-500" />
                      <span>Action</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3"
                      onClick={() => handleAddTask('Condition')}
                    >
                      <PlusIcon className="h-5 w-5 mb-1 text-yellow-500" />
                      <span>Condition</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="flex flex-col h-auto py-3"
                      onClick={() => handleAddTask('SubWorkflow')}
                    >
                      <PlusIcon className="h-5 w-5 mb-1 text-purple-500" />
                      <span>SubWorkflow</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {renderPropertiesPanel()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="json">
          <Card>
            <CardContent className="pt-6">
              <pre className="bg-slate-50 p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                {JSON.stringify(workflow, null, 2)}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {renderWorkflowTemplatesDialog()}
      {renderPreviewDialog()}
    </div>
  );
};

export default WorkflowDesigner;
