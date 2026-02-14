import { useEffect, useState } from "react";
import { ShoppingCart, Star, Heart, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/shop/ProductCard";
import { useShop } from "@/hooks/useShop";
import { ShopProductFilters } from "@/types/shopTypes";

const Shop = () => {
  const { products, categories, loading, pagination, fetchProducts, fetchCategories } = useShop();
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filters: ShopProductFilters = {
        search: searchInput || undefined,
        category_id: selectedCategory || undefined,
        sort_by: sortBy as ShopProductFilters['sort_by'],
        sort_order: sortOrder as ShopProductFilters['sort_order'],
        page: 1,
      };
      fetchProducts(filters);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput, selectedCategory, sortBy, sortOrder]);

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
  };

  const handlePageChange = (page: number) => {
    const filters: ShopProductFilters = {
      search: searchInput || undefined,
      category_id: selectedCategory || undefined,
      sort_by: sortBy as ShopProductFilters['sort_by'],
      sort_order: sortOrder as ShopProductFilters['sort_order'],
      page,
    };
    fetchProducts(filters);
  };

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-hero text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">Choir Shop</h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            Take home a piece of our ministry. Browse our collection of music, merchandise, and memorabilia.
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-12">
            <div className="flex flex-wrap items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Categories:</span>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedCategory === null ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleCategoryClick(null)}
                >
                  All
                </Badge>
                {categories.map((category) => (
                  <Badge
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={`${sortBy}-${sortOrder}`} onValueChange={(val) => {
                const [by, order] = val.split('-');
                setSortBy(by);
                setSortOrder(order);
              }}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at-desc">Newest</SelectItem>
                  <SelectItem value="created_at-asc">Oldest</SelectItem>
                  <SelectItem value="price-asc">Price: Low-High</SelectItem>
                  <SelectItem value="price-desc">Price: High-Low</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Count */}
          <div className="text-muted-foreground mb-6">
            {pagination ? `${pagination.total} product${pagination.total !== 1 ? 's' : ''}` : `${products.length} products`}
          </div>

          {/* Loading Skeletons */}
          {loading && products.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Products Grid */}
          {products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page <= 1}
                onClick={() => handlePageChange(pagination.current_page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {pagination.links
                .filter((link) => link.page !== null)
                .map((link, idx) => (
                  <Button
                    key={idx}
                    variant={link.active ? "default" : "outline"}
                    size="sm"
                    onClick={() => link.page && handlePageChange(link.page)}
                  >
                    {link.label}
                  </Button>
                ))}
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.current_page >= pagination.last_page}
                onClick={() => handlePageChange(pagination.current_page + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-16 bg-gradient-to-br from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Featured Collection</h2>
            <p className="text-xl text-muted-foreground">
              Limited edition items celebrating our 15 years of ministry
            </p>
          </div>

          <div className="bg-gradient-hero rounded-2xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Anniversary Collection</h3>
            <p className="text-lg mb-6 opacity-90">
              Commemorate our journey with exclusive merchandise and recordings from our anniversary celebration.
            </p>
            <Button
              size="lg"
              className="bg-white text-foreground hover:bg-white/90 transition-all duration-300"
            >
              View Collection
            </Button>
          </div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-12 bg-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Free Shipping</h3>
              <p className="text-muted-foreground text-sm">On orders over $50</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Ministry Support</h3>
              <p className="text-muted-foreground text-sm">All proceeds support our mission</p>
            </div>
            <div>
              <div className="w-12 h-12 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground text-sm">30-day return policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shop;
