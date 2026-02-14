import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Product } from "@/types/productTypes";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import LoginPromptDialog from "@/components/shop/LoginPromptDialog";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, loading } = useCart();
  const { user } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    await addToCart({ product_id: product.id, quantity: 1 });
  };

  const imageUrl = product.image_url || product.images?.[0] || '/placeholder.svg';
  const price = parseFloat(product.base_price);

  return (
    <>
      <Link to={`/shop/${product.id}`}>
        <Card className="group hover:shadow-warm transition-all duration-300 h-full flex flex-col">
          <div className="relative overflow-hidden">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {product.category && (
              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground">
                  {product.category.name}
                </Badge>
              </div>
            )}
            {!product.is_active && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">Unavailable</Badge>
              </div>
            )}
          </div>

          <CardHeader className="pb-3">
            <CardTitle className="group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 flex-1">
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {product.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">
                ${price.toFixed(2)}
              </span>
              {product.stock_quantity > 0 ? (
                <span className="text-xs text-green-600">In Stock</span>
              ) : (
                <span className="text-xs text-red-500">Out of Stock</span>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-3">
            <Button
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={handleAddToCart}
              disabled={loading || !product.is_active || product.stock_quantity <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      </Link>

      <LoginPromptDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
    </>
  );
};

export default ProductCard;
