
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Check, Ear, Pause, ExternalLink, Info } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  accent?: string;
  previewUrl?: string;
  badge?: string;
  isCustom?: boolean;
}

const defaultVoices: Voice[] = [
  {
    id: "9BWtsMINqrJLrRacOk9x",
    name: "Aria",
    description: "Clear and professional female voice with natural intonation",
    gender: "female",
    accent: "American",
    previewUrl: "#",
    badge: "Popular"
  },
  {
    id: "CwhRBWXzGAHq8TQ4Fs17",
    name: "Roger",
    description: "Deep and authoritative male voice with excellent clarity",
    gender: "male",
    accent: "British",
    previewUrl: "#"
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Sarah",
    description: "Warm and friendly female voice with excellent diction",
    gender: "female",
    accent: "American",
    previewUrl: "#"
  },
  {
    id: "IKne3meq5aSn9XLyUdCD",
    name: "Charlie",
    description: "Natural and conversational male voice with subtle warmth",
    gender: "male",
    accent: "American",
    previewUrl: "#",
    badge: "New"
  }
];

interface VoiceSelectorProps {
  onSelectVoice: (voiceId: string) => void;
  selectedVoiceId?: string;
  voices?: Voice[];
}

const VoiceSelector = ({ onSelectVoice, selectedVoiceId, voices = defaultVoices }: VoiceSelectorProps) => {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const [volume, setVolume] = useState(80);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [savedApiKey, setSavedApiKey] = useState("");
  const [useCustomVoices, setUseCustomVoices] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [customVoices, setCustomVoices] = useState<Voice[]>([]);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Load saved API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("elevenLabsApiKey");
    if (savedKey) {
      setSavedApiKey(savedKey);
      setApiKey(savedKey);
    }
  }, []);

  const playVoicePreview = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      setPlayingVoiceId(null);
      return;
    }

    // Stop any currently playing audio
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    setPlayingVoiceId(voiceId);

    if (savedApiKey && useCustomVoices) {
      // Create preview text for ElevenLabs
      const previewText = "Hello, I'm your AI assistant. How can I help you today?";
      
      // In a real implementation, this would make an API call to ElevenLabs
      // For demo purposes, we'll simulate a delay and then create an audio element
      toast({
        title: "Generating Voice Preview",
        description: "Connecting to ElevenLabs API...",
      });

      setTimeout(() => {
        // In a real implementation, this URL would be the response from the ElevenLabs API
        // For demo purposes, we're using a placeholder
        const demoAudioUrl = "https://example.com/preview.mp3";
        
        // Create a new audio element
        const audio = new Audio(demoAudioUrl);
        audio.volume = volume / 100;
        
        // Set up event listeners
        audio.onended = () => {
          setPlayingVoiceId(null);
        };
        
        audio.onerror = () => {
          toast({
            title: "Preview Failed",
            description: "There was an error playing the voice preview.",
            variant: "destructive",
          });
          setPlayingVoiceId(null);
        };
        
        // Store the audio element for later reference
        setAudioElement(audio);
        
        // Simulate audio playing with a timeout
        // In a real implementation, this would be audio.play()
        setTimeout(() => {
          setPlayingVoiceId(null);
          toast({
            title: "Preview Complete",
            description: "Voice preview finished playing.",
          });
        }, 3000);
      }, 1500);
    } else {
      // Simulate preview for default voices
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3000);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioElement) {
      audioElement.volume = value[0] / 100;
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isVoiceEnabled && audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setPlayingVoiceId(null);
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem("elevenLabsApiKey", apiKey);
      setSavedApiKey(apiKey);
      setIsApiKeyModalOpen(false);
      
      toast({
        title: "API Key Saved",
        description: "Your ElevenLabs API key has been saved successfully.",
      });
      
      // In a real implementation, this would fetch voices from ElevenLabs
      fetchCustomVoices();
    } else {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid ElevenLabs API key.",
        variant: "destructive",
      });
    }
  };

  const toggleCustomVoices = () => {
    if (!savedApiKey && !useCustomVoices) {
      setIsApiKeyModalOpen(true);
      return;
    }
    
    setUseCustomVoices(!useCustomVoices);
    if (!useCustomVoices && customVoices.length === 0) {
      fetchCustomVoices();
    }
  };

  const fetchCustomVoices = () => {
    setIsLoadingVoices(true);
    
    // In a real implementation, this would make an API call to ElevenLabs
    // For demo purposes, we'll simulate a delay and then set some predefined voices
    setTimeout(() => {
      const fetchedVoices: Voice[] = [
        {
          id: "N2lVS1w4EtoT3dr4eOWO",
          name: "Callum",
          description: "Professional and clear male voice with British accent",
          gender: "male",
          accent: "British",
          isCustom: true
        },
        {
          id: "TX3LPaxmHKxFdv7VOQHJ",
          name: "Liam",
          description: "Warm and friendly male voice with excellent pacing",
          gender: "male",
          accent: "American",
          isCustom: true,
          badge: "Premium"
        },
        {
          id: "XB0fDUnXU5powFXDhCwa",
          name: "Charlotte",
          description: "Elegant female voice with natural inflection and clarity",
          gender: "female",
          accent: "British",
          isCustom: true
        }
      ];
      
      setCustomVoices(fetchedVoices);
      setIsLoadingVoices(false);
      
      toast({
        title: "Voices Loaded",
        description: "Custom voices have been loaded successfully.",
      });
    }, 2000);
  };

  const displayedVoices = useCustomVoices ? customVoices : voices;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Ear className="h-5 w-5" />
          Voice Settings
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsApiKeyModalOpen(true)}
            className="text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            API Key
          </Button>
          <Button
            variant={isVoiceEnabled ? "default" : "outline"}
            size="sm"
            onClick={toggleVoice}
            className="flex items-center gap-1"
          >
            {isVoiceEnabled ? (
              <>
                <Volume2 className="h-4 w-4" />
                Enabled
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                Disabled
              </>
            )}
          </Button>
        </div>
      </div>

      {isVoiceEnabled && (
        <>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Switch 
                id="custom-voices" 
                checked={useCustomVoices} 
                onCheckedChange={toggleCustomVoices}
                disabled={isLoadingVoices}
              />
              <Label htmlFor="custom-voices" className="font-medium cursor-pointer">
                Use ElevenLabs Voices
              </Label>
            </div>
            {isLoadingVoices && (
              <div className="text-xs text-muted-foreground animate-pulse">
                Loading voices...
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium w-8 text-right">{volume}%</span>
          </div>

          <div className="space-y-2">
            <RadioGroup 
              value={selectedVoiceId} 
              onValueChange={onSelectVoice}
              className="space-y-2"
              disabled={!isVoiceEnabled}
            >
              {displayedVoices.length > 0 ? (
                displayedVoices.map((voice) => (
                  <Card 
                    key={voice.id}
                    className={`border transition-all ${
                      selectedVoiceId === voice.id ? 'border-primary' : 'hover:border-gray-300'
                    }`}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <RadioGroupItem value={voice.id} id={voice.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <Label 
                            htmlFor={voice.id} 
                            className="font-medium cursor-pointer flex items-center"
                          >
                            {voice.name}
                            {selectedVoiceId === voice.id && (
                              <Check className="h-3.5 w-3.5 inline-block ml-1 text-primary" />
                            )}
                            <span className="text-xs ml-2 text-muted-foreground">
                              {voice.gender}, {voice.accent}
                            </span>
                            {voice.badge && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                {voice.badge}
                              </Badge>
                            )}
                            {voice.isCustom && (
                              <Badge variant="secondary" className="ml-2 text-xs">
                                ElevenLabs
                              </Badge>
                            )}
                          </Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => playVoicePreview(voice.id)}
                          >
                            {playingVoiceId === voice.id ? (
                              <Pause className="h-4 w-4 text-primary" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {voice.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center p-4 border rounded-md bg-secondary/20">
                  <p className="text-sm text-muted-foreground">
                    {useCustomVoices 
                      ? "No custom voices available. Please check your API key." 
                      : "No default voices available."}
                  </p>
                </div>
              )}
            </RadioGroup>
          </div>
        </>
      )}

      {/* ElevenLabs API Key Dialog */}
      <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>ElevenLabs API Key</DialogTitle>
            <DialogDescription>
              Enter your ElevenLabs API key to access premium voice features.
              You can get your API key from the ElevenLabs dashboard.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your ElevenLabs API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground flex items-center">
                <Info className="h-3 w-3 mr-1" />
                Your API key is stored locally and never shared.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApiKeyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveApiKey}>
              Save API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VoiceSelector;
