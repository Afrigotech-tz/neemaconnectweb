import React, { createContext, useState, useCallback, ReactNode } from 'react';
import { Blog, CreateBlogData, UpdateBlogData, BlogFilters } from '@/types/blogTypes';
import { blogService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

interface BlogContextType {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  fetchBlogs: (filters?: BlogFilters, showToast?: boolean) => Promise<void>;
  fetchBlog: (id: number) => Promise<void>;
  createBlog: (data: CreateBlogData) => Promise<boolean>;
  updateBlog: (id: number, data: UpdateBlogData) => Promise<boolean>;
  deleteBlog: (id: number) => Promise<boolean>;
  setSelectedBlog: (blog: Blog | null) => void;
  clearError: () => void;
  getActiveBlogs: (filters?: BlogFilters) => Promise<void>;
}

export const BlogContext = createContext<BlogContextType | undefined>(undefined);

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchBlogs = useCallback(async (filters?: BlogFilters, showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getBlogs(filters);

      if (response.success && response.data) {
        setBlogs(response.data);
        if (showToast) {
          toast({ title: 'Success', description: response.message });
        }
      } else {
        setError(response.message);
        if (showToast) {
          toast({ title: 'Error', description: response.message, variant: 'destructive' });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching blogs';
      setError(errorMessage);
      if (showToast) {
        toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchBlog = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getBlog(id);

      if (response.success && response.data) {
        setSelectedBlog(response.data);
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching blog';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createBlog = useCallback(async (data: CreateBlogData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.createBlog(data);

      if (response.success) {
        toast({ title: 'Success', description: response.message });
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating blog';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBlogs]);

  const updateBlog = useCallback(async (id: number, data: UpdateBlogData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.updateBlog(id, data);

      if (response.success) {
        toast({ title: 'Success', description: response.message });
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating blog';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBlogs]);

  const deleteBlog = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.deleteBlog(id);

      if (response.success) {
        toast({ title: 'Success', description: response.message });
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({ title: 'Error', description: response.message, variant: 'destructive' });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while deleting blog';
      setError(errorMessage);
      toast({ title: 'Error', description: errorMessage, variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBlogs]);

  const getActiveBlogs = useCallback(async (filters?: BlogFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getActiveBlogs(filters);

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An unexpected error occurred while fetching active blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  const value: BlogContextType = {
    blogs,
    selectedBlog,
    loading,
    error,
    fetchBlogs,
    fetchBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    setSelectedBlog,
    clearError,
    getActiveBlogs,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
