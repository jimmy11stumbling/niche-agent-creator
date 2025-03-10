
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  audioUrl: string;
  autoPlay?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  volume?: number;
  className?: string;
}

const AudioPlayerComponent = ({
  audioUrl,
  autoPlay = false,
  onPlayStateChange,
  volume = 100,
  className = ""
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playerVolume, setPlayerVolume] = useState(volume);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    
    audio.volume = playerVolume / 100;
    
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    
    audio.addEventListener("timeupdate", () => {
      setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    });
    
    audio.addEventListener("error", () => {
      toast({
        title: "Error",
        description: "Failed to load audio file",
        variant: "destructive"
      });
      setIsPlaying(false);
      if (onPlayStateChange) onPlayStateChange(false);
    });
    
    if (autoPlay) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          if (onPlayStateChange) onPlayStateChange(true);
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
        });
    }
    
    return () => {
      audio.pause();
      audio.remove();
    };
  }, [audioUrl, autoPlay, onPlayStateChange]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = playerVolume / 100;
    }
  }, [playerVolume]);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 0;
      } else {
        audioRef.current.volume = playerVolume / 100;
      }
    }
  }, [isMuted, playerVolume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play()
        .catch((error) => {
          console.error("Play failed:", error);
          toast({
            title: "Playback Error",
            description: "Unable to play the audio",
            variant: "destructive"
          });
        });
    }
    
    setIsPlaying(!isPlaying);
    if (onPlayStateChange) onPlayStateChange(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setPlayerVolume(value[0]);
    if (isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={togglePlayPause}
          className="h-8 w-8 p-0"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        
        <div className="flex-1">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        <div className="text-xs text-muted-foreground min-w-[60px] text-right">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleMute}
          className="h-6 w-6 p-0"
        >
          {isMuted || playerVolume === 0 ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
        </Button>
        
        <Slider
          value={[isMuted ? 0 : playerVolume]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1 h-2"
        />
        
        <span className="text-xs text-muted-foreground w-8 text-right">
          {isMuted ? 0 : playerVolume}%
        </span>
      </div>
    </div>
  );
};

export default AudioPlayerComponent;
