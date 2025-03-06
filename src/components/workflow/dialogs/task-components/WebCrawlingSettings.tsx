
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, FileText, Filter, Database } from "lucide-react";

interface WebCrawlingSettingsProps {
  url: string;
  depth: number;
  followLinks: boolean;
  maxPages: number;
  excludePatterns: string;
  outputFormat: string;
  extractRules: string;
  onUrlChange: (value: string) => void;
  onDepthChange: (value: number) => void;
  onFollowLinksChange: (checked: boolean) => void;
  onMaxPagesChange: (value: number) => void;
  onExcludePatternsChange: (value: string) => void;
  onOutputFormatChange: (value: string) => void;
  onExtractRulesChange: (value: string) => void;
}

const WebCrawlingSettings: React.FC<WebCrawlingSettingsProps> = ({
  url,
  depth,
  followLinks,
  maxPages,
  excludePatterns,
  outputFormat,
  extractRules,
  onUrlChange,
  onDepthChange,
  onFollowLinksChange,
  onMaxPagesChange,
  onExcludePatternsChange,
  onOutputFormatChange,
  onExtractRulesChange,
}) => {
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleTestCrawl = () => {
    if (!url) {
      setTestStatus("Please enter a URL first");
      return;
    }
    
    setTestStatus("Testing crawl configuration...");
    
    // Simulate API call
    setTimeout(() => {
      setTestStatus("Test successful! Configuration is valid.");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Source Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="crawl-url">Starting URL</Label>
              <Input
                id="crawl-url"
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label>Crawl Depth (1-10)</Label>
              <div className="flex items-center space-x-2">
                <Slider
                  value={[depth]}
                  min={1}
                  max={10}
                  step={1}
                  onValueChange={(values) => onDepthChange(values[0])}
                />
                <span className="w-8 text-center">{depth}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="follow-links"
                checked={followLinks}
                onCheckedChange={onFollowLinksChange}
              />
              <Label htmlFor="follow-links">Follow External Links</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-pages">Maximum Pages</Label>
              <Input
                id="max-pages"
                type="number"
                min={1}
                max={1000}
                value={maxPages}
                onChange={(e) => onMaxPagesChange(parseInt(e.target.value))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Filtering & Extraction</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exclude-patterns">Exclude URL Patterns</Label>
              <Textarea
                id="exclude-patterns"
                value={excludePatterns}
                onChange={(e) => onExcludePatternsChange(e.target.value)}
                placeholder="One pattern per line: admin, login, etc."
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">
                URLs containing these patterns will be skipped
              </p>
            </div>

            <div>
              <Label htmlFor="extraction-rules">Content Extraction Rules</Label>
              <Textarea
                id="extraction-rules"
                value={extractRules}
                onChange={(e) => onExtractRulesChange(e.target.value)}
                placeholder="CSS selectors or XPath expressions"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Output Configuration</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="output-format">Output Format</Label>
              <Select
                value={outputFormat}
                onValueChange={onOutputFormatChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select output format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="html">HTML</SelectItem>
                  <SelectItem value="text">Plain Text</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="secondary"
                onClick={handleTestCrawl}
                className="w-full"
              >
                Test Configuration
              </Button>
            </div>
          </div>
          
          {testStatus && (
            <div className={`mt-4 p-2 rounded-md ${testStatus.includes("successful") ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"}`}>
              {testStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WebCrawlingSettings;
