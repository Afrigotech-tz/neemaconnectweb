import { useEffect } from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import ProductCard from "@/components/shop/ProductCard";
import { useShop } from "@/hooks/useShop";

const FeaturedProducts = () => {
  const { products, loading, fetchProducts } = useShop();

  useEffect(() => {
    fetchProducts({ per_page: 3, sort_by: 'created_at', sort_order: 'desc' });
  }, []);

  return (
    <section className="landing-band landing-band-petal py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Award className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-4xl font-bold text-foreground">Featured Products</h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our most popular inspirational products that help spread the message of faith and hope.
          </p>
        </div>

        {/* Loading */}
        {loading && products.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Link to="/shop">
            <Button
              size="lg"
              className="bg-gradient-warm hover:shadow-warm transition-all duration-300"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
