
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Check, Ear } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface Voice {
  id: string;
  name: string;
  description: string;
  gender: string;
  accent?: string;
  previewUrl?: string;
  badge?: string;
}

const defaultVoices: Voice[] = [
  {
    id: "voice-1",
    name: "Sarah",
    description: "Clear and professional female voice",
    gender: "female",
    accent: "American",
    previewUrl: "#",
    badge: "Popular"
  },
  {
    id: "voice-2",
    name: "James",
    description: "Deep and authoritative male voice",
    gender: "male",
    accent: "British",
    previewUrl: "#"
  },
  {
    id: "voice-3",
    name: "Emma",
    description: "Warm and friendly female voice",
    gender: "female",
    accent: "Australian",
    previewUrl: "#"
  },
  {
    id: "voice-4",
    name: "Michael",
    description: "Natural and conversational male voice",
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

  const playVoicePreview = (voiceId: string) => {
    if (playingVoiceId === voiceId) {
      setPlayingVoiceId(null);
      // Stop playing audio logic here
    } else {
      setPlayingVoiceId(voiceId);
      // Play audio preview logic here
      setTimeout(() => {
        setPlayingVoiceId(null);
      }, 3000);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <Ear className="h-5 w-5" />
          Voice Settings
        </h3>
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

      {isVoiceEnabled && (
        <>
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
              {voices.map((voice) => (
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
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                          onClick={() => playVoicePreview(voice.id)}
                        >
                          <Play className={`h-4 w-4 ${playingVoiceId === voice.id ? 'text-primary' : ''}`} />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {voice.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default VoiceSelector;
