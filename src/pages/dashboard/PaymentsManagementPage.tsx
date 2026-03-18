import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, RefreshCw, Search } from "lucide-react";
import { paymentService } from "@/services/paymentService";
import { Order } from "@/types/orderTypes";
import { PaymentMethod } from "@/types/paymentTypes";
import { useToast } from "@/hooks/use-toast";
import { formatTZS } from "@/lib/currency";

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface ListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const defaultMeta: ListMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 0,
  total: 0,
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const PaymentsManagementPage = () => {
  const { toast } = useToast();
  const [loadingMethods, setLoadingMethods] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [workingOrderId, setWorkingOrderId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [statusMap, setStatusMap] = useState<Record<number, OrderStatus>>({});
  const [listMeta, setListMeta] = useState<ListMeta>(defaultMeta);
  const [pageInput, setPageInput] = useState("1");

  const [orderLookupId, setOrderLookupId] = useState("");
  const [orderDetail, setOrderDetail] = useState<Order | null>(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  const normalizeMethods = (payload: unknown): PaymentMethod[] => {
    if (Array.isArray(payload)) return payload as PaymentMethod[];
    if (payload && typeof payload === "object" && "data" in (payload as { data?: unknown })) {
      const inner = (payload as { data?: unknown }).data;
      if (Array.isArray(inner)) return inner as PaymentMethod[];
    }
    return [];
  };

  const normalizeOrdersWithMeta = (payload: unknown): { items: Order[]; meta: ListMeta } => {
    if (Array.isArray(payload)) {
      const items = payload as Order[];
      return {
        items,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: items.length,
          total: items.length,
        },
      };
    }

    if (payload && typeof payload === "object") {
      const data = payload as Record<string, unknown>;
      if (Array.isArray(data.data)) {
        const items = data.data as Order[];
        const perPage = Number(data.per_page ?? items.length) || items.length;
        const total = Number(data.total ?? items.length) || items.length;
        const current = Number(data.current_page ?? 1) || 1;
        const last = Number(data.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))) || 1;
        return {
          items,
          meta: {
            current_page: current,
            last_page: Math.max(last, 1),
            per_page: perPage,
            total,
          },
        };
      }
    }

    return { items: [], meta: defaultMeta };
  };

  const loadMethods = async () => {
    setLoadingMethods(true);
    try {
      const response = await paymentService.getPaymentMethods();
      if (response.success) {
        const items = normalizeMethods(response.data);
        setMethods(items);
      } else {
        setMethods([]);
      }
    } finally {
      setLoadingMethods(false);
    }
  };

  const loadOrders = async (page = 1) => {
    setLoadingOrders(true);
    try {
      const response = await paymentService.getPaymentOrders(page, 'admin');
      if (response.success) {
        const normalized = normalizeOrdersWithMeta(response.data);
        setOrders(normalized.items);
        setListMeta(normalized.meta);
        const nextStatusMap: Record<number, OrderStatus> = {};
        normalized.items.forEach((order) => {
          const status = (order.status || "pending") as OrderStatus;
          nextStatusMap[order.id] = status;
        });
        setStatusMap(nextStatusMap);
      } else {
        setOrders([]);
        setListMeta(defaultMeta);
        toast({
          title: "Load failed",
          description: response.message || "Failed to fetch payment orders.",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    void Promise.all([loadMethods(), loadOrders(1)]);
  }, []);

  const handleFindOrder = async () => {
    const id = Number(orderLookupId);
    if (!Number.isFinite(id) || id <= 0) {
      toast({ title: "Invalid order ID", description: "Enter a valid order ID.", variant: "destructive" });
      return;
    }

    setLoadingOrderDetail(true);
    try {
      const response = await paymentService.getPaymentOrder(id);
      if (response.success && response.data) {
        setOrderDetail(response.data);
      } else {
        setOrderDetail(null);
        toast({
          title: "Not found",
          description: response.message || "Order was not found.",
          variant: "destructive",
        });
      }
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number) => {
    const status = statusMap[orderId];
    if (!status) return;
    setWorkingOrderId(orderId);
    try {
      const response = await paymentService.updatePaymentOrderStatus(orderId, { status });
      if (response.success) {
        toast({
          title: "Order updated",
          description: response.message || "Order status updated successfully.",
        });
        await loadOrders(listMeta.current_page || 1);
        if (orderDetail && orderDetail.id === orderId) {
          await handleFindOrder();
        }
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update order status.",
          variant: "destructive",
        });
      }
    } finally {
      setWorkingOrderId(null);
    }
  };

  const totalAmount = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0),
    [orders]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments Management</h1>
          <p className="text-muted-foreground">Payment methods, payment orders, and payment processing tools.</p>
        </div>
        <Button variant="outline" onClick={() => void Promise.all([loadMethods(), loadOrders(Number(pageInput) || 1)])}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Orders on Current Page</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Listed Total Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatTZS(totalAmount)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{methods.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Payment Methods (`GET /api/payments/methods`)</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingMethods ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading methods...
            </div>
          ) : methods.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment methods found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {methods.map((method) => (
                <div key={method.id} className="rounded-md border p-3">
                  <p className="font-semibold">{method.name}</p>
                  <p className="text-xs text-muted-foreground">Type: {method.type}</p>
                  <p className="text-xs text-muted-foreground">ID: {method.id}</p>
                  <Badge className="mt-2" variant={method.is_active ? "default" : "secondary"}>
                    {method.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment Orders (`GET /api/payments/orders` + `PUT /api/payments/orders/{'{id}'}/status`)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end gap-3">
            <div className="w-full sm:w-40">
              <Label htmlFor="payment-orders-page">Page</Label>
              <Input
                id="payment-orders-page"
                value={pageInput}
                onChange={(event) => setPageInput(event.target.value)}
                placeholder="1"
              />
            </div>
            <Button
              onClick={() => void loadOrders(Math.max(1, Number(pageInput) || 1))}
              disabled={loadingOrders}
            >
              Load Orders
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Total: {listMeta.total} | Page: {listMeta.current_page}/{listMeta.last_page}
          </p>

          {loadingOrders ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading payment orders...
            </div>
          ) : orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payment orders found.</p>
          ) : (
            <div className="rounded-md border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Update</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>#{order.user_id}</TableCell>
                      <TableCell>{formatTZS(Number(order.total_amount || 0))}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Select
                            value={statusMap[order.id] || (order.status as OrderStatus)}
                            onValueChange={(value) =>
                              setStatusMap((prev) => ({ ...prev, [order.id]: value as OrderStatus }))
                            }
                          >
                            <SelectTrigger className="w-[140px]">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => void handleUpdateOrderStatus(order.id)}
                            disabled={workingOrderId === order.id}
                          >
                            Save
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Lookup (`GET /api/payments/orders/{'{id}'}`)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={orderLookupId}
              onChange={(event) => setOrderLookupId(event.target.value)}
              placeholder="Enter order ID"
            />
            <Button onClick={() => void handleFindOrder()} disabled={loadingOrderDetail}>
              <Search className="h-4 w-4 mr-2" />
              Find
            </Button>
          </div>

          {loadingOrderDetail ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading order detail...
            </div>
          ) : orderDetail ? (
            <div className="rounded-md border p-4 text-sm space-y-1">
              <p><span className="font-semibold">Order:</span> #{orderDetail.id}</p>
              <p><span className="font-semibold">User:</span> #{orderDetail.user_id}</p>
              <p><span className="font-semibold">Status:</span> {orderDetail.status}</p>
              <p><span className="font-semibold">Total:</span> {formatTZS(Number(orderDetail.total_amount || 0))}</p>
              <p><span className="font-semibold">Created:</span> {new Date(orderDetail.created_at).toLocaleString()}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No order selected.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Backend Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This backend payment page is limited to management functions: viewing payment methods,
            listing orders, viewing order details, and updating payment order status.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Customer payment actions (`/payments/process`, `/payments/tickets/process`,
            `/payments/tickets/{'{orderId}'}/confirm`) are handled from frontend Checkout and Tickets flows.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsManagementPage;
