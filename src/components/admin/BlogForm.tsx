import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useBlog } from '@/hooks/useBlog';
import { CreateBlogData, UpdateBlogData } from '@/types/blogTypes';
import { Loader2, Save, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogFormProps {
  blogId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BlogForm: React.FC<BlogFormProps> = ({ blogId, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const { fetchBlog, selectedBlog, createBlog, updateBlog, loading } = useBlog();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<CreateBlogData, 'image'>>({
    title: '',
    description: '',
    date: '',
    location: '',
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [existingImage, setExistingImage] = useState<string>(''); // Store existing image path
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = !!blogId;

  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
    }
  }, [blogId, fetchBlog]);

  useEffect(() => {
    if (selectedBlog && blogId) {
      setFormData({
        title: selectedBlog.title,
        description: selectedBlog.description,
        date: selectedBlog.date,
        location: selectedBlog.location,
        is_active: selectedBlog.is_active,
      });
      if (selectedBlog.image) {
        setImagePreview(selectedBlog.image);
        setExistingImage(selectedBlog.image); // Store existing image path
      }
    }
  }, [selectedBlog, blogId]);

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
    // When removing image in edit mode, clear the existing image path
    // This tells the backend to remove the image
    setExistingImage(''); 
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date.trim()) newErrors.date = 'Date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const data: CreateBlogData | UpdateBlogData = {
        ...formData,
        ...(imageFile ? { image: imageFile } : {}),
      };

      // In edit mode, if no new image is selected but we have an existing image,
      // we need to preserve it. The backend should handle this.
      // If the user removed the image (existingImage is empty after clicking remove),
      // we should send an empty string to indicate removal
      if (isEditMode && blogId && !imageFile) {
        // Keep existing image path in the data if it wasn't explicitly removed
        // The backend will decide whether to keep or remove based on this
        (data as UpdateBlogData).image = undefined;
      }

      let success;
      if (isEditMode && blogId) {
        success = await updateBlog(blogId, data as UpdateBlogData);
      } else {
        success = await createBlog(data as CreateBlogData);
      }

      if (success) {
        if (onSuccess) onSuccess();
        else navigate('/dashboard/blog-management');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate('/dashboard/blog-management');
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
        <CardTitle>{isEditMode ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
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
                placeholder="Blog post title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date">
                Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={errors.date ? 'border-red-500' : ''}
              />
              {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date}</p>}
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location">
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Nairobi, Kenya"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && <p className="text-sm text-red-500 mt-1">{errors.location}</p>}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <Label htmlFor="description">
                Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Write your blog post content here..."
                rows={8}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <Label>Featured Image</Label>
              <div className="mt-2 space-y-3">
                {imagePreview && (
                  <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={() => {
                        // hide preview if the URL is not accessible (403 etc.)
                        setImagePreview('');
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

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked as boolean })
                }
              />
              <Label htmlFor="is_active" className="cursor-pointer">
                Active (visible on public site)
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
                  {isEditMode ? 'Update Blog' : 'Create Blog'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BlogForm;
