
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WorkflowDesigner from "@/components/WorkflowDesigner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, FileTextIcon, DatabaseIcon, ArrowRightIcon, AlertCircle, BrainIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const WorkflowDesignerPage = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const [activeTab, setActiveTab] = useState("designer");
  const [isLoading, setIsLoading] = useState(!!workflowId);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // If workflowId is provided, verify it exists
    if (workflowId) {
      setIsLoading(true);
      try {
        // Check if the workflow exists in localStorage
        const savedWorkflows = JSON.parse(localStorage.getItem("workflows") || "[]");
        const workflowExists = savedWorkflows.some((w: any) => w.id === workflowId);
        
        if (!workflowExists) {
          setError(`Workflow with ID "${workflowId}" not found`);
          toast({
            title: "Workflow Not Found",
            description: `The workflow you're trying to access doesn't exist. Redirecting to designer.`,
            variant: "destructive",
          });
          
          // Redirect to the designer without ID after a short delay
          setTimeout(() => {
            navigate("/workflow-designer");
          }, 2000);
        }
      } catch (err) {
        console.error("Error fetching workflow:", err);
        setError("Failed to load workflow data");
      } finally {
        setIsLoading(false);
      }
    }
  }, [workflowId, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 mb-8">
          <Alert className="bg-primary/5 border-primary/20">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Workflow Automation</AlertTitle>
            <AlertDescription>
              Create and manage automated workflows using our visual designer. Connect tasks, define conditions, and automate your business processes.
            </AlertDescription>
          </Alert>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!workflowId && !error && (
            <div className="mt-8 mb-4">
              <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-full">
                        <FileTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">1. Define Tasks</h3>
                        <p className="text-sm text-muted-foreground">
                          Start by adding different types of tasks to your workflow: Triggers, Actions, and Conditions.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <ArrowRightIcon className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">2. Connect Tasks</h3>
                        <p className="text-sm text-muted-foreground">
                          Create connections between tasks to define the flow of execution. Add conditions to create branching paths.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-100 p-3 rounded-full">
                        <DatabaseIcon className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">3. Configure & Run</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure each task's parameters, save your workflow, and run it to see it in action.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex justify-end gap-2">
            <Link to="/dataset-management">
              <button className="bg-primary/10 hover:bg-primary/20 text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1">
                <BrainIcon className="h-4 w-4" />
                Dataset Management
              </button>
            </Link>
            <Link to="/workflows">
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Back to Dashboard
              </button>
            </Link>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="container mx-auto px-4">
          <TabsList className="mb-4">
            <TabsTrigger value="designer">Designer</TabsTrigger>
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="designer">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                <span className="ml-3">Loading workflow...</span>
              </div>
            ) : (
              <WorkflowDesigner workflowId={error ? undefined : workflowId} />
            )}
          </TabsContent>
          
          <TabsContent value="documentation">
            <div className="prose prose-slate max-w-none">
              <h2>Workflow Designer Documentation</h2>
              
              <h3>Task Types</h3>
              <ul>
                <li>
                  <strong>Trigger</strong> - The entry point of a workflow. A workflow can have multiple triggers.
                  Types include webhook, schedule, event, and manual triggers.
                </li>
                <li>
                  <strong>Action</strong> - Performs operations like HTTP requests, database operations, message queue operations, script execution, or data processing.
                </li>
                <li>
                  <strong>Condition</strong> - Creates branching paths in the workflow based on data-driven conditions. Uses JavaScript expressions for evaluation.
                </li>
                <li>
                  <strong>SubWorkflow</strong> - Embeds another workflow as a task, allowing for modular and reusable workflow components.
                </li>
              </ul>
              
              <h3>Transitions</h3>
              <p>
                Transitions connect tasks and define the flow of execution. Transitions can have optional conditions that determine whether the path is taken.
              </p>
              
              <h3>Advanced Features</h3>
              <ul>
                <li>
                  <strong>Retry Policies</strong> - Configure retry attempts, backoff strategies, and intervals for failed tasks.
                </li>
                <li>
                  <strong>Timeouts</strong> - Set maximum execution time for tasks to prevent hanging workflows.
                </li>
                <li>
                  <strong>Parameters</strong> - Configure task-specific parameters for customized behavior.
                </li>
              </ul>

              <h3>Data Processing Features</h3>
              <p>
                The workflow designer includes powerful data processing capabilities for transforming and validating data:
              </p>
              <ul>
                <li>
                  <strong>Data Sources</strong> - Configure various data sources including CSV, JSON, XML, TXT, and PDF files.
                </li>
                <li>
                  <strong>Transformations</strong> - Apply normalization, filtering, and augmentation to your data.
                </li>
                <li>
                  <strong>Validation</strong> - Define validation rules to ensure data quality and consistency.
                </li>
                <li>
                  <strong>Output Formats</strong> - Export processed data in various formats like JSON, CSV, or XML.
                </li>
              </ul>
              
              <h3>Best Practices</h3>
              <ul>
                <li>Start with a trigger task that defines how the workflow is initiated</li>
                <li>Use descriptive names for tasks and transitions</li>
                <li>Add conditions to transitions for creating branching logic</li>
                <li>Configure retry policies for tasks that might fail</li>
                <li>Use the validation feature before running workflows</li>
                <li>Break complex workflows into smaller, reusable sub-workflows</li>
                <li>For data processing workflows, validate input data before processing</li>
                <li>Use appropriate data transformation techniques based on your data type</li>
              </ul>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default WorkflowDesignerPage;
