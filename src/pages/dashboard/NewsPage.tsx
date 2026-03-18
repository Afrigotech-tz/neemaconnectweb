import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RadioPagination from '@/components/ui/radio-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Calendar, User, Eye } from 'lucide-react';
import { newsService } from '@/services/newsService/newsService';
import { News, PaginatedResponse } from '@/types/newsTypes';

const NewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(15);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['news', currentPage, perPage],
    queryFn: () => newsService.getNews({ page: currentPage, per_page: perPage }),
    placeholderData: (previousData) => previousData,
  });

  const newsData = data?.data as PaginatedResponse<News> | undefined;
  const newsList = newsData?.data || [];
  const meta = newsData?.meta;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>
            <p className="text-gray-600 mt-2">
              Stay updated with the latest news and announcements
            </p>
          </div>
        </div>
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load news. Please try again.
            <Button variant="outline" size="sm" onClick={() => refetch()} className="ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest news and announcements
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create News
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
          <CardDescription>
            Read and manage news articles and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : newsList.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No news articles yet. Create your first news post!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {newsList.map((news) => (
                <Card key={news.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                        {news.title}
                      </h3>
                      <Badge variant="secondary" className="ml-2">
                        News
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {news.content}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{news.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(news.published_at)}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Read More
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="flex justify-center items-center mt-6">
                  <RadioPagination
                    currentPage={currentPage}
                    totalPages={meta.last_page}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              {/* Pagination Info */}
              {meta && (
                <div className="text-center text-sm text-gray-500 mt-4">
                  Showing {meta.from} to {meta.to} of {meta.total} news articles
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsPage;
