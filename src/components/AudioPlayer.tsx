
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface AudioPlayerProps {
  audioSrc: string;
  chapter: number;
  name: string;
  isPlaying?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onClose?: () => void;
  onError?: (errorMessage: string) => void;
  isFixed?: boolean;
}

export function AudioPlayer({ 
  audioSrc, 
  chapter, 
  name, 
  isPlaying: externalIsPlaying, 
  onPlayStateChange,
  onClose,
  onError,
  isFixed = false
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioInitialized, setAudioInitialized] = useState(false);

  // Handle external play state control
  useEffect(() => {
    if (externalIsPlaying !== undefined && externalIsPlaying !== isPlaying) {
      setIsPlaying(externalIsPlaying);
      if (audioRef.current) {
        if (externalIsPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch(error => {
              console.error("Audio play error:", error);
              setIsPlaying(false);
              if (onPlayStateChange) onPlayStateChange(false);
              
              // Handle permission errors specifically
              if (error.name === 'NotAllowedError') {
                const errorMsg = "Browser requires user interaction before playing audio. Please try clicking play again.";
                if (onError) {
                  onError(errorMsg);
                } else {
                  toast({
                    title: "Audio Error",
                    description: errorMsg,
                    variant: "destructive",
                  });
                }
              } else {
                handleLoadError();
              }
            });
          }
        } else {
          audioRef.current.pause();
        }
      }
    }
  }, [externalIsPlaying, isPlaying, onPlayStateChange, onError]);

  useEffect(() => {
    // Reset audio player when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setIsLoading(true);
    setLoadError(false);
    setAudioInitialized(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
    
    // Notify parent component
    if (onPlayStateChange) {
      onPlayStateChange(false);
    }
    
    // Initialize audio object
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [audioSrc, onPlayStateChange]);

  // Initialize audio after component mount
  useEffect(() => {
    const initializeAudio = () => {
      if (audioRef.current && !audioInitialized) {
        audioRef.current.load();
        setAudioInitialized(true);
        console.log("Audio initialized with source:", audioSrc);
      }
    };
    
    initializeAudio();
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [audioSrc, audioInitialized]);

  const handlePlay = async () => {
    if (!audioRef.current) return;
    
    setIsLoading(true);
    setLoadError(false);
    
    try {
      console.log("Attempting to play audio:", audioSrc);
      await audioRef.current.play();
      setIsPlaying(true);
      if (onPlayStateChange) onPlayStateChange(true);
      console.log("Audio playing successfully");
    } catch (err) {
      console.error("Error playing audio:", err);
      setLoadError(true);
      setIsPlaying(false);
      
      let errorMsg = "Could not play the audio. Please check your internet connection or try another verse.";
      
      // Handle specific error cases
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMsg = "Your browser requires user interaction before playing audio. Please try clicking play again.";
        } else if (err.name === "AbortError") {
          // This is normal when stopping playback, ignore
          return;
        }
      }
      
      if (onError) {
        onError(errorMsg);
      } else {
        toast({
          title: "Audio Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
      
      if (onPlayStateChange) onPlayStateChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    setIsPlaying(false);
    if (onPlayStateChange) onPlayStateChange(false);
  };

  const togglePlayPause = () => {
    if (isLoading) return; // Prevent multiple requests during loading
    
    if (audioRef.current) {
      if (isPlaying) {
        handlePause();
      } else {
        handlePlay();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setLoadError(false);
      console.log("Audio metadata loaded, duration:", audioRef.current.duration);
    }
  };

  const handleLoadError = () => {
    console.error("Failed to load audio from URL:", audioSrc);
    setIsLoading(false);
    setLoadError(true);
    
    const errorMsg = "Failed to load the audio file. The audio source might be unavailable or blocked by CORS restrictions.";
    
    if (onError) {
      onError(errorMsg);
    } else {
      toast({
        title: "Audio Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleClose = () => {
    if (onClose) {
      handlePause();
      onClose();
    }
  };

  const handleCanPlayThrough = () => {
    console.log("Audio can play through without buffering");
    setIsLoading(false);
  };

  return (
    <div className={`glass-card rounded-lg p-4 w-full max-w-xl shadow-elegant animate-fade-in 
      ${isFixed ? 'fixed bottom-4 left-0 right-0 mx-auto z-50 max-w-md' : 'mx-auto'}`}>
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleLoadError}
        onCanPlayThrough={handleCanPlayThrough}
        onEnded={() => {
          console.log("Audio playback ended");
          setIsPlaying(false);
          if (onPlayStateChange) onPlayStateChange(false);
        }}
        preload="auto"
        crossOrigin="anonymous"
      />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-accent" />
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-foreground/60">Surah {chapter}</p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-xs text-foreground/60 mr-2">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
          {isFixed && (
            <button 
              onClick={handleClose}
              className="p-1 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Close player"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      <div className="w-full mt-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-accent/20 rounded-lg appearance-none cursor-pointer accent-accent"
          disabled={isLoading || loadError}
        />
      </div>
      
      <div className="flex items-center justify-center space-x-4 mt-3">
        <button 
          onClick={skipBackward}
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label="Skip backward 10 seconds"
          disabled={isLoading || loadError}
        >
          <SkipBack size={18} />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className={`p-3 ${isLoading ? 'bg-accent/50' : loadError ? 'bg-destructive/50' : 'bg-accent'} text-white rounded-full hover:bg-accent/90 transition-colors`}
          aria-label={isPlaying ? "Pause" : "Play"}
          disabled={isLoading || loadError}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        
        <button 
          onClick={skipForward}
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label="Skip forward 10 seconds"
          disabled={isLoading || loadError}
        >
          <SkipForward size={18} />
        </button>
      </div>
      
      {loadError && !onError && (
        <div className="text-destructive text-xs text-center mt-2">
          Unable to load audio. Please try another verse.
        </div>
      )}
    </div>
  );
}
