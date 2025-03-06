
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WebhookTriggerSettingsProps {
  endpoint: string;
  method: string;
  authentication: any;
  secretKey: string;
  enableRateLimit: boolean;
  rateLimitPerMinute: number;
  responseTemplate: string;
  onEndpointChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onAuthenticationChange: (value: any) => void;
  onSecretKeyChange: (value: string) => void;
  onEnableRateLimitChange: (value: boolean) => void;
  onRateLimitPerMinuteChange: (value: number) => void;
  onResponseTemplateChange: (value: string) => void;
}

const WebhookTriggerSettings: React.FC<WebhookTriggerSettingsProps> = ({
  endpoint,
  method,
  authentication,
  secretKey,
  enableRateLimit,
  rateLimitPerMinute,
  responseTemplate,
  onEndpointChange,
  onMethodChange,
  onAuthenticationChange,
  onSecretKeyChange,
  onEnableRateLimitChange,
  onRateLimitPerMinuteChange,
  onResponseTemplateChange
}) => {
  const { toast } = useToast();
  const webhookUrl = `https://api.example.com/webhooks/${endpoint}`;

  const generateSecretKey = () => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    const newKey = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    onSecretKeyChange(newKey);
    
    toast({
      title: "Secret Key Generated",
      description: "A new secret key has been generated successfully."
    });
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast({
      title: "Webhook URL Copied",
      description: "The webhook URL has been copied to your clipboard."
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-3 border rounded-md bg-secondary/20 space-y-2">
        <h3 className="text-sm font-medium">Webhook URL</h3>
        <div className="flex space-x-2">
          <Input 
            value={webhookUrl} 
            readOnly 
            className="font-mono text-xs bg-background/50"
          />
          <Button size="icon" variant="outline" onClick={copyWebhookUrl}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          This is the URL that external services will call to trigger your workflow.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="endpoint">Endpoint Name</Label>
        <Input
          id="endpoint"
          value={endpoint}
          onChange={(e) => onEndpointChange(e.target.value)}
          placeholder="my-webhook-endpoint"
        />
        <p className="text-xs text-muted-foreground">
          A unique identifier for this webhook. Use only lowercase letters, numbers, and hyphens.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="method">HTTP Method</Label>
        <Select
          value={method}
          onValueChange={onMethodChange}
        >
          <SelectTrigger id="method">
            <SelectValue placeholder="Select HTTP method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="PATCH">PATCH</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="authType">Authentication Type</Label>
        <Select
          value={authentication?.type || "none"}
          onValueChange={(value) => onAuthenticationChange({ type: value })}
        >
          <SelectTrigger id="authType">
            <SelectValue placeholder="Select authentication type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="header">Header Authentication</SelectItem>
            <SelectItem value="basic">Basic Authentication</SelectItem>
            <SelectItem value="bearer">Bearer Token</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="secretKey">Secret Key</Label>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generateSecretKey}
            className="h-7 text-xs"
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Generate
          </Button>
        </div>
        <Input
          id="secretKey"
          value={secretKey}
          onChange={(e) => onSecretKeyChange(e.target.value)}
          placeholder="Enter a secret key to validate webhook requests"
          className={secretKey ? "font-mono" : ""}
        />
        <p className="text-xs text-muted-foreground">
          Used to verify that webhook requests are legitimate.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="enableRateLimit"
          checked={enableRateLimit}
          onCheckedChange={onEnableRateLimitChange}
        />
        <Label htmlFor="enableRateLimit">Enable Rate Limiting</Label>
      </div>

      {enableRateLimit && (
        <div className="space-y-2">
          <Label htmlFor="rateLimitPerMinute">Requests Per Minute</Label>
          <Input
            id="rateLimitPerMinute"
            type="number"
            min={1}
            max={1000}
            value={rateLimitPerMinute}
            onChange={(e) => onRateLimitPerMinuteChange(parseInt(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Maximum number of webhook triggers allowed per minute.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="responseTemplate">Response Template (Optional)</Label>
        <Textarea
          id="responseTemplate"
          value={responseTemplate}
          onChange={(e) => onResponseTemplateChange(e.target.value)}
          placeholder='{ "status": "success", "message": "Webhook received" }'
          className="h-24 font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Custom JSON response to send back when the webhook is triggered.
        </p>
      </div>
    </div>
  );
};

export default WebhookTriggerSettings;
