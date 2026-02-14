import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/hooks/useCart";

const CartPage = () => {
  const { cart, loading, fetchCart, updateCartItem, removeCartItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, { quantity: newQuantity });
  };

  if (loading && cart.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-10 w-48 mb-8" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full mb-4 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cart.items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground mb-6">Browse our shop and add some items to your cart.</p>
            <Link to="/shop">
              <Button className="bg-gradient-primary">Browse Shop</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const price = parseFloat(item.product.base_price);
                const imageUrl = item.product.image_url || item.product.images?.[0] || '/placeholder.svg';
                return (
                  <Card key={item.id} className="p-4">
                    <div className="flex gap-4">
                      <img
                        src={imageUrl}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/shop/${item.product.id}`} className="hover:text-primary transition-colors">
                          <h3 className="font-medium truncate">{item.product.name}</h3>
                        </Link>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground">Variant: {item.variant.sku}</p>
                        )}
                        <p className="text-primary font-semibold mt-1">${price.toFixed(2)}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeCartItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm font-semibold">
                          ${(price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Items ({cart.count})</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{cart.total >= 50 ? 'Free' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Link to="/checkout">
                  <Button className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Proceed to Checkout
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
