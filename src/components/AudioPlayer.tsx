
import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  audioSrc: string;
  chapter: number;
  name: string;
}

export function AudioPlayer({ audioSrc, chapter, name }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset audio player when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.load();
    }
  }, [audioSrc]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      }
      setIsPlaying(!isPlaying);
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

  return (
    <div className="glass-card rounded-lg p-4 w-full max-w-xl mx-auto shadow-elegant animate-fade-in">
      <audio
        ref={audioRef}
        src={audioSrc}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <Volume2 size={16} className="text-accent" />
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-foreground/60">Surah {chapter}</p>
          </div>
        </div>
        <div className="text-xs text-foreground/60">
          {formatTime(currentTime)} / {formatTime(duration)}
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
        />
      </div>
      
      <div className="flex items-center justify-center space-x-4 mt-3">
        <button 
          onClick={skipBackward}
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label="Skip backward 10 seconds"
        >
          <SkipBack size={18} />
        </button>
        
        <button 
          onClick={togglePlayPause}
          className="p-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
        </button>
        
        <button 
          onClick={skipForward}
          className="p-2 rounded-full hover:bg-accent/10 transition-colors"
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward size={18} />
        </button>
      </div>
    </div>
  );
}
