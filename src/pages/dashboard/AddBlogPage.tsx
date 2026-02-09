import React from 'react';
import BlogForm from '@/components/admin/BlogForm';

const AddBlogPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Blog Post</h1>
        <p className="text-gray-600 mt-2">Add a new blog post</p>
      </div>
      <BlogForm />
    </div>
  );
};

export default AddBlogPage;
