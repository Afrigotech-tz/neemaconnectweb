import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const GalleryPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-gray-600 mt-2">
            Manage your photo collections and albums
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Photos
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Gallery</CardTitle>
          <CardDescription>
            Browse and organize your photo collections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>No photos yet. Add your first photos to the gallery!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GalleryPage;
