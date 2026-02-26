import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  Package, 
  Printer,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ShoppingBag,
  PackageCheck,
  TrendingUp,
  DollarSign,
  Clock,
  Filter,
  RefreshCw,
  ArrowRight,
  Layers
} from 'lucide-react';
import { reportsAPI, ReportParams } from '@/services/reportsService';
import { productService } from '@/services/productService';
import { ProductCategory } from '@/types/productTypes';

// Report type definitions
type ReportType = 'orders' | 'users' | 'products' | 'stock';

interface ReportConfig {
  id: ReportType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
}

const reportConfigs: ReportConfig[] = [
  { 
    id: 'orders', 
    name: 'Orders Report', 
    description: 'Track transactions, order status & revenue',
    icon: ShoppingBag,
    color: 'text-blue-600',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'users', 
    name: 'Users Report', 
    description: 'User registrations, activity & growth',
    icon: Users,
    color: 'text-green-600',
    gradient: 'from-green-500 to-green-600'
  },
  { 
    id: 'products', 
    name: 'Products Report', 
    description: 'Product inventory & categories',
    icon: Package,
    color: 'text-purple-600',
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'stock', 
    name: 'Stock Report', 
    description: 'Stock levels & inventory alerts',
    icon: PackageCheck,
    color: 'text-orange-600',
    gradient: 'from-orange-500 to-orange-600'
  }
];

const ReportsManagement: React.FC = () => {
  // State management
  const [selectedReport, setSelectedReport] = useState<ReportType>('orders');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | ''>('');
  const [lowStockOnly, setLowStockOnly] = useState<boolean>(false);
  const [outOfStockOnly, setOutOfStockOnly] = useState<boolean>(false);
  
  // Categories for product report
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Load categories for products
  const loadCategories = async () => {
    if (categories.length > 0) return;
    setLoadingCategories(true);
    try {
      const response = await productService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let params: ReportParams = {};
      
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      switch (selectedReport) {
        case 'orders':
          if (statusFilter) params.status = statusFilter;
          await reportsAPI.generateOrdersReport(params);
          break;
        case 'users':
          if (statusFilter) params.status = statusFilter;
          await reportsAPI.generateUsersReport(params);
          break;
        case 'products':
          if (categoryFilter) params.category_id = categoryFilter;
          if (isActiveFilter !== '') params.is_active = isActiveFilter;
          await reportsAPI.generateProductsReport(params);
          break;
        case 'stock':
          params.low_stock_only = lowStockOnly;
          params.out_of_stock_only = outOfStockOnly;
          await reportsAPI.generateStockReport(params);
          break;
      }

      setSuccess(`Report downloaded successfully!`);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStatusFilter('');
    setCategoryFilter('');
    setIsActiveFilter('');
    setLowStockOnly(false);
    setOutOfStockOnly(false);
  };

  const hasFilters = () => {
    return startDate || endDate || statusFilter || categoryFilter || isActiveFilter !== '' || lowStockOnly || outOfStockOnly;
  };

  const getStatusOptions = () => {
    if (selectedReport === 'orders') {
      return [
        { value: '', label: 'All Statuses' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
        { value: 'refunded', label: 'Refunded' }
      ];
    }
    return [
      { value: '', label: 'All Statuses' },
      { value: 'active', label: 'Active' },
      { value: 'suspended', label: 'Suspended' },
      { value: 'inactive', label: 'Inactive' }
    ];
  };

  const getCurrentConfig = () => {
    return reportConfigs.find(r => r.id === selectedReport) || reportConfigs[0];
  };

  const setQuickDateRange = (days: number) => {
    const today = new Date();
    const pastDate = new Date(today.getTime() - days * 24 * 60 * 60 * 1000);
    setStartDate(pastDate.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl">
              <BarChart3 className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Reports & Analytics</h1>
              <p className="text-white/80 mt-1">Generate and download detailed PDF reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportConfigs.map((config) => {
          const Icon = config.icon;
          const isSelected = selectedReport === config.id;
          return (
            <button
              key={config.id}
              onClick={() => {
                setSelectedReport(config.id);
                setError(null);
                setSuccess(null);
              }}
              className={`group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 ${
                isSelected ? 'border-primary' : 'border-transparent'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative p-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} shadow-lg flex items-center justify-center mb-4`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="font-bold text-base-content text-lg">{config.name}</h3>
                <p className="text-sm text-base-content/60 mt-1">{config.description}</p>
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Filters Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className={`h-1 bg-gradient-to-r ${getCurrentConfig().gradient}`}></div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Report Filters
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-ghost btn-sm"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>

              {showFilters && (
                <>
                  {/* Date Range */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-base-content/70 mb-3 block">Date Range</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="relative flex-1 min-w-[200px]">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="input input-bordered w-full pl-10 h-12"
                          placeholder="Start Date"
                        />
                      </div>
                      <span className="text-base-content/50">to</span>
                      <div className="relative flex-1 min-w-[200px]">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-base-content/50" />
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="input input-bordered w-full pl-10 h-12"
                          placeholder="End Date"
                        />
                      </div>
                      {/* Quick Presets */}
                      <div className="flex items-center gap-1 ml-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuickDateRange(7)}
                          className="btn btn-outline btn-sm"
                        >
                          7 Days
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuickDateRange(30)}
                          className="btn btn-outline btn-sm"
                        >
                          30 Days
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setQuickDateRange(365)}
                          className="btn btn-outline btn-sm"
                        >
                          1 Year
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Status Filters */}
                  {(selectedReport === 'orders' || selectedReport === 'users') && (
                    <div className="mb-6">
                      <label className="text-sm font-medium text-base-content/70 mb-3 block">Status Filter</label>
                      <div className="flex flex-wrap gap-2">
                        {getStatusOptions().map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setStatusFilter(opt.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                              statusFilter === opt.value
                                ? 'bg-primary text-primary-content'
                                : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products Filters */}
                  {selectedReport === 'products' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-3 block">Category</label>
                        <div className="flex gap-2">
                          <select
                            value={categoryFilter}
                            onChange={(e) => {
                              setCategoryFilter(e.target.value ? Number(e.target.value) : '');
                              if (categories.length === 0) loadCategories();
                            }}
                            onFocus={() => loadCategories()}
                            className="select select-bordered flex-1 h-12"
                          >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                          <Button 
                            variant="outline"
                            onClick={loadCategories}
                            disabled={loadingCategories}
                            className="btn btn-outline h-12"
                          >
                            {loadingCategories ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-base-content/70 mb-3 block">Active Status</label>
                        <select
                          value={isActiveFilter === '' ? '' : isActiveFilter.toString()}
                          onChange={(e) => setIsActiveFilter(e.target.value === '' ? '' : e.target.value === 'true')}
                          className="select select-bordered w-full h-12"
                        >
                          <option value="">All Products</option>
                          <option value="true">Active Only</option>
                          <option value="false">Inactive Only</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Stock Filters */}
                  {selectedReport === 'stock' && (
                    <div className="mb-6">
                      <label className="text-sm font-medium text-base-content/70 mb-3 block">Stock Filter</label>
                      <div className="flex flex-wrap gap-4">
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={lowStockOnly}
                            onChange={(e) => setLowStockOnly(e.target.checked)}
                            className="checkbox checkbox-primary checkbox-lg"
                          />
                          <div>
                            <p className="font-medium text-base-content">Low Stock</p>
                            <p className="text-xs text-base-content/60">Items with stock ≤ 10</p>
                          </div>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer p-4 bg-base-200 rounded-xl hover:bg-base-300 transition-colors">
                          <input
                            type="checkbox"
                            checked={outOfStockOnly}
                            onChange={(e) => setOutOfStockOnly(e.target.checked)}
                            className="checkbox checkbox-primary checkbox-lg"
                          />
                          <div>
                            <p className="font-medium text-base-content">Out of Stock</p>
                            <p className="text-xs text-base-content/60">Items with stock = 0</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Clear Filters */}
                  {hasFilters() && (
                    <div className="mb-6">
                      <Button 
                        variant="ghost" 
                        onClick={clearFilters}
                        className="btn btn-ghost text-error"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-base-200">
                <Button 
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="btn btn-primary h-12 px-8"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Generate & Download PDF
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handlePrint}
                  className="btn btn-outline h-12"
                >
                  <Printer className="h-5 w-5 mr-2" />
                  Print
                </Button>
              </div>

              {/* Messages */}
              {success && (
                <div className="mt-4 alert alert-success">
                  <CheckCircle className="h-5 w-5" />
                  <span>{success}</span>
                </div>
              )}
              {error && (
                <div className="mt-4 alert alert-error">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Current Selection Info */}
          <div className="bg-gradient-to-br from-primary to-orange-500 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {React.createElement(getCurrentConfig().icon, { className: "h-6 w-6" })}
              </div>
              <div>
                <h3 className="font-bold text-lg">{getCurrentConfig().name}</h3>
                <p className="text-xs text-white/70">{getCurrentConfig().description}</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-white/20">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-4 w-4" />
                  Start Date
                </span>
                <span className="font-medium">{startDate || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/80">
                  <Calendar className="h-4 w-4" />
                  End Date
                </span>
                <span className="font-medium">{endDate || 'Not set'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-white/80">
                  <FileText className="h-4 w-4" />
                  Format
                </span>
                <span className="font-medium">PDF</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-base-content flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                  <span className="text-base-content/70 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    This Month
                  </span>
                  <span className="font-bold text-primary">156 reports</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                  <span className="text-base-content/70 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Downloads
                  </span>
                  <span className="font-bold text-green-600">1,234</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-base-200 rounded-xl">
                  <span className="text-base-content/70 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Revenue
                  </span>
                  <span className="font-bold text-purple-600">$24,580</span>
                </div>
              </div>
            </div>
          </div>

          {/* How to Use */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
            <div className="p-6">
              <h3 className="font-bold text-base-content flex items-center gap-2 mb-4">
                <Layers className="h-5 w-5 text-info" />
                How to Use
              </h3>
              <div className="space-y-3">
                {[
                  'Select a report type above',
                  'Set date range or use presets',
                  'Add optional filters',
                  'Click Generate to download'
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm text-base-content/70">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;

