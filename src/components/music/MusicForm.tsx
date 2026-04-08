import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, Disc3, FileAudio2, Image as ImageIcon, Loader2, Music2, Upload, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Song, CreateMusicData, UpdateMusicData } from '@/types/musicTypes';

interface MusicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMusicData | UpdateMusicData) => Promise<void>;
  song?: Song | null;
  loading: boolean;
}

type FormErrors = Partial<Record<keyof CreateMusicData, string>>;

const MAX_PICTURE_SIZE_MB = 2;
const MAX_AUDIO_SIZE_MB = 50;

const ALLOWED_PICTURE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav', '.ogg', '.m4a', '.flac'];

const normalizeDateForInput = (value: string | null | undefined) => {
  if (!value) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const isoMatch = value.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoMatch?.[1]) return isoMatch[1];
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return parsed.toISOString().slice(0, 10);
};

const MusicForm: React.FC<MusicFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  song,
  loading,
}) => {
  const [formData, setFormData] = useState<CreateMusicData>({
    name: '',
    choir: '',
    release_date: '',
    genre: '',
    description: '',
    picture: null,
    audio_file: null,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = Boolean(song);

  useEffect(() => {
    if (song) {
      setFormData({
        name: song.name || '',
        choir: song.choir || '',
        release_date: normalizeDateForInput(song.release_date),
        genre: song.genre || '',
        description: song.description || '',
        picture: null,
        audio_file: null,
      });
    } else {
      setFormData({
        name: '',
        choir: '',
        release_date: '',
        genre: '',
        description: '',
        picture: null,
        audio_file: null,
      });
    }
    setErrors({});
  }, [song, isOpen]);

  const coverPreview = useMemo(() => {
    if (formData.picture instanceof File) {
      return URL.createObjectURL(formData.picture);
    }
    return song?.picture || null;
  }, [formData.picture, song?.picture]);

  const audioPreview = useMemo(() => {
    if (formData.audio_file instanceof File) {
      return URL.createObjectURL(formData.audio_file);
    }
    return song?.audio_file || null;
  }, [formData.audio_file, song?.audio_file]);

  useEffect(() => {
    return () => {
      if (formData.picture instanceof File && coverPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(coverPreview);
      }
      if (formData.audio_file instanceof File && audioPreview?.startsWith('blob:')) {
        URL.revokeObjectURL(audioPreview);
      }
    };
  }, [audioPreview, coverPreview, formData.audio_file, formData.picture]);

  const handleInputChange = (field: keyof CreateMusicData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFileChange = (field: 'picture' | 'audio_file', file: File | null) => {
    if (!file) {
      setFormData((prev) => ({ ...prev, [field]: null }));
      return;
    }

    if (field === 'picture' && !ALLOWED_PICTURE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, picture: 'Allowed image types: JPEG, PNG, JPG, GIF.' }));
      return;
    }

    if (field === 'audio_file') {
      const lowerName = file.name.toLowerCase();
      const hasAllowedExtension = ALLOWED_AUDIO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
      if (!hasAllowedExtension) {
        setErrors((prev) => ({ ...prev, audio_file: 'Allowed audio types: MP3, WAV, OGG, M4A, FLAC.' }));
        return;
      }
    }

    if (field === 'picture' && file.size > MAX_PICTURE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, picture: `Cover image must be ${MAX_PICTURE_SIZE_MB}MB or less.` }));
      return;
    }

    if (field === 'audio_file' && file.size > MAX_AUDIO_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, audio_file: `Audio file must be ${MAX_AUDIO_SIZE_MB}MB or less.` }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};

    if (!formData.name?.trim()) {
      nextErrors.name = 'Name is required';
    }
    if (!formData.choir?.trim()) {
      nextErrors.choir = 'Choir is required';
    }
    if (!formData.release_date) {
      nextErrors.release_date = 'Release date is required';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.release_date)) {
      nextErrors.release_date = 'Release date must be in yyyy-MM-dd format';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-border/60 p-0 sm:max-w-5xl">
        <DialogHeader className="border-b bg-gradient-to-r from-primary/10 via-background to-primary/5 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                {isEditing ? 'Edit Music' : 'Upload New Music'}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                {isEditing
                  ? 'Update details, replace cover image, or attach a new audio file.'
                  : 'Create a polished music entry with metadata, artwork, and audio.'}
              </DialogDescription>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <Badge variant="secondary" className="gap-1">
                <Music2 className="h-3.5 w-3.5" />
                Music Library
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Disc3 className="h-3.5 w-3.5" />
                {isEditing ? 'Editing' : 'New Entry'}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.9fr]">
            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Core Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="music_name" className="flex items-center gap-2">
                      <Music2 className="h-4 w-4 text-primary" />
                      Name *
                    </Label>
                    <Input
                      id="music_name"
                      value={formData.name}
                      onChange={(event) => handleInputChange('name', event.target.value)}
                      placeholder="Enter music name"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="music_choir" className="flex items-center gap-2">
                        <User className="h-4 w-4 text-primary" />
                        Choir/Artist *
                      </Label>
                      <Input
                        id="music_choir"
                        value={formData.choir}
                        onChange={(event) => handleInputChange('choir', event.target.value)}
                        placeholder="Enter choir or artist"
                        className={errors.choir ? 'border-destructive' : ''}
                      />
                      {errors.choir && <p className="text-sm text-destructive">{errors.choir}</p>}
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="music_release_date" className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        Release Date *
                      </Label>
                      <Input
                        id="music_release_date"
                        type="date"
                        value={formData.release_date}
                        onChange={(event) => handleInputChange('release_date', event.target.value)}
                        className={errors.release_date ? 'border-destructive' : ''}
                      />
                      {errors.release_date && <p className="text-sm text-destructive">{errors.release_date}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="music_genre">Genre</Label>
                    <Input
                      id="music_genre"
                      value={formData.genre || ''}
                      onChange={(event) => handleInputChange('genre', event.target.value)}
                      placeholder="e.g. Gospel, Worship, Contemporary"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Textarea
                    id="music_description"
                    rows={5}
                    value={formData.description || ''}
                    onChange={(event) => handleInputChange('description', event.target.value)}
                    placeholder="Add a short summary, ministry context, and release notes..."
                  />
                  <p className="text-xs text-muted-foreground">
                    {(formData.description || '').length} characters
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-5">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Cover Image</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="overflow-hidden rounded-lg border bg-muted/20">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt={formData.name || 'Cover preview'}
                        className="h-52 w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <Input
                    id="music_picture"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={(event) => handleFileChange('picture', event.target.files?.[0] || null)}
                  />
                  {formData.picture && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {formData.picture.name} ({(formData.picture.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">JPEG, PNG, JPG, GIF. Max 2MB.</p>
                  {errors.picture && <p className="text-sm text-destructive">{errors.picture}</p>}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Audio File</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {audioPreview ? (
                    <audio controls className="w-full">
                      <source src={audioPreview} />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <div className="flex h-16 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
                      <FileAudio2 className="mr-2 h-4 w-4" />
                      No audio selected
                    </div>
                  )}

                  <Input
                    id="music_audio"
                    type="file"
                    accept=".mp3,.wav,.ogg,.m4a,.flac,audio/*"
                    onChange={(event) => handleFileChange('audio_file', event.target.files?.[0] || null)}
                  />
                  {formData.audio_file && (
                    <p className="text-xs text-muted-foreground">
                      Selected: {formData.audio_file.name} ({(formData.audio_file.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">MP3, WAV, OGG, M4A, FLAC. Client limit 50MB, but the server may enforce a smaller upload limit.</p>
                  {errors.audio_file && <p className="text-sm text-destructive">{errors.audio_file}</p>}
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="my-5" />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-36">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {isEditing ? 'Update Music' : 'Upload Music'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MusicForm;
