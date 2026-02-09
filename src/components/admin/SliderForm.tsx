import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useSlider } from '@/hooks/useSlider';
import { CreateSliderData, UpdateSliderData } from '@/types/sliderTypes';
import { Loader2, Save, X } from 'lucide-react';
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
  const [formData, setFormData] = useState<CreateSliderData>({
    title: '',
    subtitle: '',
    description: '',
    image_url: '',
    cta_text: '',
    cta_link: '',
    order: 0,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        subtitle: selectedSlider.subtitle || '',
        description: selectedSlider.description || '',
        image_url: selectedSlider.image_url,
        cta_text: selectedSlider.cta_text || '',
        cta_link: selectedSlider.cta_link || '',
        order: selectedSlider.order,
        is_active: selectedSlider.is_active,
      });
    }
  }, [selectedSlider, sliderId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.image_url.trim()) newErrors.image_url = 'Image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let success;
      if (isEditMode && sliderId) {
        success = await updateSlider(sliderId, formData as UpdateSliderData);
      } else {
        success = await createSlider(formData);
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

            <div className="md:col-span-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="Slider subtitle"
              />
            </div>

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

            <div className="md:col-span-2">
              <Label htmlFor="image_url">
                Image URL <span className="text-red-500">*</span>
              </Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className={errors.image_url ? 'border-red-500' : ''}
              />
              {errors.image_url && <p className="text-sm text-red-500 mt-1">{errors.image_url}</p>}
            </div>

            <div>
              <Label htmlFor="cta_text">Call-to-Action Text</Label>
              <Input
                id="cta_text"
                value={formData.cta_text}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                placeholder="Learn More"
              />
            </div>

            <div>
              <Label htmlFor="cta_link">Call-to-Action Link</Label>
              <Input
                id="cta_link"
                value={formData.cta_link}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                placeholder="/about"
              />
            </div>

            <div>
              <Label htmlFor="order">Display Order</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked as boolean })}
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active
              </Label>
            </div>
          </div>

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
