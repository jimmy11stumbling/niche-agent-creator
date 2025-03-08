
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { PlusIcon, MinusIcon } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  enabled: boolean;
  weight: number;
  specialization: string;
}

const MultiAgentSettings = () => {
  const [enableMultiAgent, setEnableMultiAgent] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "agent-1",
      name: "Fact Checker",
      enabled: true,
      weight: 0.8,
      specialization: "Verifying factual accuracy"
    },
    {
      id: "agent-2",
      name: "Creative Writer",
      enabled: true,
      weight: 0.6,
      specialization: "Generating creative responses"
    },
    {
      id: "agent-3",
      name: "Technical Expert",
      enabled: false,
      weight: 0.7,
      specialization: "Providing technical explanations"
    }
  ]);
  
  const [syncFeedback, setSyncFeedback] = useState(true);
  const [autoBalance, setAutoBalance] = useState(true);

  const handleAgentToggle = (agentId: string, enabled: boolean) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId ? { ...agent, enabled } : agent
      )
    );
  };

  const handleWeightChange = (agentId: string, weight: number) => {
    setAgents(prevAgents => 
      prevAgents.map(agent => 
        agent.id === agentId ? { ...agent, weight } : agent
      )
    );
  };

  const addAgent = () => {
    const newAgent: Agent = {
      id: `agent-${agents.length + 1}-${Date.now()}`,
      name: `Agent ${agents.length + 1}`,
      enabled: true,
      weight: 0.5,
      specialization: "General purpose"
    };
    
    setAgents([...agents, newAgent]);
  };

  const removeAgent = (agentId: string) => {
    if (agents.length <= 1) return;
    setAgents(agents.filter(agent => agent.id !== agentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="multi-agent">Enable Multi-Agent Collaboration</Label>
          <p className="text-xs text-muted-foreground">
            Use multiple agents to improve training and responses
          </p>
        </div>
        <Switch
          id="multi-agent"
          checked={enableMultiAgent}
          onCheckedChange={setEnableMultiAgent}
        />
      </div>
      
      {enableMultiAgent && (
        <>
          <div className="space-y-3">
            {agents.map((agent) => (
              <Card key={agent.id} className="overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`agent-${agent.id}`}
                        checked={agent.enabled}
                        onCheckedChange={(checked) => 
                          handleAgentToggle(agent.id, checked === true)
                        }
                      />
                      <Label 
                        htmlFor={`agent-${agent.id}`}
                        className={agent.enabled ? "font-medium" : "font-medium text-muted-foreground"}
                      >
                        {agent.name}
                      </Label>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAgent(agent.id)}
                      disabled={agents.length <= 1}
                    >
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <p className="text-xs text-muted-foreground ml-6 mt-1">
                    {agent.specialization}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3 ml-6">
                    <Label className="text-xs w-10">Weight</Label>
                    <Slider
                      value={[agent.weight * 100]}
                      min={10}
                      max={100}
                      step={5}
                      className="flex-1"
                      disabled={!agent.enabled}
                      onValueChange={([value]) => 
                        handleWeightChange(agent.id, value / 100)
                      }
                    />
                    <span className="text-xs w-8">{(agent.weight * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={addAgent}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Agent
          </Button>
          
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="sync-feedback" className="text-sm">
                Synchronize agent feedback
              </Label>
              <Switch
                id="sync-feedback"
                checked={syncFeedback}
                onCheckedChange={setSyncFeedback}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-balance" className="text-sm">
                Auto-balance agent weights
              </Label>
              <Switch
                id="auto-balance"
                checked={autoBalance}
                onCheckedChange={setAutoBalance}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiAgentSettings;
