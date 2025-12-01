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
  Tag,
  Search,
  Filter,
  MoreHorizontal,
  List
} from 'lucide-react';
import { productService } from '@/services/productService';
import { ProductAttribute } from '@/types/productTypes';
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

const ProductAttributesList: React.FC = () => {
  const [attributes, setAttributes] = useState<ProductAttribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const response = await productService.getAttributes();
      if (response.success && response.data) {
        setAttributes(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to load attributes',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load attributes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttribute = async (attributeId: number, attributeName: string) => {
    if (!confirm(`Are you sure you want to delete the attribute "${attributeName}"?`)) {
      return;
    }

    try {
      const response = await productService.deleteAttribute(attributeId);
      if (response.success) {
        toast({
          title: 'Success',
          description: 'Attribute deleted successfully',
        });
        loadAttributes(); // Refresh the list
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete attribute',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete attribute',
        variant: 'destructive',
      });
    }
  };

  const filteredAttributes = attributes.filter(attribute =>
    attribute.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Product Attributes</h1>
          <p className="text-gray-600 mt-2">
            Create and manage product attributes for your store
          </p>
        </div>
        <Button asChild>
          <Link to="/admin/products/attributes/create">
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
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
                placeholder="Search attributes..."
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

      {/* Attributes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Attributes ({filteredAttributes.length})</CardTitle>
          <CardDescription>
            List of all product attributes in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attribute</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Required</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAttributes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {searchTerm ? 'No attributes found matching your search' : 'No attributes found'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttributes.map((attribute) => (
                  <TableRow key={attribute.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                        {attribute.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {attribute.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={attribute.is_required ? "default" : "secondary"}>
                        {attribute.is_required ? 'Required' : 'Optional'}
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
                            <Link to={`/admin/products/attributes/edit/${attribute.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/admin/products/attributes/${attribute.id}/values`}>
                              <List className="h-4 w-4 mr-2" />
                              Manage Values
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteAttribute(attribute.id, attribute.name)}
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

export default ProductAttributesList;
