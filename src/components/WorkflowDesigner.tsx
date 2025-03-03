
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
  Link2Icon
} from "lucide-react";

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
  
  // Fix: Use useQuery with the proper approach for handling data
  const { isLoading: isLoadingWorkflow, data: workflowData } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowId ? mockFetchWorkflow(workflowId) : null,
    enabled: !!workflowId,
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
    if (workflow.tasks.length === 0) {
      toast.error("Cannot run an empty workflow");
      return;
    }
    
    // Check if there's a trigger task
    const hasTrigger = workflow.tasks.some(task => task.type === 'Trigger');
    if (!hasTrigger) {
      toast.error("Workflow must have at least one Trigger task");
      return;
    }
    
    runWorkflowMutation.mutate();
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
          </div>
        ))}
        
        {/* Add a helper message when the canvas is empty */}
        {workflow.tasks.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Settings2Icon className="mx-auto h-10 w-10 mb-2" />
              <p>Start by adding a task from the panel on the right</p>
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
                  <select
                    id="actionType"
                    className="w-full p-2 border rounded-md"
                    value={selectedTask.actionType || 'HttpRequest'}
                    onChange={(e) => handleUpdateTask({
                      ...selectedTask,
                      actionType: e.target.value as ActionType
                    })}
                  >
                    <option value="HttpRequest">HTTP Request</option>
                    <option value="DatabaseOperation">Database Operation</option>
                    <option value="MessageQueue">Message Queue</option>
                    <option value="ScriptExecution">Script Execution</option>
                    <option value="DummyAction">Dummy Action</option>
                  </select>
                  
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
                      <select
                        id="requestMethod"
                        className="w-full p-2 border rounded-md"
                        value={(selectedTask.parameters as any)?.method || 'GET'}
                        onChange={(e) => handleUpdateTask({
                          ...selectedTask,
                          parameters: { 
                            ...selectedTask.parameters,
                            method: e.target.value 
                          }
                        })}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                  )}
                </div>
              )}
              
              {selectedTask.type === 'Condition' && (
                <div>
                  <Label htmlFor="conditionLogic">Condition Logic</Label>
                  <Input
                    id="conditionLogic"
                    value={selectedTask.conditionLogic || ''}
                    onChange={(e) => handleUpdateTask({
                      ...selectedTask,
                      conditionLogic: e.target.value
                    })}
                    placeholder="e.g. data.status === 'success'"
                  />
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Use JavaScript expressions to define conditions. The workflow data is available as 'data'.
                  </p>
                </div>
              )}
              
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
                <Input
                  id="transitionCondition"
                  value={selectedTransition.condition || ''}
                  onChange={(e) => handleUpdateTransition({
                    ...selectedTransition,
                    condition: e.target.value
                  })}
                  placeholder="Leave empty for unconditional transition"
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
          <h1 className="text-2xl font-bold">{workflow.name}</h1>
          <p className="text-gray-500">{workflow.description || 'No description'}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveWorkflow} disabled={saveWorkflowMutation.isPending}>
            <SaveIcon className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button onClick={handleRunWorkflow} disabled={runWorkflowMutation.isPending} variant="secondary">
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
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="workflowName">Workflow Name</Label>
                      <Input
                        id="workflowName"
                        value={workflow.name}
                        onChange={(e) => setWorkflow(prev => ({
                          ...prev,
                          name: e.target.value
                        }))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="workflowDescription">Description</Label>
                      <Input
                        id="workflowDescription"
                        value={workflow.description}
                        onChange={(e) => setWorkflow(prev => ({
                          ...prev,
                          description: e.target.value
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
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
    </div>
  );
};

export default WorkflowDesigner;
