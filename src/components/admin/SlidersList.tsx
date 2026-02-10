import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSlider } from '@/hooks/useSlider';
import { HomeSlider } from '@/types/sliderTypes';
import { Plus, Edit, Trash2, ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';

const SlidersList: React.FC = () => {
  const { sliders, fetchSliders, deleteSlider, toggleSliderStatus, loading } = useSlider();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sliderToDelete, setSliderToDelete] = useState<HomeSlider | null>(null);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const handleDeleteClick = (slider: HomeSlider) => {
    setSliderToDelete(slider);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (sliderToDelete) {
      await deleteSlider(sliderToDelete.id);
      setDeleteDialogOpen(false);
      setSliderToDelete(null);
    }
  };

  const handleToggleStatus = async (slider: HomeSlider) => {
    await toggleSliderStatus(slider.id, !slider.is_active);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Slider Management</h1>
          <p className="text-gray-600 mt-2">Manage home page sliders</p>
        </div>
        <Button asChild>
          <Link to="/dashboard/slider-management/add">
            <Plus className="h-4 w-4 mr-2" />
            Create Slider
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Home Sliders ({sliders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sliders.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sliders found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first slider.</p>
              <Button asChild>
                <Link to="/dashboard/slider-management/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Slider
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Head</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliders.map((slider) => (
                  <TableRow key={slider.id}>
                    <TableCell className="font-medium">{slider.sort_order}</TableCell>
                    <TableCell>
                      <div className="w-20 h-12 bg-gray-100 rounded overflow-hidden">
                        {slider.image ? (
                          <img
                            src={slider.image}
                            alt={slider.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{slider.title}</TableCell>
                    <TableCell className="max-w-xs truncate">{slider.head}</TableCell>
                    <TableCell>
                      <Badge variant={slider.is_active ? 'default' : 'secondary'}>
                        {slider.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(slider)}
                          title={slider.is_active ? 'Deactivate' : 'Activate'}
                        >
                          {slider.is_active ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/dashboard/slider-management/edit/${slider.id}`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(slider)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Slider</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{sliderToDelete?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SlidersList;
