import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, MapPin, CreditCard, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrder";

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedOrder, loading, fetchOrder } = useOrder();

  useEffect(() => {
    if (id) {
      fetchOrder(parseInt(id));
    }
  }, [id]);

  if (loading && !selectedOrder) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="text-center py-16">
        <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Order not found</h3>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Orders
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Order #{selectedOrder.id}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {new Date(selectedOrder.created_at).toLocaleString()}
          </p>
        </div>
        <Badge className={`text-sm ${statusColors[selectedOrder.status] || ''}`}>
          {selectedOrder.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        {selectedOrder.address && (
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Shipping Address
            </h3>
            <p>{selectedOrder.address.label}</p>
            <p className="text-muted-foreground text-sm">{selectedOrder.address.street}</p>
            <p className="text-muted-foreground text-sm">
              {selectedOrder.address.city}, {selectedOrder.address.state_province} {selectedOrder.address.postal_code}
            </p>
            <p className="text-muted-foreground text-sm">{selectedOrder.address.country}</p>
          </Card>
        )}

        {/* Transaction Info */}
        {selectedOrder.transaction && (
          <Card className="p-6">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Method</span>
                <span>{selectedOrder.transaction.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-mono">{selectedOrder.transaction.reference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span>{selectedOrder.transaction.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">${Number(selectedOrder.transaction.amount).toFixed(2)}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Order Items */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Order Items</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedOrder.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product?.name || `Product #${item.product_id}`}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">${Number(item.unit_price).toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${Number(item.total_price).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-4">
          <div className="text-right">
            <p className="text-lg font-bold">
              Total: ${Number(selectedOrder.total_amount).toFixed(2)}
            </p>
          </div>
        </div>
      </Card>

      {/* Notes */}
      {selectedOrder.notes && (
        <Card className="p-6">
          <h3 className="font-semibold mb-2">Order Notes</h3>
          <p className="text-muted-foreground">{selectedOrder.notes}</p>
        </Card>
      )}
    </div>
  );
};

export default OrderDetailPage;
