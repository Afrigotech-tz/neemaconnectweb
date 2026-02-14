import { CartItem } from "@/types/cartTypes";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ items, total }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Order Summary</h3>
      <div className="divide-y">
        {items.map((item) => {
          const price = parseFloat(item.product.base_price);
          return (
            <div key={item.id} className="flex justify-between py-3">
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">
                    Variant: {item.variant.sku}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <span className="font-medium text-sm">
                ${(price * item.quantity).toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t pt-4">
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
