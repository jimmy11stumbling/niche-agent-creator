
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Workflow } from "@/types/workflow";
import { toast } from "sonner";
import { 
  PlusIcon, 
  Search, 
  RefreshCw, 
  CircleCheck, 
  AlertCircle, 
  Clock, 
  Play, 
  Calendar, 
  LineChart,
  CirclePause
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Define types for executions
interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: 'running' | 'completed' | 'failed' | 'paused';
  startTime: string;
  endTime?: string;
  taskResults: any[];
}

const WorkflowDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("workflows");
  
  // Get highlighted execution from URL query param
  const searchParams = new URLSearchParams(location.search);
  const highlightedExecution = searchParams.get('execution');
  
  // Load workflows and executions from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        
        // Load workflows
        const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
        setWorkflows(savedWorkflows);
        
        // Load executions
        const savedExecutions = JSON.parse(localStorage.getItem("workflow_executions") || "[]");
        setExecutions(savedExecutions);
        
        // If there's a highlighted execution, switch to the executions tab
        if (highlightedExecution) {
          setCurrentTab("executions");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Error loading workflows");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
    
    // Set up polling for executions (to simulate live updates)
    const interval = setInterval(() => {
      const savedExecutions = JSON.parse(localStorage.getItem("workflow_executions") || "[]");
      setExecutions(savedExecutions);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [highlightedExecution]);
  
  // Filter workflows based on search term
  const filteredWorkflows = workflows.filter(workflow => 
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workflow.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Filter executions based on search term
  const filteredExecutions = executions.filter(execution => {
    const workflow = workflows.find(w => w.id === execution.workflowId);
    return (
      execution.id.includes(searchTerm) ||
      (workflow && workflow.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  // Get a workflow by ID
  const getWorkflowById = (id: string) => {
    return workflows.find(w => w.id === id);
  };
  
  // Handle running a workflow
  const handleRunWorkflow = (workflowId: string) => {
    const executionId = crypto.randomUUID();
    
    // Create a new execution record
    const newExecution: WorkflowExecution = {
      id: executionId,
      workflowId,
      status: 'running',
      startTime: new Date().toISOString(),
      taskResults: []
    };
    
    // Add to executions
    const updatedExecutions = [...executions, newExecution];
    setExecutions(updatedExecutions);
    localStorage.setItem("workflow_executions", JSON.stringify(updatedExecutions));
    
    toast.success("Workflow execution started");
    
    // Simulate execution completion after a delay
    setTimeout(() => {
      const currentExecutions = JSON.parse(localStorage.getItem("workflow_executions") || "[]");
      const executionIndex = currentExecutions.findIndex((e: WorkflowExecution) => e.id === executionId);
      
      if (executionIndex >= 0) {
        currentExecutions[executionIndex] = {
          ...currentExecutions[executionIndex],
          status: 'completed',
          endTime: new Date().toISOString()
        };
        
        localStorage.setItem("workflow_executions", JSON.stringify(currentExecutions));
        setExecutions(currentExecutions);
        toast.success("Workflow execution completed");
      }
    }, 3000 + Math.random() * 5000); // Random time between 3-8 seconds
    
    // Switch to executions tab
    setCurrentTab("executions");
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy HH:mm:ss');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Calculate duration for executions
  const calculateDuration = (startTime: string, endTime?: string) => {
    try {
      const start = new Date(startTime).getTime();
      const end = endTime ? new Date(endTime).getTime() : Date.now();
      const durationMs = end - start;
      
      if (durationMs < 1000) {
        return `${durationMs}ms`;
      } else if (durationMs < 60000) {
        return `${Math.round(durationMs / 1000)}s`;
      } else {
        const minutes = Math.floor(durationMs / 60000);
        const seconds = Math.round((durationMs % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CircleCheck className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500"><RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-500"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500"><CirclePause className="h-3 w-3 mr-1" /> Paused</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Workflow Dashboard</h1>
        <Link to="/workflows/designer">
          <Button>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </Link>
      </div>
      
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search workflows and executions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="workflows">
            <Play className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="executions">
            <Clock className="h-4 w-4 mr-2" />
            Executions
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <LineChart className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="workflows">
          {isLoading ? (
            <div className="text-center py-10">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="mt-2">Loading workflows...</p>
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Workflows Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No workflows match your search criteria.' : 'You haven\'t created any workflows yet.'}
                </p>
                <Link to="/workflows/designer">
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Your First Workflow
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-4 h-12 overflow-hidden">
                      {workflow.description || 'No description provided'}
                    </p>
                    
                    <div className="flex items-center text-xs text-muted-foreground mb-4">
                      <div className="flex items-center mr-4">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(workflow.updatedAt)}
                      </div>
                      <div>
                        {workflow.tasks.length} tasks
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/workflows/designer/${workflow.id}`)}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleRunWorkflow(workflow.id)}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Run
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="executions">
          {isLoading ? (
            <div className="text-center py-10">
              <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
              <p className="mt-2">Loading workflow executions...</p>
            </div>
          ) : filteredExecutions.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No Executions Found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? 'No executions match your search criteria.' : 'You haven\'t run any workflows yet.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Execution ID</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExecutions.map((execution) => {
                      const workflow = getWorkflowById(execution.workflowId);
                      const isHighlighted = execution.id === highlightedExecution;
                      
                      return (
                        <TableRow 
                          key={execution.id}
                          className={isHighlighted ? 'bg-primary/5' : ''}
                        >
                          <TableCell className="font-mono text-xs">
                            {execution.id.substring(0, 8)}...
                          </TableCell>
                          <TableCell>
                            {workflow ? workflow.name : 'Unknown workflow'}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(execution.status)}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            {formatDate(execution.startTime)}
                          </TableCell>
                          <TableCell>
                            {calculateDuration(execution.startTime, execution.endTime)}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                // View execution details (in a real app, this would navigate to a details page)
                                toast.info("Execution details view not implemented in this demo");
                              }}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-10">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Track workflow performance metrics, success rates, and execution trends.
                </p>
                <p className="text-xs text-muted-foreground">
                  This feature will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowDashboard;
