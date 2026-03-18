import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, ImagePlus, Loader2, MapPin, Save, Sparkles, Type, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBlog } from '@/hooks/useBlog';
import { CreateBlogData, UpdateBlogData } from '@/types/blogTypes';
import { getBlogImageUrl } from '@/lib/utils';

interface BlogFormProps {
  blogId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
  embedded?: boolean;
}

const MAX_IMAGE_SIZE_MB = 10;

const BlogForm: React.FC<BlogFormProps> = ({ blogId, onSuccess, onCancel, embedded = false }) => {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditMode = Boolean(blogId);
  const glassCardClass = embedded ? 'border-white/25 bg-white/10 backdrop-blur-xl shadow-xl' : '';
  const glassFieldClass = embedded ? 'border-white/30 bg-white/50 backdrop-blur-sm' : '';

  useEffect(() => {
    if (blogId) {
      void fetchBlog(blogId);
    }
  }, [blogId, fetchBlog]);

  useEffect(() => {
    if (!selectedBlog || !blogId) return;
    setFormData({
      title: selectedBlog.title,
      description: selectedBlog.description,
      date: selectedBlog.date,
      location: selectedBlog.location,
      is_active: selectedBlog.is_active,
    });
    if (selectedBlog.image) {
      setImagePreview(getBlogImageUrl(selectedBlog.image));
    } else {
      setImagePreview('');
    }
  }, [selectedBlog, blogId]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, image: 'Please select a valid image file.' }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: `Image must be ${MAX_IMAGE_SIZE_MB}MB or smaller.` }));
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    setErrors((prev) => ({ ...prev, image: '' }));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const nextErrors: Record<string, string> = {};

    if (!formData.title.trim()) nextErrors.title = 'Title is required';
    if (!formData.description.trim()) nextErrors.description = 'Description is required';
    if (!formData.date.trim()) nextErrors.date = 'Date is required';
    if (!formData.location.trim()) nextErrors.location = 'Location is required';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload: CreateBlogData | UpdateBlogData = {
        ...formData,
        ...(imageFile ? { image: imageFile } : {}),
      };

      const success = isEditMode && blogId
        ? await updateBlog(blogId, payload as UpdateBlogData)
        : await createBlog(payload as CreateBlogData);

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        embedded
          ? 'space-y-5 rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-md'
          : 'space-y-5 rounded-2xl border bg-card p-6 shadow-sm'
      )}
    >
      {!embedded && (
        <div className="rounded-2xl border bg-gradient-to-r from-primary/15 via-background to-primary/5 p-5">
          <h2 className="text-2xl font-semibold tracking-tight">
            {isEditMode ? 'Edit Blog Post' : 'Create Blog Post'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Write compelling content and publish it with rich visuals.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-5">
            <Card className={glassCardClass}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-primary" />
                    Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
                    placeholder="Enter blog title"
                    className={cn(glassFieldClass, errors.title ? 'border-red-500' : '')}
                  />
                  {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(event) => setFormData((prev) => ({ ...prev, date: event.target.value }))}
                      className={cn(glassFieldClass, errors.date ? 'border-red-500' : '')}
                    />
                    {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(event) => setFormData((prev) => ({ ...prev, location: event.target.value }))}
                      placeholder="e.g. Nairobi, Kenya"
                      className={cn(glassFieldClass, errors.location ? 'border-red-500' : '')}
                    />
                    {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
                  </div>
                </div>

                <div className={cn('flex items-center justify-between rounded-lg border bg-muted/20 px-4 py-3', embedded && 'border-white/25 bg-white/20')}>
                  <div>
                    <p className="text-sm font-medium">Visibility</p>
                    <p className="text-xs text-muted-foreground">
                      Control whether this post is visible on the public site.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => {
                        setFormData((prev) => ({ ...prev, is_active: checked as boolean }));
                      }}
                    />
                    <Label htmlFor="is_active" className="cursor-pointer">
                      Active
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={glassCardClass}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="Write your blog story here..."
                  rows={10}
                  className={cn(glassFieldClass, errors.description ? 'border-red-500' : '')}
                />
                <div className="flex items-center justify-between">
                  {errors.description ? (
                    <p className="text-sm text-red-500">{errors.description}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Tell a meaningful story with clear structure and impact.</p>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {(formData.description || '').length} chars
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-5">
            <Card className={glassCardClass}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Featured Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={cn('overflow-hidden rounded-xl border bg-muted/20', embedded && 'border-white/25 bg-white/15')}>
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Blog preview"
                      className="h-56 w-full object-cover"
                      onError={() => setImagePreview('')}
                    />
                  ) : (
                    <div className="flex h-56 flex-col items-center justify-center text-muted-foreground">
                      <ImagePlus className="h-8 w-8" />
                      <p className="mt-2 text-sm">No image selected</p>
                    </div>
                  )}
                </div>

                <div
                  className={cn(
                    'cursor-pointer rounded-xl border-2 border-dashed border-border bg-muted/10 p-5 text-center transition-colors hover:border-primary/50',
                    embedded && 'border-white/35 bg-white/10'
                  )}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Upload className="mx-auto h-6 w-6 text-primary" />
                  <p className="mt-2 text-sm font-medium">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                </div>

                {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}

                {imagePreview && (
                  <Button type="button" variant="outline" onClick={handleRemoveImage} className="w-full">
                    <X className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card className={glassCardClass}>
              <CardContent className="pt-6">
                <div className="rounded-lg border bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    Publishing Tip
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Use a clear title, add a high-quality image, and keep your opening paragraph concise.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator />

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={submitting}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} className="min-w-36">
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? 'Update Blog' : 'Create Blog'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
