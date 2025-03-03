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
  AlertCircleIcon
} from "lucide-react";

// Mock API function - in a real app, this would be replaced with actual API calls
const mockFetchWorkflow = async (id: string): Promise<Workflow> => {
  // For demo purposes, return a sample workflow
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

// Mock save workflow function
const mockSaveWorkflow = async (workflow: Workflow): Promise<Workflow> => {
  console.log("Saving workflow:", workflow);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    ...workflow,
    updatedAt: new Date().toISOString(),
    version: workflow.version + 1
  };
};

// Mock run workflow function
const mockRunWorkflow = async (workflowId: string): Promise<{ executionId: string }> => {
  console.log("Running workflow:", workflowId);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { executionId: uuidv4() };
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
  
  // Fetch workflow if ID is provided
  const { isLoading: isLoadingWorkflow, data: workflowData } = useQuery({
    queryKey: ['workflow', workflowId],
    queryFn: () => workflowId ? mockFetchWorkflow(workflowId) : null,
    enabled: !!workflowId,
  });

  // Process data after query completes
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
  
  // Handle task creation
  const handleAddTask = (type: TaskType) => {
    const newTask: Task = {
      id: uuidv4(),
      name: `New ${type}`,
      type,
      parameters: {},
      dependencies: [],
      position: { x: 200, y: 200 }
    };
    
    setWorkflow(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    
    setSelectedTask(newTask);
  };
  
  // Handle task selection
  const handleSelectTask = (taskId: string) => {
    const task = workflow.tasks.find(t => t.id === taskId) || null;
    setSelectedTask(task);
    setSelectedTransition(null);
  };
  
  // Handle task update
  const handleUpdateTask = (updatedTask: Task) => {
    setWorkflow(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
    setSelectedTask(updatedTask);
  };
  
  // Handle task deletion
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
  };
  
  // Handle transition creation
  const handleAddTransition = (sourceTaskId: string, targetTaskId: string) => {
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
  };
  
  // Handle save workflow
  const handleSaveWorkflow = () => {
    saveWorkflowMutation.mutate(workflow);
  };
  
  // Handle run workflow
  const handleRunWorkflow = () => {
    runWorkflowMutation.mutate();
  };
  
  // Simple canvas rendering - in a real app, this would be much more advanced
  const renderCanvas = () => {
    return (
      <div 
        ref={canvasRef}
        className="relative w-full h-[600px] bg-slate-50 border rounded-lg overflow-auto"
      >
        {/* Render tasks */}
        {workflow.tasks.map(task => (
          <div
            key={task.id}
            className={`absolute p-4 rounded-lg shadow-md cursor-move ${
              selectedTask?.id === task.id ? 'ring-2 ring-primary' : ''
            } ${
              task.type === 'Action' ? 'bg-blue-100' :
              task.type === 'Condition' ? 'bg-yellow-100' :
              task.type === 'Trigger' ? 'bg-green-100' : 'bg-purple-100'
            }`}
            style={{
              left: `${task.position.x}px`,
              top: `${task.position.y}px`,
              width: '200px'
            }}
            onClick={() => handleSelectTask(task.id)}
          >
            <div className="font-medium">{task.name}</div>
            <div className="text-xs text-gray-500">{task.type}</div>
            {task.actionType && (
              <div className="text-xs text-gray-500">{task.actionType}</div>
            )}
          </div>
        ))}
        
        {/* Render transitions (simplified) */}
        <svg className="absolute inset-0 pointer-events-none">
          {workflow.transitions.map(transition => {
            const sourceTask = workflow.tasks.find(t => t.id === transition.sourceTaskId);
            const targetTask = workflow.tasks.find(t => t.id === transition.targetTaskId);
            
            if (!sourceTask || !targetTask) return null;
            
            const startX = sourceTask.position.x + 100;
            const startY = sourceTask.position.y + 30;
            const endX = targetTask.position.x;
            const endY = targetTask.position.y + 30;
            
            return (
              <g key={transition.id}>
                <line
                  x1={startX}
                  y1={startY}
                  x2={endX}
                  y2={endY}
                  stroke={selectedTransition?.id === transition.id ? "#0284c7" : "#94a3b8"}
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
          
          {/* Arrow marker definition */}
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
        </svg>
      </div>
    );
  };
  
  // Render the properties panel based on selection
  const renderPropertiesPanel = () => {
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
                <div className="text-sm">{selectedTask.type}</div>
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
    
    if (selectedTransition) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label>Source Task</Label>
                <div className="text-sm">
                  {workflow.tasks.find(t => t.id === selectedTransition.sourceTaskId)?.name || 'Unknown'}
                </div>
              </div>
              
              <div>
                <Label>Target Task</Label>
                <div className="text-sm">
                  {workflow.tasks.find(t => t.id === selectedTransition.targetTaskId)?.name || 'Unknown'}
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
              </div>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteTransition(selectedTransition.id)}
                className="mt-4"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Transition
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }
    
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-6 text-gray-500">
            <Settings2Icon className="mx-auto h-10 w-10 mb-2 text-gray-400" />
            <p>Select a task or transition to edit its properties</p>
          </div>
        </CardContent>
      </Card>
    );
  };
  
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
