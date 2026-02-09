import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useBlog } from '@/hooks/useBlog';
import { CreateBlogData, UpdateBlogData } from '@/types/blogTypes';
import { Loader2, Save, X } from 'lucide-react';
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
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    content: '',
    excerpt: '',
    author: '',
    image_url: '',
    category: '',
    tags: [],
    status: 'draft',
    is_featured: false,
    meta_title: '',
    meta_description: '',
    slug: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        content: selectedBlog.content,
        excerpt: selectedBlog.excerpt || '',
        author: selectedBlog.author,
        image_url: selectedBlog.image_url || '',
        category: selectedBlog.category,
        tags: selectedBlog.tags || [],
        status: selectedBlog.status,
        is_featured: selectedBlog.is_featured || false,
        meta_title: selectedBlog.meta_title || '',
        meta_description: selectedBlog.meta_description || '',
        slug: selectedBlog.slug || '',
      });
    }
  }, [selectedBlog, blogId]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      let success;
      if (isEditMode && blogId) {
        success = await updateBlog(blogId, formData as UpdateBlogData);
      } else {
        success = await createBlog(formData);
      }

      if (success) {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/dashboard/blog-management');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/dashboard/blog-management');
    }
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
                placeholder="Enter blog title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* Author */}
            <div>
              <Label htmlFor="author">
                Author <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                placeholder="Author name"
                className={errors.author ? 'border-red-500' : ''}
              />
              {errors.author && <p className="text-sm text-red-500 mt-1">{errors.author}</p>}
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Technology, Lifestyle"
                className={errors.category ? 'border-red-500' : ''}
              />
              {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <Label htmlFor="image_url">Featured Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* Excerpt */}
            <div className="md:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Short summary of the blog post"
                rows={2}
              />
            </div>

            {/* Content */}
            <div className="md:col-span-2">
              <Label htmlFor="content">
                Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your blog content here..."
                rows={10}
                className={errors.content ? 'border-red-500' : ''}
              />
              {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="blog-post-url"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to auto-generate from title
              </p>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'draft' | 'published' | 'archived') =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meta Title */}
            <div>
              <Label htmlFor="meta_title">SEO Meta Title</Label>
              <Input
                id="meta_title"
                value={formData.meta_title}
                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                placeholder="SEO title"
              />
            </div>

            {/* Meta Description */}
            <div>
              <Label htmlFor="meta_description">SEO Meta Description</Label>
              <Input
                id="meta_description"
                value={formData.meta_description}
                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                placeholder="SEO description"
              />
            </div>

            {/* Featured Checkbox */}
            <div className="md:col-span-2 flex items-center space-x-2">
              <Checkbox
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_featured: checked as boolean })
                }
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Feature this blog post
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
