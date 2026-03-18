import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Users, Star, Heart, Loader2, Search, RefreshCcw, XCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventService } from '@/services/eventService';
import { Event } from '@/types/eventTypes';
import { Link } from 'react-router-dom';
import { ticketService } from '@/services/ticketService';
import { TicketOrder, TicketType } from '@/types/ticketTypes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const Tickets = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ticketTypesByEvent, setTicketTypesByEvent] = useState<Record<number, TicketType[]>>({});
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<number | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState('mobile_money');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone_number || '');
  const [purchasing, setPurchasing] = useState(false);
  const [myOrders, setMyOrders] = useState<TicketOrder[]>([]);
  const [loadingMyOrders, setLoadingMyOrders] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToConfirm, setOrderToConfirm] = useState<TicketOrder | null>(null);
  const [confirmPaymentRef, setConfirmPaymentRef] = useState('');
  const [lookupRef, setLookupRef] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupOrder, setLookupOrder] = useState<TicketOrder | null>(null);

  const normalizeTicketOrders = (payload: unknown): TicketOrder[] => {
    if (Array.isArray(payload)) return payload as TicketOrder[];
    if (
      payload &&
      typeof payload === 'object' &&
      'data' in (payload as { data?: unknown }) &&
      Array.isArray((payload as { data?: unknown }).data)
    ) {
      return (payload as { data: TicketOrder[] }).data;
    }
    return [];
  };

  const fetchMyOrders = async () => {
    if (!user) return;

    setLoadingMyOrders(true);
    try {
      const response = await ticketService.getMyOrders();
      if (response.success && response.data) {
        setMyOrders(normalizeTicketOrders(response.data));
      } else {
        setMyOrders([]);
      }
    } finally {
      setLoadingMyOrders(false);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await eventService.getEvents({ per_page: 50 });
        // Filter for upcoming and public events
        const upcomingEvents = response.data.data.filter(
          (event: Event) => event.status === 'upcoming' && event.is_public
        );
        setEvents(upcomingEvents);

        const ticketTypeResponses = await Promise.all(
          upcomingEvents.map(async (event: Event) => {
            const ticketTypeResponse = await ticketService.getEventTicketTypes(Number(event.id));
            return {
              eventId: Number(event.id),
              ticketTypes: ticketTypeResponse.success && ticketTypeResponse.data
                ? ticketTypeResponse.data
                : [],
            };
          })
        );

        const ticketTypeMap: Record<number, TicketType[]> = {};
        ticketTypeResponses.forEach((result) => {
          ticketTypeMap[result.eventId] = result.ticketTypes;
        });
        setTicketTypesByEvent(ticketTypeMap);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (user) {
      void fetchMyOrders();
    }
  }, [user?.id]);

  useEffect(() => {
    setGuestEmail(user?.email || '');
    setGuestPhone(user?.phone_number || '');
  }, [user?.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getEventTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      concert: 'Concert',
      service: 'Service',
      live_recording: 'Live Recording',
      conference: 'Conference',
      other: 'Other'
    };
    return typeMap[type] || type;
  };

  // Default event image
  const getEventImage = (event: Event) => {
    if (event.image) return event.image;
    return "/lovable-uploads/362930e2-5eb0-4f2b-ae8d-cb0f718cd8db.png";
  };

  const openPurchaseDialog = (eventId: number, ticketTypeId: number) => {
    setSelectedEventId(eventId);
    setSelectedTicketTypeId(ticketTypeId);
    setPurchaseQuantity(1);
    setPurchaseDialogOpen(true);
  };

  const refreshSingleOrder = async (orderId: number) => {
    setActiveOrderId(orderId);
    try {
      const response = await ticketService.getOrder(orderId);
      if (response.success && response.data) {
        setMyOrders((previous) =>
          previous.map((order) => (order.id === orderId ? (response.data as TicketOrder) : order))
        );
      }
    } finally {
      setActiveOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    setActiveOrderId(orderId);
    try {
      const response = await ticketService.cancelOrder(orderId);
      if (response.success) {
        toast({
          title: 'Order cancelled',
          description: response.message || 'Ticket order cancelled successfully.',
        });
        await fetchMyOrders();
      } else {
        toast({
          title: 'Cancellation failed',
          description: response.message || 'Unable to cancel this order.',
          variant: 'destructive',
        });
      }
    } finally {
      setActiveOrderId(null);
    }
  };

  const openConfirmPaymentDialog = (order: TicketOrder) => {
    setOrderToConfirm(order);
    setConfirmPaymentRef(order.payment_reference || '');
    setConfirmDialogOpen(true);
  };

  const handleConfirmOrderPayment = async () => {
    if (!orderToConfirm) return;

    setActiveOrderId(orderToConfirm.id);
    try {
      const response = await ticketService.confirmOrderPayment(orderToConfirm.id, {
        payment_ref: confirmPaymentRef.trim() || undefined,
      });

      if (response.success) {
        toast({
          title: 'Payment confirmed',
          description: response.message || 'Ticket payment confirmed successfully.',
        });
        setConfirmDialogOpen(false);
        setOrderToConfirm(null);
        setConfirmPaymentRef('');
        await fetchMyOrders();
      } else {
        toast({
          title: 'Confirmation failed',
          description: response.message || 'Unable to confirm payment.',
          variant: 'destructive',
        });
      }
    } finally {
      setActiveOrderId(null);
    }
  };

  const handleLookupByReference = async () => {
    if (!lookupRef.trim()) return;
    setLookupLoading(true);
    setLookupOrder(null);
    try {
      const response = await ticketService.getOrderByPaymentReference(lookupRef.trim());
      if (response.success && response.data) {
        setLookupOrder(response.data);
      } else {
        toast({
          title: 'No order found',
          description: response.message || 'No ticket order found for that payment reference.',
          variant: 'destructive',
        });
      }
    } finally {
      setLookupLoading(false);
    }
  };

  const handleTicketPurchase = async () => {
    if (!selectedEventId || !selectedTicketTypeId) return;
    if (!guestEmail.trim() && !user) {
      toast({
        title: 'Email required',
        description: 'Please provide an email to complete ticket purchase.',
        variant: 'destructive',
      });
      return;
    }

    setPurchasing(true);
    try {
      const response = await ticketService.purchaseTickets({
        event_id: selectedEventId,
        ticket_type_id: selectedTicketTypeId,
        quantity: purchaseQuantity,
        payment_method: purchasePaymentMethod,
        guest_email: guestEmail.trim() || undefined,
        guest_phone: guestPhone.trim() || undefined,
      });

      if (response.success) {
        toast({
          title: 'Ticket order created',
          description: response.message || 'Your ticket order has been submitted successfully.',
        });
        setPurchaseDialogOpen(false);
        if (user) {
          await fetchMyOrders();
        }
      } else {
        toast({
          title: 'Purchase failed',
          description: response.message || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Purchase failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Event Tickets
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Book your tickets for our upcoming concerts and events. Join us for inspiring worship, 
            beautiful music, and fellowship in the presence of God.
          </p>
          <div className="flex justify-center items-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              <span>Secure Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <span>Group Discounts</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              <span>Free Events Available</span>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Upcoming Events</h2>
            <p className="text-muted-foreground">Don't miss out on these amazing worship experiences</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading events...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Events List */}
          {!loading && !error && events.length > 0 && (
            <div className="space-y-8">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-warm transition-all duration-300">
                  <div className="md:flex">
                    <div className="md:w-1/3">
                      <img 
                        src={getEventImage(event)} 
                        alt={event.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                    </div>
                    <div className="md:w-2/3 p-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {getEventTypeLabel(event.type)}
                        </Badge>
                        {event.is_featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl font-bold text-foreground mb-3">{event.title}</h3>
                      <p className="text-muted-foreground mb-4">{event.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-secondary" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-accent" />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <h4 className="font-semibold text-foreground">Ticket Information:</h4>
                        {ticketTypesByEvent[event.id] && ticketTypesByEvent[event.id].length > 0 ? (
                          ticketTypesByEvent[event.id].map((ticketType) => (
                            <div key={ticketType.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div>
                                <span className="font-medium">{ticketType.name}</span>
                                <span className="text-muted-foreground ml-2">
                                  - {formatPrice(Number(ticketType.price))}
                                </span>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Available: {ticketType.available ?? ticketType.quantity}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant={Number(ticketType.price) === 0 ? "secondary" : "default"}
                                onClick={() => openPurchaseDialog(Number(event.id), ticketType.id)}
                              >
                                Purchase
                              </Button>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div>
                              <span className="font-medium">General Admission</span>
                              <span className="text-muted-foreground ml-2">- {formatPrice(event.ticket_price)}</span>
                            </div>
                            <Button 
                              size="sm" 
                              variant={event.ticket_price === 0 ? "secondary" : "default"}
                              asChild={!!event.ticket_url}
                            >
                              {event.ticket_url ? (
                                <a href={event.ticket_url} target="_blank" rel="noopener noreferrer">
                                  Get Tickets
                                </a>
                              ) : (
                                <span>Register Now</span>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 inline mr-1" />
                          {event.location}, {event.city}, {event.country}
                        </div>
                        <Button variant="outline" asChild>
                          <Link to="/events">View Details</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* No Events State */}
          {!loading && !error && events.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-muted-foreground mb-4">
                No upcoming events
              </h3>
              <p className="text-muted-foreground mb-6">
                Check back later for new events or browse all events.
              </p>
              <Button asChild>
                <Link to="/events">View All Events</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {user && (
        <section className="py-12 bg-muted/20 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Ticket Orders</h2>
              <p className="text-muted-foreground">Manage your ticket purchases, payment confirmations, and order status.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Find Order by Payment Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    value={lookupRef}
                    onChange={(event) => setLookupRef(event.target.value)}
                    placeholder="Enter payment reference (e.g. TKT-ABC123)"
                  />
                  <Button onClick={handleLookupByReference} disabled={lookupLoading || !lookupRef.trim()}>
                    {lookupLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
                {lookupOrder && (
                  <div className="mt-4 rounded-lg border p-4 text-sm">
                    <p><span className="font-semibold">Order:</span> #{lookupOrder.id}</p>
                    <p><span className="font-semibold">Status:</span> {lookupOrder.status}</p>
                    <p><span className="font-semibold">Amount:</span> ${Number(lookupOrder.total_amount).toFixed(2)}</p>
                    <p><span className="font-semibold">Payment Ref:</span> {lookupOrder.payment_reference || '-'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order List</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingMyOrders ? (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading your ticket orders...
                  </div>
                ) : myOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ticket orders found yet.</p>
                ) : (
                  <div className="space-y-4">
                    {myOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div>
                            <p className="font-semibold">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleString()} • Qty {order.quantity} • ${Number(order.total_amount).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Payment Ref: {order.payment_reference || '-'}
                            </p>
                          </div>
                          <Badge variant="secondary" className="w-fit capitalize">
                            {order.status}
                          </Badge>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refreshSingleOrder(order.id)}
                            disabled={activeOrderId === order.id}
                          >
                            <RefreshCcw className="h-4 w-4 mr-1" />
                            Refresh
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openConfirmPaymentDialog(order)}
                            disabled={activeOrderId === order.id}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Confirm Payment
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={activeOrderId === order.id || ['cancelled', 'completed', 'paid'].includes(order.status.toLowerCase())}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel Order
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Booking Information */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Booking Information</h2>
            <p className="text-muted-foreground">Everything you need to know about our events</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Ticket className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Simple online booking process with instant confirmation
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle className="text-lg">Group Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Special pricing for groups of 10 or more people
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Heart className="h-12 w-12 text-secondary mx-auto mb-4" />
                <CardTitle className="text-lg">Free Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Many of our events are free - donations are welcome
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-warm transition-all duration-300">
              <CardHeader>
                <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-lg">VIP Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Premium seating and exclusive meet & greet opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact for Events */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Questions About Events?</h2>
          <p className="text-muted-foreground mb-8">
            Contact us for group bookings, special arrangements, or any other inquiries
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={purchaseDialogOpen} onOpenChange={setPurchaseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Ticket Purchase</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ticket-quantity">Quantity</Label>
              <Input
                id="ticket-quantity"
                type="number"
                min={1}
                value={purchaseQuantity}
                onChange={(event) => setPurchaseQuantity(Number(event.target.value || 1))}
              />
            </div>

            <div>
              <Label htmlFor="ticket-payment-method">Payment Method</Label>
              <Select value={purchasePaymentMethod} onValueChange={setPurchasePaymentMethod}>
                <SelectTrigger id="ticket-payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="guest-email">Email</Label>
              <Input
                id="guest-email"
                type="email"
                value={guestEmail}
                onChange={(event) => setGuestEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="guest-phone">Phone (Optional)</Label>
              <Input
                id="guest-phone"
                value={guestPhone}
                onChange={(event) => setGuestPhone(event.target.value)}
                placeholder="+255 743 871 360"
              />
            </div>

            <Button className="w-full" onClick={handleTicketPurchase} disabled={purchasing}>
              {purchasing ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Ticket Payment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Confirm payment for order #{orderToConfirm?.id}. Payment reference is optional.
            </p>
            <div>
              <Label htmlFor="confirm-payment-ref">Payment Reference</Label>
              <Input
                id="confirm-payment-ref"
                value={confirmPaymentRef}
                onChange={(event) => setConfirmPaymentRef(event.target.value)}
                placeholder="e.g. TKT-ABC123"
              />
            </div>
            <Button
              className="w-full"
              onClick={handleConfirmOrderPayment}
              disabled={!orderToConfirm || activeOrderId === orderToConfirm.id}
            >
              {orderToConfirm && activeOrderId === orderToConfirm.id ? 'Confirming...' : 'Confirm Payment'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;
