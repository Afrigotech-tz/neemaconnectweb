import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CreateAddressData } from "@/types/addressTypes";

interface AddressFormProps {
  defaultValues?: Partial<CreateAddressData>;
  onSubmit: (data: CreateAddressData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

const AddressForm: React.FC<AddressFormProps> = ({ defaultValues, onSubmit, onCancel, loading }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<CreateAddressData>({
    defaultValues: {
      label: '',
      street: '',
      city: '',
      state_province: '',
      postal_code: '',
      country: '',
      is_default: false,
      ...defaultValues,
    },
  });

  const isDefault = watch('is_default');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          placeholder="e.g. Home, Office"
          {...register('label', { required: 'Label is required' })}
        />
        {errors.label && <p className="text-sm text-red-500 mt-1">{errors.label.message}</p>}
      </div>

      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          placeholder="Street address"
          {...register('street', { required: 'Street is required' })}
        />
        {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="City"
            {...register('city', { required: 'City is required' })}
          />
          {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="state_province">State/Province</Label>
          <Input
            id="state_province"
            placeholder="State/Province"
            {...register('state_province', { required: 'State/Province is required' })}
          />
          {errors.state_province && <p className="text-sm text-red-500 mt-1">{errors.state_province.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="postal_code">Postal Code</Label>
          <Input
            id="postal_code"
            placeholder="Postal code"
            {...register('postal_code', { required: 'Postal code is required' })}
          />
          {errors.postal_code && <p className="text-sm text-red-500 mt-1">{errors.postal_code.message}</p>}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            placeholder="Country"
            {...register('country', { required: 'Country is required' })}
          />
          {errors.country && <p className="text-sm text-red-500 mt-1">{errors.country.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_default"
          checked={isDefault}
          onCheckedChange={(checked) => setValue('is_default', !!checked)}
        />
        <Label htmlFor="is_default" className="cursor-pointer">Set as default address</Label>
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Address'}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
