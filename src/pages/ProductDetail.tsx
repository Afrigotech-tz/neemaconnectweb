import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, Minus, Plus, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useShop } from "@/hooks/useShop";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import LoginPromptDialog from "@/components/shop/LoginPromptDialog";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedProduct, loading, fetchProduct } = useShop();
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id));
    }
  }, [id]);

  useEffect(() => {
    if (selectedProduct?.variants?.length) {
      setSelectedVariantId(selectedProduct.variants[0].id);
    }
  }, [selectedProduct]);

  const handleAddToCart = async () => {
    if (!selectedProduct) return;
    if (!user) {
      setShowLoginPrompt(true);
      return;
    }
    const success = await addToCart({
      product_id: selectedProduct.id,
      product_variant_id: selectedVariantId || undefined,
      quantity,
    });
    if (success) {
      setQuantity(1);
    }
  };

  if (loading && !selectedProduct) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Skeleton className="h-96 rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Link to="/shop">
            <Button>Back to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const imageUrl = selectedProduct.image_url || selectedProduct.images?.[0] || '/placeholder.svg';
  const price = parseFloat(selectedProduct.base_price);
  const selectedVariant = selectedProduct.variants?.find(v => v.id === selectedVariantId);
  const displayPrice = selectedVariant?.price || price;
  const stockQty = selectedVariant?.stock_quantity ?? selectedProduct.stock_quantity;

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={imageUrl}
              alt={selectedProduct.name}
              className="w-full h-auto max-h-[500px] object-cover rounded-lg"
            />
            {!selectedProduct.is_active && (
              <Badge variant="secondary" className="absolute top-4 right-4">
                Unavailable
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {selectedProduct.category && (
              <Badge variant="secondary">{selectedProduct.category.name}</Badge>
            )}
            <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
            <p className="text-3xl font-bold text-primary">${displayPrice.toFixed(2)}</p>

            <div className="prose prose-sm text-muted-foreground">
              <p>{selectedProduct.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {stockQty > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock ({stockQty} available)
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-500 border-red-500">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Variant Selector */}
            {selectedProduct.variants && selectedProduct.variants.length > 0 && (
              <div>
                <label className="text-sm font-medium mb-2 block">Variant</label>
                <Select
                  value={selectedVariantId?.toString() || ''}
                  onValueChange={(val) => setSelectedVariantId(parseInt(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedProduct.variants.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id.toString()}>
                        {variant.sku}
                        {variant.price ? ` - $${variant.price.toFixed(2)}` : ''}
                        {variant.stock_quantity <= 0 ? ' (Out of Stock)' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity Selector */}
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(stockQty, quantity + 1))}
                  disabled={quantity >= stockQty}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={handleAddToCart}
              disabled={cartLoading || stockQty <= 0 || !selectedProduct.is_active}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {cartLoading ? 'Adding...' : 'Add to Cart'}
            </Button>

            {/* SKU */}
            <p className="text-xs text-muted-foreground">SKU: {selectedProduct.sku}</p>
          </div>
        </div>
      </div>

      <LoginPromptDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
    </div>
  );
};

export default ProductDetail;
