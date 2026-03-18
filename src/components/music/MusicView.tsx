import React from 'react';
import { CalendarDays, Clock3, Disc3, FileAudio2, FileStack, Music2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

const MusicView: React.FC<MusicViewProps> = ({ isOpen, onClose, song }) => {
  if (!song) return null;

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
            <CardContent>
              {song.audio_file ? (
                <audio controls className="w-full">
                  <source src={song.audio_file} />
                  Your browser does not support the audio element.
                </audio>
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
