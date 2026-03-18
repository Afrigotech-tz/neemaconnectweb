import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CreditCard, MapPin, ClipboardCheck, ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useCart } from "@/hooks/useCart";
import { useAddress } from "@/hooks/useAddress";
import { paymentService } from "@/services/paymentService/paymentService";
import { PaymentMethod } from "@/types/paymentTypes";
import AddressForm from "@/components/shop/AddressForm";
import AddressSelector from "@/components/shop/AddressSelector";
import OrderSummary from "@/components/shop/OrderSummary";
import { useToast } from "@/hooks/use-toast";
import { CreateAddressData } from "@/types/addressTypes";

type CheckoutStep = 'address' | 'payment' | 'review';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { addresses, loading: addressLoading, fetchAddresses, createAddress } = useAddress();
  const { toast } = useToast();

  const [step, setStep] = useState<CheckoutStep>('address');
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<number | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  useEffect(() => {
    fetchCart();
    fetchAddresses();
    loadPaymentMethods();
  }, []);

  // Auto-select default address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = addresses.find(a => a.is_default);
      setSelectedAddressId(defaultAddr?.id || addresses[0].id);
    }
  }, [addresses]);

  const loadPaymentMethods = async () => {
    const response = await paymentService.getPaymentMethods();
    if (response.success && response.data) {
      setPaymentMethods(response.data);
      if (response.data.length > 0) {
        setSelectedPaymentMethodId(response.data[0].id);
      }
    }
  };

  const handleAddAddress = async (data: CreateAddressData) => {
    const success = await createAddress(data);
    if (success) {
      setShowAddressDialog(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId || !selectedPaymentMethodId) return;

    setProcessing(true);
    try {
      const response = await paymentService.processPayment({
        address_id: selectedAddressId,
        payment_method_id: selectedPaymentMethodId,
        notes: notes || undefined,
      });

      if (response.success && response.data?.order?.id) {
        toast({ title: 'Order Placed', description: 'Your order has been placed successfully!' });
        await fetchCart();
        navigate(`/dashboard/orders/${response.data.order.id}`);
      } else {
        toast({
          title: 'Error',
          description: response.message || 'Failed to place order',
          variant: 'destructive',
        });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to process payment', variant: 'destructive' });
    } finally {
      setProcessing(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="pt-16 min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <ClipboardCheck className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add items to your cart before checking out.</p>
          <Link to="/shop">
            <Button>Go to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const steps: { key: CheckoutStep; label: string; icon: React.ElementType }[] = [
    { key: 'address', label: 'Address', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: ClipboardCheck },
  ];
  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <div key={s.key} className="flex items-center gap-2">
                {idx > 0 && <div className={`h-px w-12 ${isCompleted ? 'bg-primary' : 'bg-border'}`} />}
                <button
                  onClick={() => idx <= currentStepIndex && setStep(s.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    isActive ? 'bg-primary text-primary-foreground' :
                    isCompleted ? 'bg-primary/10 text-primary' :
                    'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{s.label}</span>
                </button>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step: Address */}
            {step === 'address' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Shipping Address</h2>
                  <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        onSubmit={handleAddAddress}
                        onCancel={() => setShowAddressDialog(false)}
                        loading={addressLoading}
                      />
                    </DialogContent>
                  </Dialog>
                </div>

                <AddressSelector
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={setSelectedAddressId}
                />

                <div className="mt-6 flex justify-end">
                  <Button
                    onClick={() => setStep('payment')}
                    disabled={!selectedAddressId}
                  >
                    Continue to Payment
                  </Button>
                </div>
              </Card>
            )}

            {/* Step: Payment */}
            {step === 'payment' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Method</h2>

                {paymentMethods.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No payment methods available. Please try again later.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {paymentMethods.filter(m => m.is_active).map((method) => (
                      <Card
                        key={method.id}
                        className={`p-4 cursor-pointer transition-all ${
                          selectedPaymentMethodId === method.id
                            ? 'ring-2 ring-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPaymentMethodId(method.id)}
                      >
                        <div className="flex items-center gap-3">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.type}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('address')}>
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('review')}
                    disabled={!selectedPaymentMethodId}
                  >
                    Review Order
                  </Button>
                </div>
              </Card>
            )}

            {/* Step: Review */}
            {step === 'review' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Review Order</h2>

                {/* Selected Address */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Shipping To</h3>
                  {(() => {
                    const addr = addresses.find(a => a.id === selectedAddressId);
                    if (!addr) return null;
                    return (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="font-medium">{addr.label}</p>
                        <p className="text-sm text-muted-foreground">{addr.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {addr.city}, {addr.state_province} {addr.postal_code}
                        </p>
                        <p className="text-sm text-muted-foreground">{addr.country}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Selected Payment */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment Method</h3>
                  {(() => {
                    const method = paymentMethods.find(m => m.id === selectedPaymentMethodId);
                    if (!method) return null;
                    return (
                      <div className="bg-muted/50 rounded-lg p-3 flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <p className="font-medium">{method.name}</p>
                      </div>
                    );
                  })()}
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Notes (Optional)</h3>
                  <Textarea
                    placeholder="Any special instructions for your order..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="outline" onClick={() => setStep('payment')}>
                    Back
                  </Button>
                  <Button
                    className="bg-gradient-primary hover:shadow-glow"
                    onClick={handlePlaceOrder}
                    disabled={processing}
                  >
                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {processing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="p-6 sticky top-24">
              <OrderSummary items={cart.items} total={cart.total} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
