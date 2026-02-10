import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAbout } from '@/hooks/useAbout';
import { CreateAboutUsData, UpdateAboutUsData } from '@/types/aboutTypes';
import { Loader2, Save, Upload, X } from 'lucide-react';

const AboutForm: React.FC = () => {
  const { aboutUs, fetchAboutUs, createAboutUs, updateAboutUs, loading } = useAbout();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateAboutUsData, 'image'>>({
    our_story: '',
    mission: '',
    vision: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAboutUs();
  }, [fetchAboutUs]);

  useEffect(() => {
    if (aboutUs) {
      setFormData({
        our_story: aboutUs.our_story || '',
        mission: aboutUs.mission || '',
        vision: aboutUs.vision || '',
      });
      if (aboutUs.image) {
        setImagePreview(aboutUs.image);
      }
    }
  }, [aboutUs]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.our_story.trim()) newErrors.our_story = 'Our Story is required';
    if (!formData.mission.trim()) newErrors.mission = 'Mission is required';
    if (!formData.vision.trim()) newErrors.vision = 'Vision is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const data: CreateAboutUsData | UpdateAboutUsData = {
        ...formData,
        ...(imageFile ? { image: imageFile } : {}),
      };

      if (aboutUs) {
        await updateAboutUs(data as UpdateAboutUsData);
      } else {
        await createAboutUs(data as CreateAboutUsData);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !aboutUs) {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">About Us Management</h1>
        <p className="text-gray-600 mt-2">
          {aboutUs ? 'Update your About Us page content' : 'Set up your About Us page content'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Featured Image</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {imagePreview && (
              <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={imagePreview}
                  alt="About us preview"
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                  }}
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
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors max-w-md"
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
          </CardContent>
        </Card>

        {/* Our Story */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="our_story">
              Our Story <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="our_story"
              value={formData.our_story}
              onChange={(e) => setFormData({ ...formData, our_story: e.target.value })}
              placeholder="Tell the story of your organization..."
              rows={8}
              className={`mt-1 ${errors.our_story ? 'border-red-500' : ''}`}
            />
            {errors.our_story && (
              <p className="text-sm text-red-500 mt-1">{errors.our_story}</p>
            )}
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="mission">
                Mission Statement <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="mission"
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                placeholder="What is your mission?"
                rows={5}
                className={`mt-1 ${errors.mission ? 'border-red-500' : ''}`}
              />
              {errors.mission && (
                <p className="text-sm text-red-500 mt-1">{errors.mission}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="vision">
                Vision Statement <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="vision"
                value={formData.vision}
                onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                placeholder="What is your vision?"
                rows={5}
                className={`mt-1 ${errors.vision ? 'border-red-500' : ''}`}
              />
              {errors.vision && (
                <p className="text-sm text-red-500 mt-1">{errors.vision}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" disabled={submitting} size="lg">
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {aboutUs ? 'Updating...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {aboutUs ? 'Update About Us' : 'Save About Us'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AboutForm;
