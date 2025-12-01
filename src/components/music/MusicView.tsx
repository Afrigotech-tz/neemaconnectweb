import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Song } from '../../types/musicTypes';

interface MusicViewProps {
  isOpen: boolean;
  onClose: () => void;
  song: Song | null;
}

const MusicView: React.FC<MusicViewProps> = ({
  isOpen,
  onClose,
  song,
}) => {
  if (!song) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{song.name}</DialogTitle>
          <DialogDescription>
            Song details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">ID</label>
            <p className="text-sm text-muted-foreground">{song.id}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Name</label>
            <p className="text-sm text-muted-foreground">{song.name}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Choir</label>
            <p className="text-sm text-muted-foreground">{song.choir}</p>
          </div>

          <div>
            <label className="text-sm font-medium">Release Date</label>
            <p className="text-sm text-muted-foreground">
              {new Date(song.release_date).toLocaleDateString()}
            </p>
          </div>

          <div>
            <label className="text-sm font-medium">Genre</label>
            <Badge variant="secondary">{song.genre}</Badge>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <p className="text-sm text-muted-foreground">{song.description}</p>
          </div>

          {song.picture && (
            <div>
              <label className="text-sm font-medium">Picture</label>
              <p className="text-sm text-muted-foreground">{song.picture}</p>
            </div>
          )}

          {song.audio_file && (
            <div>
              <label className="text-sm font-medium">Audio File</label>
              <p className="text-sm text-muted-foreground">{song.audio_file}</p>
            </div>
          )}

          {song.duration && (
            <div>
              <label className="text-sm font-medium">Duration</label>
              <p className="text-sm text-muted-foreground">{song.duration}</p>
            </div>
          )}

          {song.file_size && (
            <div>
              <label className="text-sm font-medium">File Size</label>
              <p className="text-sm text-muted-foreground">{song.file_size} bytes</p>
            </div>
          )}

          {song.mime_type && (
            <div>
              <label className="text-sm font-medium">MIME Type</label>
              <p className="text-sm text-muted-foreground">{song.mime_type}</p>
            </div>
          )}

          {song.created_at && (
            <div>
              <label className="text-sm font-medium">Created At</label>
              <p className="text-sm text-muted-foreground">
                {new Date(song.created_at).toLocaleString()}
              </p>
            </div>
          )}

          {song.updated_at && (
            <div>
              <label className="text-sm font-medium">Updated At</label>
              <p className="text-sm text-muted-foreground">
                {new Date(song.updated_at).toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicView;
