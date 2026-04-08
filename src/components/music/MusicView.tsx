import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  CalendarDays,
  Clock3,
  Disc3,
  Download,
  FileAudio2,
  FileStack,
  Music2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  User,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Song } from '@/types/musicTypes';

interface MusicViewProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

const formatDateTime = (value: string | null | undefined) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatDate = (value: string | null | undefined) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const MusicView: React.FC<MusicViewProps> = ({ isOpen, onClose, song }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackBars = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const activeThreshold = ((index + 1) / 28) * 100;
        const isActive = progress >= activeThreshold;
        const baseHeight = [20, 32, 24, 40, 28, 46, 26, 38][index % 8];
        return {
          id: index,
          height: baseHeight,
          isActive,
        };
      }),
    [progress]
  );

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(audio.duration || 0);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [song?.audio_file, isOpen]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(audio.duration || 0);
    setPlaybackRate(1);
    setVolume(80);
    audio.playbackRate = 1;
    audio.volume = 0.8;
  }, [song?.id, isOpen]);

  if (!song) return null;

  const handleTogglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
    }
  };

  const handleSeek = (nextValue: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = nextValue[0] || 0;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const nextTime = Math.min(Math.max(audio.currentTime + seconds, 0), duration || audio.duration || 0);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
  };

  const handleVolumeChange = (nextValue: number[]) => {
    const nextVolume = nextValue[0] ?? 0;
    setVolume(nextVolume);
  };

  const toggleMute = () => {
    setVolume((current) => (current === 0 ? 80 : 0));
  };

  const cyclePlaybackRate = () => {
    setPlaybackRate((current) => {
      const rates = [0.75, 1, 1.25, 1.5, 2];
      const currentIndex = rates.findIndex((rate) => rate === current);
      return rates[(currentIndex + 1) % rates.length];
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/60 p-0 sm:max-w-5xl">
        <DialogHeader className="border-b bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 py-5">
          <DialogTitle className="text-2xl font-semibold tracking-tight">{song.name}</DialogTitle>
          <DialogDescription className="mt-1 flex items-center gap-2 text-sm">
            <Disc3 className="h-4 w-4 text-primary" />
            Detailed music entry preview
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {song.picture ? (
                  <img
                    src={song.picture}
                    alt={song.name}
                    className="h-72 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center bg-muted/30 text-muted-foreground">
                    <Music2 className="h-10 w-10" />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Track Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">#{song.id}</Badge>
                  <Badge variant="outline">{song.genre || 'No Genre'}</Badge>
                  <Badge variant="outline">{song.choir || 'Unknown Choir'}</Badge>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs uppercase text-muted-foreground">Release Date</p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      {formatDate(song.release_date)}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-3">
                    <p className="text-xs uppercase text-muted-foreground">Choir / Artist</p>
                    <p className="mt-1 flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-primary" />
                      {song.choir || '-'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase text-muted-foreground">Description</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {song.description || 'No description provided.'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Audio Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {song.audio_file ? (
                <>
                  <audio ref={audioRef} preload="metadata">
                    <source src={song.audio_file} />
                    Your browser does not support the audio element.
                  </audio>

                  <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Now Previewing</p>
                        <p className="mt-1 text-lg font-semibold">{song.name}</p>
                        <p className="text-sm text-muted-foreground">{song.choir || 'Unknown Choir'}</p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {playbackRate}x
                      </Badge>
                    </div>

                    <div className="mb-4 flex h-16 items-end gap-1 rounded-xl border bg-background/80 px-3 py-2">
                      {trackBars.map((bar) => (
                        <div
                          key={bar.id}
                          className={`w-full rounded-full transition-all duration-300 ${
                            bar.isActive ? 'bg-primary shadow-sm' : 'bg-primary/20'
                          }`}
                          style={{ height: `${bar.height}px` }}
                        />
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Slider
                        value={[currentTime]}
                        max={duration || 0}
                        step={0.1}
                        onValueChange={handleSeek}
                        disabled={!duration}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={() => handleSkip(-10)}>
                        <SkipBack className="h-4 w-4" />
                      </Button>
                      <Button type="button" size="icon" onClick={handleTogglePlayback}>
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={() => handleSkip(10)}>
                        <SkipForward className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={handleRestart}>
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" onClick={cyclePlaybackRate}>
                        {playbackRate}x Speed
                      </Button>
                      <Button type="button" variant="outline" asChild>
                        <a href={song.audio_file} target="_blank" rel="noreferrer" download>
                          <Download className="h-4 w-4" />
                          Download
                        </a>
                      </Button>
                    </div>

                    <div className="mt-5 flex items-center gap-3">
                      <Button type="button" variant="ghost" size="icon" onClick={toggleMute}>
                        {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <Slider
                        value={[volume]}
                        max={100}
                        step={1}
                        onValueChange={handleVolumeChange}
                      />
                      <span className="w-10 text-right text-xs text-muted-foreground">{volume}%</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex h-16 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                  <FileAudio2 className="mr-2 h-4 w-4" />
                  No audio file attached
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Duration</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                <Clock3 className="h-4 w-4 text-primary" />
                {song.duration || '-'}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">MIME Type</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                <FileStack className="h-4 w-4 text-primary" />
                {song.mime_type || '-'}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">File Size</p>
              <p className="mt-1 text-sm font-medium">
                {song.file_size ? `${song.file_size} bytes` : '-'}
              </p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Created At</p>
              <p className="mt-1 text-sm font-medium">{formatDateTime(song.created_at)}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs uppercase text-muted-foreground">Updated At</p>
              <p className="mt-1 text-sm font-medium">{formatDateTime(song.updated_at)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicView;
