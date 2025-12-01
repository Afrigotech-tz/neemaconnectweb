import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Folder,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { productService } from '@/services/productService';
import { ProductCategory } from '@/types/productTypes';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ProductCategoriesList: React.FC = () => {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await productService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load categories',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number, categoryName: string) => {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await productService.deleteCategory(categoryId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Category deleted successfully',
        });
        loadCategories(); // Refresh the list
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete category',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
        variant: 'destructive',
      });
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getParentCategoryName = (parentId: number | null) => {
    if (!parentId) return 'None';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="loading-spinner">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
          <p className="text-gray-600 mt-2">
            Create and manage product categories for your store
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/categories/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Categories ({filteredCategories.length})</CardTitle>
          <CardDescription>
            List of all product categories in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No categories found matching your search' : 'No categories found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        {category.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      {getParentCategoryName(category.parent_id)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/categories/edit/${category.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteCategory(category.id, category.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductCategoriesList;
