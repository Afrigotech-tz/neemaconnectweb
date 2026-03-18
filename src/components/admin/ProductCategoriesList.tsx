import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit,
  Trash2,
  Folder,
  Search,
  Eye,
  MoreHorizontal,
  CheckCircle2,
  Layers,
  FolderTree,
} from 'lucide-react';
import { productService } from '@/services/productService';
import { ProductCategory } from '@/types/productTypes';
import { useToast } from '@/hooks/use-toast';

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
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load categories',
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
        loadCategories();
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to delete category',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete category',
      });
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getParentCategoryName = (parentId: number | null) => {
    if (!parentId) return 'None';
    const parent = categories.find(cat => cat.id === parentId);
    return parent ? parent.name : 'Unknown';
  };
  const activeCategories = categories.filter((category) => category.is_active).length;
  const withParentCategories = categories.filter((category) => !!category.parent_id).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64" data-theme="neemadmin">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      <div className="rounded-2xl border bg-gradient-to-r from-indigo-900 via-blue-800 to-cyan-800 p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FolderTree className="h-7 w-7" />
              Product Categories
            </h1>
            <p className="text-white/80 mt-2">Create and maintain category structure for product discovery.</p>
          </div>
          <Link to="/dashboard/products/categories/create" className="btn bg-white text-black hover:bg-white/90 border-0">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60">Total Categories</p>
          <p className="text-2xl font-bold text-base-content mt-1">{categories.length}</p>
        </div>
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Active
          </p>
          <p className="text-2xl font-bold text-base-content mt-1">{activeCategories}</p>
        </div>
        <div className="rounded-xl border bg-base-100 p-4">
          <p className="text-sm text-base-content/60 flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Child Categories
          </p>
          <p className="text-2xl font-bold text-base-content mt-1">{withParentCategories}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl text-base-content">Categories ({filteredCategories.length})</h2>
          <p className="text-base-content/60">List of all product categories in the system</p>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-base-content/60">
                {searchTerm ? 'No categories found matching your search' : 'No categories found'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-4">
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Parent Category</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category.id} className="hover">
                      <td>
                        <div className="flex items-center gap-2">
                          <Folder className="h-4 w-4 text-base-content/50" />
                          {category.name}
                        </div>
                      </td>
                      <td className="max-w-xs truncate">{category.description || '-'}</td>
                      <td>{getParentCategoryName(category.parent_id)}</td>
                      <td>
                        <span className={`badge ${category.is_active ? 'badge-success' : 'badge-warning'}`}>
                          {category.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="dropdown dropdown-end">
                          <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-48 border border-base-300">
                            <li>
                              <Link to={`/dashboard/products/categories/view/${category.id}`}>
                                <Eye className="h-4 w-4" />
                                View
                              </Link>
                            </li>
                            <li>
                              <Link to={`/dashboard/products/categories/edit/${category.id}`}>
                                <Edit className="h-4 w-4" />
                                Edit
                              </Link>
                            </li>
                            <li className="border-t border-base-300 mt-2 pt-2">
                              <a 
                                onClick={() => handleDeleteCategory(category.id, category.name)}
                                className="text-error"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoriesList;
