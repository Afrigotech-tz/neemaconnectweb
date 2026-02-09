import React, { createContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Blog, CreateBlogData, UpdateBlogData, BlogSearchParams } from '@/types/blogTypes';
import { blogService } from '@/services/blogService';
import { useToast } from '@/hooks/use-toast';

interface BlogContextType {
  blogs: Blog[];
  selectedBlog: Blog | null;
  loading: boolean;
  error: string | null;
  fetchBlogs: (params?: BlogSearchParams, showToast?: boolean) => Promise<void>;
  fetchBlog: (id: number) => Promise<void>;
  createBlog: (data: CreateBlogData) => Promise<boolean>;
  updateBlog: (id: number, data: UpdateBlogData) => Promise<boolean>;
  deleteBlog: (id: number) => Promise<boolean>;
  setSelectedBlog: (blog: Blog | null) => void;
  clearError: () => void;
  getFeaturedBlogs: () => Promise<void>;
  getPublishedBlogs: (params?: BlogSearchParams) => Promise<void>;
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

  const fetchBlogs = useCallback(async (params?: BlogSearchParams, showToast = false) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getBlogs(params);

      if (response.success && response.data) {
        setBlogs(response.data);
        if (showToast) {
          toast({
            title: 'Success',
            description: response.message,
          });
        }
      } else {
        setError(response.message);
        if (showToast) {
          toast({
            title: 'Error',
            description: response.message,
            variant: 'destructive',
          });
        }
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching blogs';
      setError(errorMessage);
      if (showToast) {
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
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
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching blog';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh blogs list
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while creating blog';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh blogs list
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while updating blog';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
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
        toast({
          title: 'Success',
          description: response.message,
        });
        // Refresh blogs list
        await fetchBlogs();
        return true;
      } else {
        setError(response.message);
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while deleting blog';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchBlogs]);

  const getFeaturedBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getFeaturedBlogs();

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching featured blogs';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const getPublishedBlogs = useCallback(async (params?: BlogSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await blogService.getPublishedBlogs(params);

      if (response.success && response.data) {
        setBlogs(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      const errorMessage = 'An unexpected error occurred while fetching published blogs';
      setError(errorMessage);
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
    getFeaturedBlogs,
    getPublishedBlogs,
  };

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
};
