import React from 'react';
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit, Trash2, Eye, TrendingUp, FileText, Calendar, Users } from 'lucide-react';

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
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOC04LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Blog Management</h1>
              <p className="text-white/80">Manage your content and publications</p>
            </div>
          </div>
          <Button className="btn btn-secondary gap-2 shadow-lg">
            <Plus className="h-4 w-4" />
            Create Post
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +3
            </span>
          </div>
          <p className="text-3xl font-bold text-base-content mt-4">24</p>
          <p className="text-sm text-base-content/60">Total Posts</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
              <BookOpen className="h-6 w-6 text-green-500" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +2
            </span>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-4">18</p>
          <p className="text-sm text-base-content/60">Published</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
              <Edit className="h-6 w-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-3xl font-bold text-yellow-600 mt-4">6</p>
          <p className="text-sm text-base-content/60">Drafts</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
              <Eye className="h-6 w-6 text-purple-500" />
            </div>
            <span className="text-green-500 text-sm font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +15%
            </span>
          </div>
          <p className="text-3xl font-bold text-purple-600 mt-4">12.4K</p>
          <p className="text-sm text-base-content/60">Total Views</p>
        </div>
      </div>

      {/* Blog Posts Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-base-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-base-content">Recent Blog Posts</h2>
              <p className="text-sm text-base-content/60">Manage and monitor your content</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="btn btn-outline btn-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-base-200 rounded-xl hover:border-primary/30 hover:shadow-md transition-all duration-200 gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-base-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base-content text-lg">{post.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-base-content/60">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {post.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {post.views} views
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge badge-lg ${post.status === 'Published' ? 'badge-success' : 'badge-warning'} px-4 py-3`}>
                    {post.status}
                  </span>
                  <Button variant="ghost" size="sm" className="btn btn-ghost btn-sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="btn btn-ghost btn-sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="btn btn-ghost btn-sm text-error">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;

