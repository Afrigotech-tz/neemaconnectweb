import { MapPin, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Address } from "@/types/addressTypes";

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const AddressSelector: React.FC<AddressSelectorProps> = ({ addresses, selectedId, onSelect }) => {
  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>No saved addresses. Please add one to continue.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {addresses.map((address) => (
        <Card
          key={address.id}
          className={`p-4 cursor-pointer transition-all duration-200 ${
            selectedId === address.id
              ? 'ring-2 ring-primary bg-primary/5'
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelect(address.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{address.label}</span>
                {address.is_default && (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{address.street}</p>
              <p className="text-sm text-muted-foreground">
                {address.city}, {address.state_province} {address.postal_code}
              </p>
              <p className="text-sm text-muted-foreground">{address.country}</p>
            </div>
            {selectedId === address.id && (
              <Check className="h-5 w-5 text-primary shrink-0" />
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default AddressSelector;
