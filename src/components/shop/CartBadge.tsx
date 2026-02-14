import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

const CartBadge = () => {
  const { cart } = useCart();

  return (
    <Link to="/cart">
      <Button variant="ghost" size="sm" className="relative p-2">
        <ShoppingCart className="h-5 w-5" />
        {cart.count > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {cart.count > 99 ? '99+' : cart.count}
          </span>
        )}
      </Button>
    </Link>
  );
};

export default CartBadge;
