
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Info, Lightbulb, RefreshCw, Settings, Sparkles } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface AICompletionSettingsProps {
  model: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  onModelChange: (value: string) => void;
  onPromptChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
  onTopPChange: (value: number) => void;
  onFrequencyPenaltyChange: (value: number) => void;
  onPresencePenaltyChange: (value: number) => void;
}

const PROMPT_TEMPLATES = [
  {
    name: "Text Summarization",
    description: "Generate a concise summary of the provided text",
    prompt: "Summarize the following text in a clear and concise manner, highlighting the key points:\n\n{{input}}"
  },
  {
    name: "Content Rewriting",
    description: "Rewrite content to improve clarity and engagement",
    prompt: "Rewrite the following content to improve clarity, flow, and engagement while maintaining the original meaning:\n\n{{input}}"
  },
  {
    name: "Data Analysis",
    description: "Analyze data and provide insights",
    prompt: "Analyze the following data and provide key insights, trends, and recommendations:\n\n{{input}}"
  },
  {
    name: "Question Answering",
    description: "Answer questions based on provided context",
    prompt: "Using the following context, please answer the question accurately and concisely.\n\nContext: {{context}}\n\nQuestion: {{question}}"
  }
];

const AI_MODEL_INFO = {
  "gpt-4-turbo": {
    description: "Most capable GPT-4 model for complex tasks",
    maxTokens: 8192,
    suggested: {
      temperature: 0.7,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "gpt-4": {
    description: "Powerful model for reasoning, coding, and creative tasks",
    maxTokens: 8192,
    suggested: {
      temperature: 0.7,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "gpt-3.5-turbo": {
    description: "Fast, cost-effective model for most everyday tasks",
    maxTokens: 4096,
    suggested: {
      temperature: 0.7,
      topP: 1.0,
      frequencyPenalty: 0,
      presencePenalty: 0
    }
  },
  "claude-3-opus": {
    description: "Anthropic's most powerful model for complex reasoning",
    maxTokens: 4096,
    suggested: {
      temperature: 0.5,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    }
  },
  "claude-3-sonnet": {
    description: "Balanced performance for everyday AI tasks",
    maxTokens: 4096,
    suggested: {
      temperature: 0.7,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1
    }
  },
  "llama-3": {
    description: "Open-source model with strong general capabilities",
    maxTokens: 4096,
    suggested: {
      temperature: 0.8,
      topP: 0.95,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2
    }
  }
};

const AICompletionSettings: React.FC<AICompletionSettingsProps> = ({
  model,
  prompt,
  temperature,
  maxTokens,
  topP,
  frequencyPenalty,
  presencePenalty,
  onModelChange,
  onPromptChange,
  onTemperatureChange,
  onMaxTokensChange,
  onTopPChange,
  onFrequencyPenaltyChange,
  onPresencePenaltyChange
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [showPromptTemplates, setShowPromptTemplates] = useState(false);

  const handleApplyTemplate = (templatePrompt: string) => {
    onPromptChange(templatePrompt);
    setShowPromptTemplates(false);
  };

  const handleApplySuggestedSettings = () => {
    if (model && AI_MODEL_INFO[model]) {
      const suggested = AI_MODEL_INFO[model].suggested;
      onTemperatureChange(suggested.temperature);
      onTopPChange(suggested.topP);
      onFrequencyPenaltyChange(suggested.frequencyPenalty);
      onPresencePenaltyChange(suggested.presencePenalty);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="basic">
            <Settings className="mr-2 h-4 w-4" />
            Basic Settings
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Sparkles className="mr-2 h-4 w-4" />
            Advanced Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select
                value={model}
                onValueChange={onModelChange}
              >
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                  <SelectItem value="llama-3">Llama 3</SelectItem>
                </SelectContent>
              </Select>
              
              {model && AI_MODEL_INFO[model] && (
                <p className="text-xs text-muted-foreground mt-1">
                  {AI_MODEL_INFO[model].description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="prompt">Prompt</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowPromptTemplates(!showPromptTemplates)}
                >
                  <Lightbulb className="mr-1 h-3 w-3" />
                  Templates
                </Button>
              </div>
              
              {showPromptTemplates && (
                <div className="p-3 border rounded-md bg-secondary/20 mb-2 space-y-3">
                  <h4 className="text-sm font-medium">Prompt Templates</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {PROMPT_TEMPLATES.map((template, index) => (
                      <div 
                        key={index}
                        className="p-2 border rounded cursor-pointer hover:bg-secondary/20"
                        onClick={() => handleApplyTemplate(template.prompt)}
                      >
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{template.name}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyTemplate(template.prompt);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="w-full text-xs"
                    onClick={() => setShowPromptTemplates(false)}
                  >
                    Close Templates
                  </Button>
                </div>
              )}
              
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                placeholder="Enter your prompt instructions here..."
                className="h-32"
              />
              <p className="text-xs text-muted-foreground">
                Use <Badge variant="outline" className="font-mono text-xs">{"{{input}}"}</Badge> as a placeholder for workflow data
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="temperature">Temperature: {temperature}</Label>
                <span className="text-xs text-muted-foreground">(0-2)</span>
              </div>
              <Slider
                id="temperature"
                value={[temperature]}
                min={0}
                max={2}
                step={0.1}
                onValueChange={(value) => onTemperatureChange(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Controls randomness: Lower values are more deterministic, higher values are more creative.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="max-tokens">Max Tokens: {maxTokens}</Label>
                <span className="text-xs text-muted-foreground">(1-8000)</span>
              </div>
              <Slider
                id="max-tokens"
                value={[maxTokens]}
                min={1}
                max={8000}
                step={1}
                onValueChange={(value) => onMaxTokensChange(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Maximum number of tokens to generate in the completion.
              </p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-4">
            <div className="p-3 border rounded-md bg-secondary/20 mb-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <h4 className="text-sm font-medium">Model Tuning</h4>
                  <p className="text-xs text-muted-foreground">
                    These advanced settings control the behavior of the AI model. 
                    Adjust them carefully for optimal results.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={handleApplySuggestedSettings}
                  >
                    <RefreshCw className="mr-1 h-3 w-3" />
                    Apply Suggested Settings
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="top-p">Top P: {topP}</Label>
                <span className="text-xs text-muted-foreground">(0-1)</span>
              </div>
              <Slider
                id="top-p"
                value={[topP]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={(value) => onTopPChange(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="frequency-penalty">Frequency Penalty: {frequencyPenalty}</Label>
                <span className="text-xs text-muted-foreground">(0-2)</span>
              </div>
              <Slider
                id="frequency-penalty"
                value={[frequencyPenalty]}
                min={0}
                max={2}
                step={0.01}
                onValueChange={(value) => onFrequencyPenaltyChange(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Reduces repetition of token sequences: positive values penalize tokens based on their frequency.
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <Label htmlFor="presence-penalty">Presence Penalty: {presencePenalty}</Label>
                <span className="text-xs text-muted-foreground">(0-2)</span>
              </div>
              <Slider
                id="presence-penalty"
                value={[presencePenalty]}
                min={0}
                max={2}
                step={0.01}
                onValueChange={(value) => onPresencePenaltyChange(value[0])}
              />
              <p className="text-xs text-muted-foreground">
                Reduces repetition of topics: positive values penalize tokens that have already appeared.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICompletionSettings;
