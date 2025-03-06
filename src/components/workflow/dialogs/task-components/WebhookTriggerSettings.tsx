
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface WebhookTriggerSettingsProps {
  endpoint: string;
  method: string;
  requireAuth: boolean;
  authType: string;
  authToken: string;
  onEndpointChange: (value: string) => void;
  onMethodChange: (value: string) => void;
  onRequireAuthChange: (value: boolean) => void;
  onAuthTypeChange: (value: string) => void;
  onAuthTokenChange: (value: string) => void;
}

const WebhookTriggerSettings: React.FC<WebhookTriggerSettingsProps> = ({
  endpoint,
  method,
  requireAuth,
  authType,
  authToken,
  onEndpointChange,
  onMethodChange,
  onRequireAuthChange,
  onAuthTypeChange,
  onAuthTokenChange
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="endpoint">Webhook Endpoint</Label>
        <Input
          id="endpoint"
          value={endpoint}
          onChange={(e) => onEndpointChange(e.target.value)}
          placeholder="/api/webhooks/my-webhook"
        />
        <p className="text-xs text-muted-foreground mt-1">
          The endpoint path that will receive webhook requests
        </p>
      </div>

      <div>
        <Label htmlFor="method">HTTP Method</Label>
        <Select value={method} onValueChange={onMethodChange}>
          <SelectTrigger id="method">
            <SelectValue placeholder="Select method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="POST">POST</SelectItem>
            <SelectItem value="GET">GET</SelectItem>
            <SelectItem value="PUT">PUT</SelectItem>
            <SelectItem value="DELETE">DELETE</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          HTTP method that the webhook will accept
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch 
          id="require-auth" 
          checked={requireAuth}
          onCheckedChange={onRequireAuthChange}
        />
        <Label htmlFor="require-auth">Require Authentication</Label>
      </div>

      {requireAuth && (
        <>
          <div>
            <Label htmlFor="auth-type">Authentication Type</Label>
            <Select value={authType} onValueChange={onAuthTypeChange}>
              <SelectTrigger id="auth-type">
                <SelectValue placeholder="Select authentication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="apiKey">API Key</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="auth-token">Authentication Token</Label>
            <Input
              id="auth-token"
              value={authToken}
              onChange={(e) => onAuthTokenChange(e.target.value)}
              type="password"
              placeholder="Enter authentication token or key"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be used to verify incoming webhook requests
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default WebhookTriggerSettings;
