import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Loader2, Calendar, Eye, Clock, Ticket, Save, RefreshCw, Search, CheckCircle2, XCircle } from 'lucide-react';
import { Event } from '@/types/eventTypes';
import { eventService } from '@/services/eventService/eventService';
import EventForm from './EventForm';
import EventView from './EventView';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ticketService } from '@/services/ticketService/ticketService';
import { TicketOrder, TicketSalesSummary, TicketType } from '@/types/ticketTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type EventsManagementMode = 'full' | 'tickets';

interface EventsManagementProps {
  mode?: EventsManagementMode;
}

const EventsManagement: React.FC<EventsManagementProps> = ({ mode = 'full' }) => {
  const isTicketsOnly = mode === 'tickets';
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null);
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false);
  const [ticketEvent, setTicketEvent] = useState<Event | null>(null);
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [ticketSalesSummary, setTicketSalesSummary] = useState<TicketSalesSummary | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketSaving, setTicketSaving] = useState(false);
  const [editingTicketTypeId, setEditingTicketTypeId] = useState<number | null>(null);
  const [ticketTypeForm, setTicketTypeForm] = useState({
    name: '',
    description: '',
    price: 0,
    quantity: 0,
  });
  const [ticketTab, setTicketTab] = useState('types');
  const [ticketOrders, setTicketOrders] = useState<TicketOrder[]>([]);
  const [ticketOrderActionLoadingId, setTicketOrderActionLoadingId] = useState<number | null>(null);
  const [ticketOrderDetails, setTicketOrderDetails] = useState<TicketOrder | null>(null);
  const [ticketOrderDetailsLoading, setTicketOrderDetailsLoading] = useState(false);
  const [orderDetailsInput, setOrderDetailsInput] = useState('');
  const [confirmOrderId, setConfirmOrderId] = useState('');
  const [confirmPaymentRef, setConfirmPaymentRef] = useState('');
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [selectedPurchaseTicketTypeId, setSelectedPurchaseTicketTypeId] = useState<number | null>(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState('mobile_money');
  const [purchaseGuestEmail, setPurchaseGuestEmail] = useState('');
  const [purchaseGuestPhone, setPurchaseGuestPhone] = useState('');
  const [purchasingTickets, setPurchasingTickets] = useState(false);
  const [paymentReferenceLookup, setPaymentReferenceLookup] = useState('');
  const [paymentReferenceOrder, setPaymentReferenceOrder] = useState<TicketOrder | null>(null);
  const [paymentReferenceLoading, setPaymentReferenceLoading] = useState(false);
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventService.getEvents({ per_page: 100 });
      setEvents(response.data.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    setEditingEvent(undefined);
    setIsFormOpen(true);
  };

  const handleViewEvent = (event: Event) => {
    setViewingEvent(event);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleDeleteEvent = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.title}"?`)) {
      return;
    }

    try {
      await eventService.deleteEvent(event.id);
      toast({
        title: 'Success',
        description: 'Event deleted successfully',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete event. Please try again.',
      });
    }
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    fetchEvents();
  };

  const resetTicketTypeForm = () => {
    setTicketTypeForm({
      name: '',
      description: '',
      price: 0,
      quantity: 0,
    });
    setEditingTicketTypeId(null);
  };

  const normalizeTicketTypes = (payload: unknown): TicketType[] => {
    if (Array.isArray(payload)) return payload as TicketType[];
    if (payload && typeof payload === 'object' && 'data' in (payload as { data?: unknown })) {
      const direct = (payload as { data?: unknown }).data;
      if (Array.isArray(direct)) return direct as TicketType[];
      if (direct && typeof direct === 'object' && 'data' in (direct as { data?: unknown })) {
        const nested = (direct as { data?: unknown }).data;
        if (Array.isArray(nested)) return nested as TicketType[];
      }
    }
    return [];
  };

  const normalizeTicketOrders = (payload: unknown): TicketOrder[] => {
    if (Array.isArray(payload)) return payload as TicketOrder[];
    if (payload && typeof payload === 'object' && 'data' in (payload as { data?: unknown })) {
      const direct = (payload as { data?: unknown }).data;
      if (Array.isArray(direct)) return direct as TicketOrder[];
      if (direct && typeof direct === 'object' && 'data' in (direct as { data?: unknown })) {
        const nested = (direct as { data?: unknown }).data;
        if (Array.isArray(nested)) return nested as TicketOrder[];
      }
    }
    return [];
  };

  const normalizeTicketOrder = (payload: unknown): TicketOrder | null => {
    if (!payload) return null;
    if (payload && typeof payload === 'object' && 'id' in (payload as { id?: unknown })) {
      return payload as TicketOrder;
    }
    if (payload && typeof payload === 'object' && 'data' in (payload as { data?: unknown })) {
      const direct = (payload as { data?: unknown }).data;
      if (direct && typeof direct === 'object' && 'id' in (direct as { id?: unknown })) {
        return direct as TicketOrder;
      }
    }
    return null;
  };

  const loadTicketData = async (eventId: number) => {
    setTicketLoading(true);
    try {
      const [typesResponse, salesResponse, myOrdersResponse] = await Promise.all([
        ticketService.getEventTicketTypes(eventId),
        ticketService.getEventSalesSummary(eventId),
        ticketService.getMyOrders(),
      ]);

      if (typesResponse.success && typesResponse.data) {
        const normalizedTypes = normalizeTicketTypes(typesResponse.data);
        setTicketTypes(normalizedTypes);
        setSelectedPurchaseTicketTypeId((previous) => {
          if (previous && normalizedTypes.some((type) => type.id === previous)) {
            return previous;
          }
          return normalizedTypes[0]?.id ?? null;
        });
      } else {
        setTicketTypes([]);
        setSelectedPurchaseTicketTypeId(null);
      }

      if (salesResponse.success && salesResponse.data) {
        setTicketSalesSummary(salesResponse.data);
      } else {
        setTicketSalesSummary(null);
      }

      if (myOrdersResponse.success && myOrdersResponse.data) {
        const filteredOrders = normalizeTicketOrders(myOrdersResponse.data).filter(
          (order) => Number(order.event_id) === Number(eventId)
        );
        setTicketOrders(filteredOrders);
      } else {
        setTicketOrders([]);
      }
    } finally {
      setTicketLoading(false);
    }
  };

  const openTicketDialog = async (event: Event) => {
    setTicketEvent(event);
    setIsTicketDialogOpen(true);
    setTicketTab('types');
    resetTicketTypeForm();
    setTicketOrderDetails(null);
    setOrderDetailsInput('');
    setConfirmOrderId('');
    setConfirmPaymentRef('');
    setPurchaseQuantity(1);
    setPurchasePaymentMethod('mobile_money');
    setPurchaseGuestEmail('');
    setPurchaseGuestPhone('');
    setPaymentReferenceLookup('');
    setPaymentReferenceOrder(null);
    await loadTicketData(event.id);
  };

  const handleEditTicketType = (ticketType: TicketType) => {
    setEditingTicketTypeId(ticketType.id);
    setTicketTypeForm({
      name: ticketType.name,
      description: ticketType.description || '',
      price: Number(ticketType.price || 0),
      quantity: Number(ticketType.quantity || 0),
    });
  };

  const handleSaveTicketType = async () => {
    if (!ticketEvent) return;
    const trimmedName = ticketTypeForm.name.trim();
    if (!trimmedName) return;

    setTicketSaving(true);
    try {
      const payload = {
        name: trimmedName,
        description: ticketTypeForm.description.trim() || undefined,
        price: Number(ticketTypeForm.price),
        quantity: Number(ticketTypeForm.quantity),
      };

      const response = editingTicketTypeId
        ? await ticketService.updateTicketType(editingTicketTypeId, payload)
        : await ticketService.createEventTicketType(ticketEvent.id, payload);

      if (response.success) {
        toast({
          title: editingTicketTypeId ? 'Ticket type updated' : 'Ticket type created',
          description: response.message || 'Ticket type saved successfully.',
        });
        resetTicketTypeForm();
        await loadTicketData(ticketEvent.id);
      } else {
        toast({
          title: 'Save failed',
          description: response.message || 'Unable to save ticket type.',
          variant: 'destructive',
        });
      }
    } finally {
      setTicketSaving(false);
    }
  };

  const handleDeleteTicketType = async (ticketTypeId: number) => {
    if (!ticketEvent) return;
    if (!confirm('Delete this ticket type?')) return;

    setTicketSaving(true);
    try {
      const response = await ticketService.deleteTicketType(ticketTypeId);
      if (response.success) {
        toast({
          title: 'Ticket type deleted',
          description: response.message || 'Ticket type deleted successfully.',
        });
        if (editingTicketTypeId === ticketTypeId) {
          resetTicketTypeForm();
        }
        await loadTicketData(ticketEvent.id);
      } else {
        toast({
          title: 'Delete failed',
          description: response.message || 'Unable to delete ticket type.',
          variant: 'destructive',
        });
      }
    } finally {
      setTicketSaving(false);
    }
  };

  const loadTicketOrderDetails = async (orderId: number) => {
    if (!Number.isFinite(orderId) || orderId <= 0) return;

    setTicketOrderDetailsLoading(true);
    try {
      const response = await ticketService.getOrder(orderId);
      if (response.success && response.data) {
        const normalized = normalizeTicketOrder(response.data);
        if (normalized) {
          setTicketOrderDetails(normalized);
        } else {
          setTicketOrderDetails(null);
          toast({
            title: 'Order not found',
            description: 'Unable to parse order details from response.',
            variant: 'destructive',
          });
        }
      } else {
        setTicketOrderDetails(null);
        toast({
          title: 'Order lookup failed',
          description: response.message || 'Unable to load order details.',
          variant: 'destructive',
        });
      }
    } finally {
      setTicketOrderDetailsLoading(false);
    }
  };

  const handleFetchOrderDetailsByInput = async () => {
    const orderId = Number(orderDetailsInput);
    if (!orderId) {
      toast({
        title: 'Order ID required',
        description: 'Please enter a valid order ID.',
        variant: 'destructive',
      });
      return;
    }
    await loadTicketOrderDetails(orderId);
  };

  const handleConfirmTicketPayment = async () => {
    const orderId = Number(confirmOrderId);
    if (!orderId) {
      toast({
        title: 'Order ID required',
        description: 'Please enter a valid order ID.',
        variant: 'destructive',
      });
      return;
    }

    setConfirmingPayment(true);
    try {
      const response = await ticketService.confirmOrderPayment(orderId, {
        payment_ref: confirmPaymentRef.trim() || undefined,
      });

      if (response.success) {
        toast({
          title: 'Payment confirmed',
          description: response.message || 'Ticket payment confirmed successfully.',
        });
        await loadTicketOrderDetails(orderId);
        if (ticketEvent) {
          await loadTicketData(ticketEvent.id);
        }
      } else {
        toast({
          title: 'Confirmation failed',
          description: response.message || 'Unable to confirm ticket payment.',
          variant: 'destructive',
        });
      }
    } finally {
      setConfirmingPayment(false);
    }
  };

  const handleCancelTicketOrder = async (orderId: number) => {
    if (!ticketEvent) return;
    if (!confirm(`Cancel ticket order #${orderId}?`)) return;

    setTicketOrderActionLoadingId(orderId);
    try {
      const response = await ticketService.cancelOrder(orderId);
      if (response.success) {
        toast({
          title: 'Order cancelled',
          description: response.message || 'Ticket order cancelled successfully.',
        });
        if (ticketOrderDetails?.id === orderId) {
          setTicketOrderDetails(null);
        }
        await loadTicketData(ticketEvent.id);
      } else {
        toast({
          title: 'Cancellation failed',
          description: response.message || 'Unable to cancel ticket order.',
          variant: 'destructive',
        });
      }
    } finally {
      setTicketOrderActionLoadingId(null);
    }
  };

  const handlePurchaseTickets = async () => {
    if (!ticketEvent || !selectedPurchaseTicketTypeId) {
      toast({
        title: 'Ticket type required',
        description: 'Please select a ticket type before purchasing.',
        variant: 'destructive',
      });
      return;
    }

    if (!purchaseGuestEmail.trim()) {
      toast({
        title: 'Email required',
        description: 'Guest email is required to purchase tickets.',
        variant: 'destructive',
      });
      return;
    }

    setPurchasingTickets(true);
    try {
      const response = await ticketService.purchaseTickets({
        event_id: ticketEvent.id,
        ticket_type_id: selectedPurchaseTicketTypeId,
        quantity: Math.max(1, Number(purchaseQuantity || 1)),
        payment_method: purchasePaymentMethod.trim() || 'mobile_money',
        guest_email: purchaseGuestEmail.trim(),
        guest_phone: purchaseGuestPhone.trim() || undefined,
      });

      if (response.success) {
        toast({
          title: 'Order created',
          description: response.message || 'Ticket order created successfully.',
        });
        setPurchaseQuantity(1);
        if (ticketEvent) {
          await loadTicketData(ticketEvent.id);
        }
      } else {
        toast({
          title: 'Purchase failed',
          description: response.message || 'Unable to purchase ticket.',
          variant: 'destructive',
        });
      }
    } finally {
      setPurchasingTickets(false);
    }
  };

  const handleLookupOrderByPaymentRef = async () => {
    const paymentRef = paymentReferenceLookup.trim();
    if (!paymentRef) {
      toast({
        title: 'Payment reference required',
        description: 'Enter payment reference to search.',
        variant: 'destructive',
      });
      return;
    }

    setPaymentReferenceLoading(true);
    setPaymentReferenceOrder(null);
    try {
      const response = await ticketService.getOrderByPaymentReference(paymentRef);
      if (response.success && response.data) {
        const normalized = normalizeTicketOrder(response.data);
        if (normalized) {
          setPaymentReferenceOrder(normalized);
        } else {
          toast({
            title: 'Lookup failed',
            description: 'No order found for that payment reference.',
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: 'Lookup failed',
          description: response.message || 'No order found for this payment reference.',
          variant: 'destructive',
        });
      }
    } finally {
      setPaymentReferenceLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <span className="badge badge-success badge-lg">Upcoming</span>;
      case "past":
        return <span className="badge badge-ghost badge-lg">Past</span>;
      case "cancelled":
        return <span className="badge badge-error badge-lg">Cancelled</span>;
      default:
        return null;
    }
  };

  const getOrderStatusBadgeClass = (status: string) => {
    const normalized = status.toLowerCase();
    if (['paid', 'completed', 'confirmed'].includes(normalized)) return 'badge-success';
    if (['cancelled', 'failed'].includes(normalized)) return 'badge-error';
    if (['pending', 'processing'].includes(normalized)) return 'badge-warning';
    return 'badge-outline';
  };

  const getSalesTicketTypes = (): Array<Record<string, unknown>> => {
    if (!ticketSalesSummary || typeof ticketSalesSummary !== 'object') return [];
    const maybeTicketTypes = (ticketSalesSummary as { ticket_types?: unknown }).ticket_types;
    if (!Array.isArray(maybeTicketTypes)) return [];
    return maybeTicketTypes.filter(
      (item): item is Record<string, unknown> => !!item && typeof item === 'object'
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20" data-theme="neemadmin">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOC04LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Calendar className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{isTicketsOnly ? 'Tickets Management' : 'Events Management'}</h1>
              <p className="text-white/80">
                {isTicketsOnly ? 'Manage ticket types, purchases, payments, and ticket orders by event.' : 'Manage your events and performances'}
              </p>
            </div>
          </div>
          {!isTicketsOnly ? (
            <Button onClick={handleCreateEvent} className="btn btn-secondary gap-2 shadow-lg">
              <Plus className="h-4 w-4" />
              Add Event
            </Button>
          ) : null}
        </div>
      </div>

      {error && (
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Events Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Calendar className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-base-content">{events.length}</p>
              <p className="text-sm text-base-content/60">Total Events</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-xl">
              <Clock className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{events.filter(e => e.status === 'upcoming').length}</p>
              <p className="text-sm text-base-content/60">Upcoming</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-xl">
              <Ticket className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{events.filter(e => e.ticket_price > 0).length}</p>
              <p className="text-sm text-base-content/60">Paid Events</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-base-200">
          <h2 className="text-xl font-bold text-base-content">All Events</h2>
          <p className="text-sm text-base-content/60">Manage your event calendar</p>
        </div>
        <div className="p-6">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-base-content/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-base-content mb-2">No events found</h3>
              <p className="text-base-content/60 mb-4">
                {isTicketsOnly ? 'Create events first, then manage ticketing here.' : 'Create your first event!'}
              </p>
              {!isTicketsOnly ? (
                <Button onClick={handleCreateEvent} className="btn btn-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              ) : null}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="bg-base-100">
                    <th className="font-bold">Event</th>
                    <th className="font-bold">Type</th>
                    <th className="font-bold">Date & Time</th>
                    <th className="font-bold">Location</th>
                    <th className="font-bold">Price</th>
                    <th className="font-bold">Status</th>
                    <th className="text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event) => (
                    <tr key={event.id} className="hover transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <Calendar className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p 
                              className={`font-semibold text-base-content transition-colors ${
                                isTicketsOnly ? '' : 'cursor-pointer hover:text-primary'
                              }`}
                              onClick={() => {
                                if (!isTicketsOnly) {
                                  handleViewEvent(event);
                                }
                              }}
                            >
                              {event.title}
                            </p>
                            {event.is_featured && (
                              <span className="badge badge-secondary badge-sm">Featured</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-outline capitalize">{event.type}</span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2 text-base-content/70">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.date)}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <p className="text-base-content">{event.venue}</p>
                          <p className="text-base-content/50">{event.city}</p>
                        </div>
                      </td>
                      <td>
                        <span className="font-semibold text-base-content">{formatPrice(event.ticket_price)}</span>
                      </td>
                      <td>{getStatusBadge(event.status)}</td>
                      <td className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isTicketsOnly ? (
                            <Button variant="outline" size="sm" onClick={() => openTicketDialog(event)}>
                              <Ticket className="h-4 w-4 mr-2" />
                              Manage Tickets
                            </Button>
                          ) : (
                            <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => openTicketDialog(event)}>
                              <Ticket className="h-4 w-4" />
                            </Button>
                          )}
                          {!isTicketsOnly ? (
                            <>
                              <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => handleViewEvent(event)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs" onClick={() => handleEditEvent(event)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="btn btn-ghost btn-xs text-error" onClick={() => handleDeleteEvent(event)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Dialog
        open={isTicketDialogOpen}
        onOpenChange={(open) => {
          setIsTicketDialogOpen(open);
          if (!open) {
            setTicketEvent(null);
            resetTicketTypeForm();
            setTicketOrders([]);
            setTicketOrderDetails(null);
            setPaymentReferenceOrder(null);
            setTicketTab('types');
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Ticketing Management {ticketEvent ? `- ${ticketEvent.title}` : ''}
            </DialogTitle>
          </DialogHeader>

          {ticketLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading ticket data...
            </div>
          ) : (
            <Tabs value={ticketTab} onValueChange={setTicketTab} className="space-y-4">
              <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
                <TabsTrigger value="types">Ticket Types</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="purchase">Purchase</TabsTrigger>
                <TabsTrigger value="lookup">Lookup</TabsTrigger>
              </TabsList>

              <TabsContent value="types" className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">GET /api/tickets/events/{'{eventId}'}/sales - Orders</p>
                    <p className="text-lg font-semibold">{ticketSalesSummary?.total_orders ?? 0}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">Tickets Sold</p>
                    <p className="text-lg font-semibold">{ticketSalesSummary?.total_tickets_sold ?? 0}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="text-lg font-semibold">${Number(ticketSalesSummary?.total_revenue ?? 0).toFixed(2)}</p>
                  </div>
                </div>

                {getSalesTicketTypes().length > 0 ? (
                  <div className="rounded-lg border p-4 space-y-2">
                    <p className="font-semibold">Sales Breakdown by Ticket Type</p>
                    <div className="overflow-x-auto">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Ticket Type</th>
                            <th>Sold</th>
                            <th>Revenue</th>
                          </tr>
                        </thead>
                        <tbody>
                          {getSalesTicketTypes().map((item, index) => {
                            const name = String(item.name ?? item.ticket_type_name ?? `Type ${index + 1}`);
                            const sold = Number(item.sold ?? item.total_sold ?? item.quantity_sold ?? 0);
                            const revenue = Number(item.revenue ?? item.total_revenue ?? 0);
                            return (
                              <tr key={`${name}-${index}`}>
                                <td>{name}</td>
                                <td>{sold}</td>
                                <td>${revenue.toFixed(2)}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : null}

                <div className="rounded-lg border p-4 space-y-3">
                  <p className="font-semibold">
                    {editingTicketTypeId ? 'PUT /api/tickets/ticket-types/{ticketTypeId}' : 'POST /api/tickets/events/{eventId}/ticket-types'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="ticket-type-name">Name</Label>
                      <Input
                        id="ticket-type-name"
                        value={ticketTypeForm.name}
                        onChange={(event) => setTicketTypeForm((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="e.g. VIP"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ticket-type-qty">Quantity</Label>
                      <Input
                        id="ticket-type-qty"
                        type="number"
                        min={0}
                        value={ticketTypeForm.quantity}
                        onChange={(event) => setTicketTypeForm((prev) => ({ ...prev, quantity: Number(event.target.value || 0) }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="ticket-type-price">Price</Label>
                      <Input
                        id="ticket-type-price"
                        type="number"
                        min={0}
                        step="0.01"
                        value={ticketTypeForm.price}
                        onChange={(event) => setTicketTypeForm((prev) => ({ ...prev, price: Number(event.target.value || 0) }))}
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label htmlFor="ticket-type-description">Description</Label>
                      <Textarea
                        id="ticket-type-description"
                        value={ticketTypeForm.description}
                        onChange={(event) => setTicketTypeForm((prev) => ({ ...prev, description: event.target.value }))}
                        placeholder="Optional description"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTicketType} disabled={ticketSaving || !ticketTypeForm.name.trim()}>
                      <Save className="h-4 w-4 mr-2" />
                      {editingTicketTypeId ? 'Update' : 'Create'}
                    </Button>
                    {editingTicketTypeId && (
                      <Button variant="outline" onClick={resetTicketTypeForm} disabled={ticketSaving}>
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">GET /api/tickets/events/{'{eventId}'}/ticket-types</p>
                  {ticketTypes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No ticket types created yet.</p>
                  ) : (
                    ticketTypes.map((ticketType) => (
                      <div key={ticketType.id} className="rounded-lg border p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p className="font-medium">{ticketType.name}</p>
                          <p className="text-sm text-muted-foreground">
                            ${Number(ticketType.price).toFixed(2)} • Qty {ticketType.quantity} • Sold {ticketType.sold ?? 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditTicketType(ticketType)} disabled={ticketSaving}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTicketType(ticketType.id)}
                            disabled={ticketSaving}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="font-semibold">GET /api/tickets/my-orders (filtered by selected event)</p>
                  <Button variant="outline" size="sm" onClick={() => ticketEvent && loadTicketData(ticketEvent.id)} disabled={ticketLoading}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {ticketOrders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No ticket orders found for this event under the authenticated account.</p>
                ) : (
                  <div className="space-y-3">
                    {ticketOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border p-3 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-muted-foreground">
                              Qty {order.quantity} • ${Number(order.total_amount).toFixed(2)} • Payment Ref {order.payment_reference || '-'}
                            </p>
                          </div>
                          <span className={`badge ${getOrderStatusBadgeClass(order.status)} capitalize w-fit`}>{order.status}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              void loadTicketOrderDetails(order.id);
                              setOrderDetailsInput(String(order.id));
                            }}
                            disabled={ticketOrderDetailsLoading}
                          >
                            View Detail
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setConfirmOrderId(String(order.id));
                              setConfirmPaymentRef(order.payment_reference || '');
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Use for Confirm
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleCancelTicketOrder(order.id)}
                            disabled={ticketOrderActionLoadingId === order.id}
                          >
                            {ticketOrderActionLoadingId === order.id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-1" />
                            )}
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="rounded-lg border p-4 space-y-3">
                  <p className="font-semibold">GET /api/tickets/orders/{'{orderId}'}</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      value={orderDetailsInput}
                      onChange={(event) => setOrderDetailsInput(event.target.value)}
                      placeholder="Enter order ID"
                    />
                    <Button onClick={handleFetchOrderDetailsByInput} disabled={ticketOrderDetailsLoading}>
                      {ticketOrderDetailsLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Load Detail
                    </Button>
                  </div>
                  {ticketOrderDetails && (
                    <div className="rounded-md border p-3 text-sm space-y-1">
                      <p><span className="font-semibold">Order:</span> #{ticketOrderDetails.id}</p>
                      <p><span className="font-semibold">Status:</span> {ticketOrderDetails.status}</p>
                      <p><span className="font-semibold">Quantity:</span> {ticketOrderDetails.quantity}</p>
                      <p><span className="font-semibold">Total:</span> ${Number(ticketOrderDetails.total_amount).toFixed(2)}</p>
                      <p><span className="font-semibold">Payment Ref:</span> {ticketOrderDetails.payment_reference || '-'}</p>
                    </div>
                  )}
                </div>

                <div className="rounded-lg border p-4 space-y-3">
                  <p className="font-semibold">POST /api/tickets/orders/{'{orderId}'}/confirm-payment</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="confirm-order-id">Order ID</Label>
                      <Input
                        id="confirm-order-id"
                        value={confirmOrderId}
                        onChange={(event) => setConfirmOrderId(event.target.value)}
                        placeholder="e.g. 120"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="confirm-payment-ref">Payment Reference</Label>
                      <Input
                        id="confirm-payment-ref"
                        value={confirmPaymentRef}
                        onChange={(event) => setConfirmPaymentRef(event.target.value)}
                        placeholder="Optional payment ref"
                      />
                    </div>
                  </div>
                  <Button onClick={handleConfirmTicketPayment} disabled={confirmingPayment || !confirmOrderId.trim()}>
                    {confirmingPayment ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                    Confirm Payment
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="purchase" className="space-y-4">
                <p className="font-semibold">POST /api/tickets/purchase</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="purchase-ticket-type">Ticket Type</Label>
                    <select
                      id="purchase-ticket-type"
                      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                      value={selectedPurchaseTicketTypeId ?? ''}
                      onChange={(event) => setSelectedPurchaseTicketTypeId(Number(event.target.value))}
                    >
                      <option value="" disabled>
                        Select ticket type
                      </option>
                      {ticketTypes.map((ticketType) => (
                        <option key={ticketType.id} value={ticketType.id}>
                          {ticketType.name} - ${Number(ticketType.price).toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="purchase-quantity">Quantity</Label>
                    <Input
                      id="purchase-quantity"
                      type="number"
                      min={1}
                      value={purchaseQuantity}
                      onChange={(event) => setPurchaseQuantity(Math.max(1, Number(event.target.value || 1)))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="purchase-payment-method">Payment Method</Label>
                    <Input
                      id="purchase-payment-method"
                      value={purchasePaymentMethod}
                      onChange={(event) => setPurchasePaymentMethod(event.target.value)}
                      placeholder="mobile_money, card, bank_transfer..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="purchase-guest-email">Guest Email</Label>
                    <Input
                      id="purchase-guest-email"
                      type="email"
                      value={purchaseGuestEmail}
                      onChange={(event) => setPurchaseGuestEmail(event.target.value)}
                      placeholder="buyer@example.com"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Label htmlFor="purchase-guest-phone">Guest Phone (Optional)</Label>
                    <Input
                      id="purchase-guest-phone"
                      value={purchaseGuestPhone}
                      onChange={(event) => setPurchaseGuestPhone(event.target.value)}
                      placeholder="+255 743 871 360"
                    />
                  </div>
                </div>
                <Button
                  onClick={handlePurchaseTickets}
                  disabled={purchasingTickets || ticketTypes.length === 0 || !selectedPurchaseTicketTypeId}
                >
                  {purchasingTickets ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Purchase Ticket
                </Button>
                {ticketTypes.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    Create at least one ticket type before purchasing tickets.
                  </p>
                )}
              </TabsContent>

              <TabsContent value="lookup" className="space-y-4">
                <p className="font-semibold">GET /api/tickets/payment/{'{paymentRef}'}</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    value={paymentReferenceLookup}
                    onChange={(event) => setPaymentReferenceLookup(event.target.value)}
                    placeholder="Enter payment reference"
                  />
                  <Button onClick={handleLookupOrderByPaymentRef} disabled={paymentReferenceLoading || !paymentReferenceLookup.trim()}>
                    {paymentReferenceLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search
                  </Button>
                </div>
                {paymentReferenceOrder && (
                  <div className="rounded-md border p-3 text-sm space-y-1">
                    <p><span className="font-semibold">Order:</span> #{paymentReferenceOrder.id}</p>
                    <p><span className="font-semibold">Event ID:</span> {paymentReferenceOrder.event_id}</p>
                    <p><span className="font-semibold">Status:</span> {paymentReferenceOrder.status}</p>
                    <p><span className="font-semibold">Amount:</span> ${Number(paymentReferenceOrder.total_amount).toFixed(2)}</p>
                    <p><span className="font-semibold">Payment Ref:</span> {paymentReferenceOrder.payment_reference || '-'}</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>

      {!isTicketsOnly ? (
        <>
          {/* Event View Dialog */}
          <EventView
            isOpen={!!viewingEvent}
            onClose={() => setViewingEvent(null)}
            event={viewingEvent}
          />

          {/* Event Form Dialog */}
          <EventForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
            event={editingEvent}
          />
        </>
      ) : null}
    </div>
  );
};

export default EventsManagement;
