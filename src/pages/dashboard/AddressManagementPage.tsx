import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAddress } from "@/hooks/useAddress";
import AddressForm from "@/components/shop/AddressForm";
import { Address, CreateAddressData, UpdateAddressData } from "@/types/addressTypes";

const AddressManagementPage = () => {
  const { addresses, loading, fetchAddresses, createAddress, updateAddress, deleteAddress } = useAddress();
  const [showDialog, setShowDialog] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleCreate = async (data: CreateAddressData) => {
    const success = await createAddress(data);
    if (success) {
      setShowDialog(false);
    }
  };

  const handleUpdate = async (data: CreateAddressData) => {
    if (!editingAddress) return;
    const success = await updateAddress(editingAddress.id, data as UpdateAddressData);
    if (success) {
      setEditingAddress(null);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteAddress(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Addresses</h1>
          <p className="text-muted-foreground">Manage your saved shipping addresses.</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <AddressForm
              onSubmit={handleCreate}
              onCancel={() => setShowDialog(false)}
              loading={loading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading && addresses.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      )}

      {!loading && addresses.length === 0 && (
        <div className="text-center py-16">
          <MapPin className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No addresses saved</h3>
          <p className="text-muted-foreground mb-6">Add your first address for faster checkout.</p>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">{address.label}</span>
                  {address.is_default && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <Dialog open={editingAddress?.id === address.id} onOpenChange={(open) => {
                    if (!open) setEditingAddress(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditingAddress(address)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Address</DialogTitle>
                      </DialogHeader>
                      <AddressForm
                        defaultValues={{
                          label: address.label,
                          street: address.street,
                          city: address.city,
                          state_province: address.state_province,
                          postal_code: address.postal_code,
                          country: address.country,
                          is_default: address.is_default,
                        }}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditingAddress(null)}
                        loading={loading}
                      />
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Address</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this address? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(address.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state_province} {address.postal_code}
              </p>
              <p className="text-sm text-muted-foreground">{address.country}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManagementPage;
