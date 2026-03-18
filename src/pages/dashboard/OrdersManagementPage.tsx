import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Eye, Search, CheckCircle2, Clock3, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import RadioPagination from "@/components/ui/radio-pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/useOrder";
import { OrderFilters } from "@/types/orderTypes";

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersManagementPage = () => {
  const { orders, loading, ordersPagination, fetchOrders } = useOrder();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchOrders({ page: 1 });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const filters: OrderFilters = {
        search: searchInput || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        page: 1,
      };
      fetchOrders(filters);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchInput, statusFilter]);

  const handlePageChange = (page: number) => {
    fetchOrders({
      search: searchInput || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      page,
    });
  };

  const pendingOrders = orders.filter((order) => order.status === 'pending').length;
  const processingOrders = orders.filter((order) => order.status === 'processing').length;
  const deliveredOrders = orders.filter((order) => order.status === 'delivered').length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-800 p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Package className="h-7 w-7" />
          Orders Management
        </h1>
        <p className="text-white/80 mt-2">Track order pipeline, monitor fulfillment stages, and manage customer orders.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-amber-600" />
            Pending
          </p>
          <p className="text-2xl font-bold mt-1">{pendingOrders}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Truck className="h-4 w-4 text-sky-600" />
            Processing
          </p>
          <p className="text-2xl font-bold mt-1">{processingOrders}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Delivered
          </p>
          <p className="text-2xl font-bold mt-1">{deliveredOrders}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && orders.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="text-center py-16">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No orders found</h3>
          <p className="text-muted-foreground">No orders match your current filters.</p>
        </div>
      )}

      {orders.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>User #{order.user_id}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{order.items?.length || 0}</TableCell>
                  <TableCell className="font-semibold">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || 'bg-gray-100 text-gray-800'}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/orders-management/${order.id}`}>
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
      {ordersPagination && ordersPagination.last_page > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">
            Page {ordersPagination.current_page} of {ordersPagination.last_page}
          </span>
          <RadioPagination
            currentPage={ordersPagination.current_page}
            totalPages={ordersPagination.last_page}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default OrdersManagementPage;
