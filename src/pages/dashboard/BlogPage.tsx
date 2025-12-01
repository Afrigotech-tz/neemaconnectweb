import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const BlogPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
          <p className="text-gray-600 mt-2">
            Create and manage your blog posts
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Blog Posts</CardTitle>
          <CardDescription>
            Manage and edit your published blog content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>No blog posts yet. Create your first post to get started!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogPage;
