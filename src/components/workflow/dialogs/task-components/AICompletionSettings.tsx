
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
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
  return (
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
      </div>

      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          placeholder="Enter your prompt instructions here..."
          className="h-32"
        />
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
  );
};

export default AICompletionSettings;
