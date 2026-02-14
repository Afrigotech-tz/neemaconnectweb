import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const OrderHistoryPage = () => {
  const { userOrders, loading, userOrdersPagination, fetchUserOrders } = useOrder();

  useEffect(() => {
    fetchUserOrders(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchUserOrders(page);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View your order history and track your purchases.</p>
      </div>

      {loading && userOrders.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && userOrders.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Start shopping to see your orders here.</p>
          <Link to="/shop">
            <Button>Go to Shop</Button>
          </Link>
        </div>
      )}

      {userOrders.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items?.length || 0} items</TableCell>
                  <TableCell className="font-semibold">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/orders/${order.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      {userOrdersPagination && userOrdersPagination.last_page > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={userOrdersPagination.current_page <= 1}
            onClick={() => handlePageChange(userOrdersPagination.current_page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {userOrdersPagination.current_page} of {userOrdersPagination.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={userOrdersPagination.current_page >= userOrdersPagination.last_page}
            onClick={() => handlePageChange(userOrdersPagination.current_page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
