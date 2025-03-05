
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkflowEditor } from "./workflow/hooks/useWorkflowEditor";
import WorkflowEditorSidebar from "./workflow/WorkflowEditorSidebar";
import WorkflowSavedList from "./workflow/WorkflowSavedList";
import TaskDialog from "./workflow/dialogs/TaskDialog";
import TransitionDialog from "./workflow/dialogs/TransitionDialog";
import ValidationDialog from "./workflow/dialogs/ValidationDialog";
import SaveDialog from "./workflow/dialogs/SaveDialog";
import WorkflowCanvas from "./workflow/components/WorkflowCanvas";
import WorkflowToolbar from "./workflow/components/WorkflowToolbar";
import { ACTION_TYPE_PARAMS } from "./workflow/constants";

interface WorkflowDesignerProps {
  workflowId?: string;
}

const WorkflowDesigner: React.FC<WorkflowDesignerProps> = ({ workflowId }) => {
  const {
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
  } = useWorkflowEditor(workflowId);

  const { sourceTaskName, targetTaskName } = getTransitionTaskNames();

  return (
    <div className="h-full flex flex-col">
      {/* Toolbar */}
      <WorkflowToolbar 
        isDirty={isDirty}
        isLoading={isLoading}
        onNewWorkflow={handleNewWorkflow}
        onShowSaveDialog={() => setShowSaveDialog(true)}
        onDuplicateWorkflow={handleDuplicateWorkflow}
        onSelectTemplate={handleApplyTemplate}
        onExportWorkflow={handleExportWorkflow}
        onImportWorkflow={handleImportWorkflow}
        onValidateWorkflow={handleValidateWorkflow}
        onRunWorkflow={handleRunWorkflow}
      />
      
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
          <WorkflowCanvas 
            tasks={workflow.tasks}
            transitions={workflow.transitions}
            selectedTaskId={selectedTaskId}
            selectedTransitionId={selectedTransitionId}
            connectionInProgress={connectionInProgress}
            onTaskSelect={handleTaskSelect}
            onTaskMove={handleTaskMove}
            onTransitionSelect={handleTransitionSelect}
            canvasRef={canvasRef}
            onCanvasClick={handleCanvasClick}
            onCanvasMouseMove={handleCanvasMouseMove}
          />
          
          {/* Editor Sidebar */}
          <div className="w-80">
            <WorkflowEditorSidebar
              workflow={workflow}
              selectedTaskId={selectedTaskId}
              selectedTransitionId={selectedTransitionId}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onEditTransition={handleEditTransition}
              onDeleteTransition={handleDeleteTransition}
              onStartConnecting={handleStartConnecting}
              onWorkflowChange={handleWorkflowFieldChange}
            />
          </div>
        </TabsContent>
        
        <TabsContent
          value="saved"
          className="p-4 data-[state=active]:flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <WorkflowSavedList
            workflows={savedWorkflows}
            onLoadWorkflow={handleLoadWorkflow}
            onNewWorkflow={handleNewWorkflow}
          />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <TaskDialog
        task={taskBeingEdited}
        onSave={handleSaveTaskChanges}
        onCancel={() => setTaskBeingEdited(null)}
        updateTask={updateTaskBeingEdited}
      />
      
      <TransitionDialog
        transition={transitionBeingEdited}
        onSave={handleSaveTransitionChanges}
        onCancel={() => setTransitionBeingEdited(null)}
        updateTransition={(transition) => setTransitionBeingEdited(transition)}
        sourceTaskName={sourceTaskName}
        targetTaskName={targetTaskName}
      />
      
      <ValidationDialog
        open={showValidationDialog}
        onOpenChange={setShowValidationDialog}
        validationErrors={validationErrors}
      />
      
      <SaveDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        workflow={workflow}
        onSave={handleSaveWorkflow}
        onWorkflowChange={handleWorkflowFieldChange}
      />
    </div>
  );
};

export default WorkflowDesigner;
