import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, Edit, Image as ImageIcon, X, Upload } from 'lucide-react';
import { eventSchema, EventFormData } from '@/lib/validations/event';
import { eventService } from '@/services/eventService/eventService';
import { Event, EventCreate, EventUpdate } from '@/types/eventTypes';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  event?: Event; // Optional event for editing
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, onSuccess, event }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!event;

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      type: 'concert',
      date: '',
      location: '',
      description: '',
      venue: '',
      city: '',
      country: '',
      capacity: 100,
      ticket_price: 0,
      ticket_url: '',
      image: '',
      is_featured: false,
      is_public: true,
      status: 'upcoming',
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (event && isOpen) {
      form.reset({
        title: event.title,
        type: event.type,
        date: event.date,
        location: event.location,
        description: event.description,
        venue: event.venue,
        city: event.city,
        country: event.country,
        capacity: event.capacity,
        ticket_price: event.ticket_price,
        ticket_url: event.ticket_url || '',
        image: event.image || '',
        is_featured: event.is_featured,
        is_public: event.is_public,
        status: event.status,
      });
      setImagePreview(event.image || null);
    } else if (!event && isOpen) {
      // Reset to defaults when creating new event
      form.reset({
        title: '',
        type: 'concert',
        date: '',
        location: '',
        description: '',
        venue: '',
        city: '',
        country: '',
        capacity: 100,
        ticket_price: 0,
        ticket_url: '',
        image: '',
        is_featured: false,
        is_public: true,
        status: 'upcoming',
      });
      setImagePreview(null);
    }
  }, [event, isOpen, form]);

  const onSubmit = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (isEditing && event) {
        // Update existing event
        const updateData: EventUpdate = {
          title: data.title,
          type: data.type,
          date: data.date,
          location: data.location,
          description: data.description,
          venue: data.venue,
          city: data.city,
          country: data.country,
          capacity: data.capacity,
          ticket_price: data.ticket_price,
          ticket_url: data.ticket_url || undefined,
          image: data.image || undefined,
          is_featured: data.is_featured,
          is_public: data.is_public,
          status: data.status,
        };
        await eventService.updateEvent(event.id, updateData);
      } else {
        // Create new event
        const createData: EventCreate = {
          title: data.title,
          type: data.type,
          date: data.date,
          location: data.location,
          description: data.description,
          venue: data.venue,
          city: data.city,
          country: data.country,
          capacity: data.capacity,
          ticket_price: data.ticket_price,
          ticket_url: data.ticket_url || undefined,
          image: data.image || undefined,
          is_featured: data.is_featured,
          is_public: data.is_public,
          status: data.status,
        };
        await eventService.createEvent(createData);
      }

      onSuccess();
      onClose();
      form.reset();
    } catch (err: any) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} event:`, err);
      setError(err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setError(null);
    setImagePreview(null);
    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue('image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue('image', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditing ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update the event details below.' : 'Fill in the details below to create a new event. All fields marked with * are required.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Event Image</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {imagePreview ? (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                            <img
                              src={imagePreview}
                              alt="Event preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <div
                            className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Click to upload an image
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, GIF up to 5MB
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Event Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter event title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="concert">Concert</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="live_recording">Live Recording</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="venue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Venue *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., National Stadium" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dar es Salaam" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tanzania" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Price *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="50.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ticket_url"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ticket URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://example.com/tickets"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address or location description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the event..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2 space-y-3">
                <FormField
                  control={form.control}
                  name="is_featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Event</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Mark this event as featured to highlight it prominently
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_public"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Public Event</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Make this event visible to the public
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    {isEditing ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                    {isEditing ? 'Update Event' : 'Create Event'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventForm;
