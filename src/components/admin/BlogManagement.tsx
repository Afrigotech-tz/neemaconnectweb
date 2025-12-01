import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus, Edit, Trash2, Eye } from 'lucide-react';

const BlogManagement: React.FC = () => {
  // Mock data for blog posts
  const blogPosts = [
    {
      id: 1,
      title: 'Easter Celebration 2024',
      author: 'Admin User',
      status: 'Published',
      date: '2024-03-15',
      views: 1247
    },
    {
      id: 2,
      title: 'Christmas Concert Highlights',
      author: 'Content Manager',
      status: 'Draft',
      date: '2024-03-10',
      views: 892
    },
    {
      id: 3,
      title: 'New Choir Members Welcome',
      author: 'Admin User',
      status: 'Published',
      date: '2024-03-08',
      views: 654
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
            Blog Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage blog posts, articles, and content publishing
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">75% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.4K</div>
            <p className="text-xs text-muted-foreground">+15% this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Blog Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Blog Posts</CardTitle>
          <CardDescription>
            Manage and monitor your blog content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h3 className="font-medium">{post.title}</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span>By {post.author}</span>
                    <span>{post.date}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      post.status === 'Published' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.status}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {post.views}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogManagement;
