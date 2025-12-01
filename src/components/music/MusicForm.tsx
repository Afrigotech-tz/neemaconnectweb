import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Song, CreateMusicData, UpdateMusicData } from '../../types/musicTypes';

interface MusicFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMusicData | UpdateMusicData) => Promise<void>;
  song?: Song | null;
  loading: boolean;
}

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
  });

  const [errors, setErrors] = useState<Partial<CreateMusicData>>({});

  const isEditing = !!song;

  useEffect(() => {
    if (song) {
      setFormData({
        name: song.name,
        choir: song.choir,
        release_date: song.release_date,
        genre: song.genre,
        description: song.description,
      });
    } else {
      setFormData({
        name: '',
        choir: '',
        release_date: '',
        genre: '',
        description: '',
      });
    }
    setErrors({});
  }, [song, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateMusicData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.choir.trim()) {
      newErrors.choir = 'Choir is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.release_date) {
      newErrors.release_date = 'Release date is required';
    } else {
      const date = new Date(formData.release_date);
      if (isNaN(date.getTime())) {
        newErrors.release_date = 'Invalid date format';
      }
    }

    if (!formData.genre) {
      newErrors.genre = 'Genre is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CreateMusicData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const genres = [
    'Gospel',
    'Hymn',
    'Contemporary',
    'Traditional',
    'Choral',
    'Worship',
    'Praise',
    'Spiritual',
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Song' : 'Add New Song'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the song details below.' : 'Fill in the details for the new song.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter song name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor="choir">Choir *</Label>
            <Input
              id="choir"
              value={formData.choir}
              onChange={(e) => handleInputChange('choir', e.target.value)}
              placeholder="Enter choir name"
              className={errors.choir ? 'border-red-500' : ''}
            />
            {errors.choir && <p className="text-sm text-red-500 mt-1">{errors.choir}</p>}
          </div>

          <div>
            <Label htmlFor="release_date">Release Date *</Label>
            <Input
              id="release_date"
              type="date"
              value={formData.release_date}
              onChange={(e) => handleInputChange('release_date', e.target.value)}
              className={errors.release_date ? 'border-red-500' : ''}
            />
            {errors.release_date && <p className="text-sm text-red-500 mt-1">{errors.release_date}</p>}
          </div>

          <div>
            <Label htmlFor="genre">Genre *</Label>
            <Select
              value={formData.genre}
              onValueChange={(value) => handleInputChange('genre', value)}
            >
              <SelectTrigger className={errors.genre ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.genre && <p className="text-sm text-red-500 mt-1">{errors.genre}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter song description"
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update Song' : 'Create Song'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MusicForm;
