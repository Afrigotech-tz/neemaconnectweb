import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useSlider } from '@/hooks/useSlider';
import { CreateSliderData, UpdateSliderData } from '@/types/sliderTypes';
import { Loader2, Save, X, Upload, Image } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SliderFormProps {
  sliderId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const SliderForm: React.FC<SliderFormProps> = ({ sliderId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { fetchSlider, selectedSlider, createSlider, updateSlider, loading } = useSlider();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateSliderData, 'image'>>({
    title: '',
    head: '',
    description: '',
    is_active: true,
    sort_order: 0,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!sliderId;

  useEffect(() => {
    if (sliderId) {
      fetchSlider(sliderId);
    }
  }, [sliderId, fetchSlider]);

  useEffect(() => {
    if (selectedSlider && sliderId) {
      setFormData({
        title: selectedSlider.title,
        head: selectedSlider.head,
        description: selectedSlider.description || '',
        is_active: selectedSlider.is_active,
        sort_order: selectedSlider.sort_order,
      });
      if (selectedSlider.image) {
        setImagePreview(selectedSlider.image);
      }
    }
  }, [selectedSlider, sliderId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: '' }));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.head.trim()) newErrors.head = 'Head is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data: CreateSliderData | UpdateSliderData = {
        ...formData,
        ...(imageFile ? { image: imageFile } : {}),
      };

      let success;
      if (isEditMode && sliderId) {
        success = await updateSlider(sliderId, data as UpdateSliderData);
      } else {
        success = await createSlider(data as CreateSliderData);
      }

      if (success) {
        if (onSuccess) onSuccess();
        else navigate('/dashboard/slider-management');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/dashboard/slider-management');
  };

  if (loading && isEditMode) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Slider' : 'Create New Slider'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Title */}
            <div className="md:col-span-2">
              <Label htmlFor="title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Slider title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Head */}
            <div className="md:col-span-2">
              <Label htmlFor="head">
                Head <span className="text-red-500">*</span>
              </Label>
              <Input
                id="head"
                value={formData.head}
                onChange={(e) => setFormData({ ...formData, head: e.target.value })}
                placeholder="Slider heading / headline"
                className={errors.head ? 'border-red-500' : ''}
              />
              {errors.head && <p className="text-sm text-red-500 mt-1">{errors.head}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Slider description"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <Label>Slider Image</Label>
              <div className="mt-2 space-y-3">
                {imagePreview && (
                  <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-40 object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <Label htmlFor="sort_order">Display Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                }
                placeholder="0"
              />
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Update Slider' : 'Create Slider'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SliderForm;
