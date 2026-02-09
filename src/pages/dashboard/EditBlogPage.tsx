import React from 'react';
import { useParams } from 'react-router-dom';
import BlogForm from '@/components/admin/BlogForm';

const EditBlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
        <p className="text-gray-600 mt-2">Update blog post details</p>
      </div>
      <BlogForm blogId={id ? parseInt(id) : undefined} />
    </div>
  );
};

export default EditBlogPage;
