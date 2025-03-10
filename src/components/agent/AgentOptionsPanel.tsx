
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Settings, Database, Ear, Share, Download } from "lucide-react";
import VoiceSelector from "./VoiceSelector";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ExportDialog from "./ExportDialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface AgentOptionsPanelProps {
  agent: any; // Using any for simplicity, but should be properly typed
  onUpdateAgent: (updates: Partial<any>) => void;
}

const AgentOptionsPanel = ({ agent, onUpdateAgent }: AgentOptionsPanelProps) => {
  const [activeTab, setActiveTab] = useState("voice");
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  
  const handleVoiceSelect = (voiceId: string) => {
    onUpdateAgent({ selectedVoiceId: voiceId });
  };

  const toggleFeature = (feature: string, enabled: boolean) => {
    onUpdateAgent({ [feature]: enabled });
  };

  return (
    <>
      <Tabs defaultValue="voice" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="voice" className="flex items-center gap-1">
            <Ear className="h-4 w-4" />
            Voice
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="voice" className="space-y-4 min-h-[400px]">
          <VoiceSelector 
            onSelectVoice={handleVoiceSelect}
            selectedVoiceId={agent.selectedVoiceId}
          />
        </TabsContent>
        
        <TabsContent value="data" className="space-y-4 min-h-[400px]">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Knowledge Sources</CardTitle>
                <CardDescription>
                  Connect data sources to enhance your agent
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <Database className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Document Database</p>
                        <p className="text-xs text-muted-foreground">
                          PDF, DOCX, TXT files
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                          <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Web Crawler</p>
                        <p className="text-xs text-muted-foreground">
                          Websites and online content
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-secondary/30 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary">
                          <rect width="20" height="14" x="2" y="5" rx="2" />
                          <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium">API Integration</p>
                        <p className="text-xs text-muted-foreground">
                          Connect to external APIs
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Manage Data Sources
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Memory & Context</CardTitle>
                <CardDescription>
                  Configure how your agent remembers conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="long-term-memory" className="text-sm font-medium">Long-term Memory</Label>
                      <p className="text-xs text-muted-foreground">
                        Agent remembers past conversations
                      </p>
                    </div>
                    <Switch 
                      id="long-term-memory" 
                      checked={agent.longTermMemory || false}
                      onCheckedChange={(checked) => toggleFeature('longTermMemory', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="web-search" className="text-sm font-medium">Web Search</Label>
                      <p className="text-xs text-muted-foreground">
                        Agent can search the internet for information
                      </p>
                    </div>
                    <Switch 
                      id="web-search" 
                      checked={agent.webSearch || false}
                      onCheckedChange={(checked) => toggleFeature('webSearch', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="conversation-history" className="text-sm font-medium">Conversation History</Label>
                      <p className="text-xs text-muted-foreground">
                        Store conversations for future reference
                      </p>
                    </div>
                    <Switch 
                      id="conversation-history" 
                      checked={agent.storeConversationHistory || false}
                      onCheckedChange={(checked) => toggleFeature('storeConversationHistory', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-4 min-h-[400px]">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Agent Mode</CardTitle>
                <CardDescription>
                  Configure how your agent operates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="demo-mode" className="text-sm font-medium">Demo Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Use simulated responses without model download
                      </p>
                    </div>
                    <Switch 
                      id="demo-mode" 
                      checked={agent.useDemoMode || false}
                      onCheckedChange={(checked) => toggleFeature('useDemoMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="stream-response" className="text-sm font-medium">Stream Response</Label>
                      <p className="text-xs text-muted-foreground">
                        Show responses as they're being generated
                      </p>
                    </div>
                    <Switch 
                      id="stream-response" 
                      checked={agent.streamResponse !== false}
                      onCheckedChange={(checked) => toggleFeature('streamResponse', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="disable-logging" className="text-sm font-medium">Privacy Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Disable logging of conversations
                      </p>
                    </div>
                    <Switch 
                      id="disable-logging" 
                      checked={agent.privacyMode || false}
                      onCheckedChange={(checked) => toggleFeature('privacyMode', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Export & Share</CardTitle>
                <CardDescription>
                  Export agent configuration or share your agent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsExportDialogOpen(true)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Configuration
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    Share Agent
                    <Badge className="ml-auto" variant="secondary">Coming Soon</Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Separator />
            
            <div className="flex justify-between">
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                Delete Agent
              </Button>
              <Button variant="outline" size="sm">
                Reset to Defaults
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <ExportDialog 
        open={isExportDialogOpen}
        onOpenChange={setIsExportDialogOpen}
        agent={agent}
      />
    </>
  );
};

export default AgentOptionsPanel;
