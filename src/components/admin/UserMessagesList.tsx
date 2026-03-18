import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { contactService } from '@/services/contactService/contactService';
import { UserMessage, UserMessageStatus } from '@/types/contactTypes';
import { useToast } from '@/hooks/use-toast';
import { Eye, Loader2, Mail, Plus, RefreshCw, Search, Trash2, X } from 'lucide-react';

const statusOptions: UserMessageStatus[] = ['pending', 'read', 'replied', 'closed'];
type MessageView = 'all' | 'inbox' | 'sent';

const statusLabel = (status: UserMessageStatus): string => {
  if (status === 'pending') return 'Pending';
  if (status === 'read') return 'Read';
  if (status === 'replied') return 'Replied';
  return 'Closed';
};

const getStatusVariant = (status: UserMessageStatus): 'default' | 'secondary' | 'destructive' | 'outline' => {
  if (status === 'pending') return 'secondary';
  if (status === 'read') return 'outline';
  if (status === 'replied') return 'default';
  return 'destructive';
};

const getMessageView = (message: UserMessage): MessageView => {
  if (message.status === 'replied' || message.status === 'closed') return 'sent';
  return 'inbox';
};

const UserMessagesList: React.FC = () => {
  const { toast } = useToast();

  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [selectedMessage, setSelectedMessage] = useState<UserMessage | null>(null);
  const [loadingMessageDetail, setLoadingMessageDetail] = useState(false);
  const [viewingMessageId, setViewingMessageId] = useState<number | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [activeView, setActiveView] = useState<MessageView>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserMessageStatus>('all');

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const normalizeMessages = (payload: unknown): UserMessage[] => {
    if (Array.isArray(payload)) return payload as UserMessage[];

    if (payload && typeof payload === 'object' && 'data' in (payload as { data?: unknown })) {
      const directData = (payload as { data?: unknown }).data;
      if (Array.isArray(directData)) return directData as UserMessage[];

      if (directData && typeof directData === 'object' && 'data' in (directData as { data?: unknown })) {
        const nestedData = (directData as { data?: unknown }).data;
        if (Array.isArray(nestedData)) return nestedData as UserMessage[];
      }
    }

    return [];
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await contactService.getUserMessages();
      if (response.success) {
        setMessages(normalizeMessages(response.data));
      } else {
        setMessages([]);
        toast({
          title: 'Failed to load messages',
          description: response.message || 'Please try again.',
          variant: 'destructive',
        });
      }
    } catch {
      toast({
        title: 'Failed to load messages',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleStatusChange = async (id: number, status: UserMessageStatus) => {
    setUpdatingId(id);
    try {
      const response = await contactService.updateUserMessage(id, { status });
      if (!response.success) {
        toast({
          title: 'Update failed',
          description: response.message || 'Please try again.',
          variant: 'destructive',
        });
        return;
      }

      const responseStatus = response.data?.status || status;
      const responseUpdatedAt = response.data?.updated_at;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === id
            ? {
                ...message,
                status: responseStatus,
                updated_at: responseUpdatedAt || message.updated_at,
              }
            : message
        )
      );

      setSelectedMessage((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              status: responseStatus,
              updated_at: responseUpdatedAt || prev.updated_at,
            }
          : prev
      );

      toast({
        title: 'Status updated',
        description: 'Message status updated successfully.',
      });
    } catch {
      toast({
        title: 'Update failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleViewMessage = async (id: number) => {
    setIsDetailDialogOpen(true);
    setViewingMessageId(id);
    setLoadingMessageDetail(true);
    try {
      const response = await contactService.getUserMessage(id);
      if (response.success && response.data) {
        setSelectedMessage(response.data);
      } else {
        setSelectedMessage(null);
        setIsDetailDialogOpen(false);
        toast({
          title: 'Message not found',
          description: response.message || 'Unable to load message details.',
          variant: 'destructive',
        });
      }
    } catch {
      setIsDetailDialogOpen(false);
      toast({
        title: 'Load failed',
        description: 'Unable to load message details.',
        variant: 'destructive',
      });
    } finally {
      setLoadingMessageDetail(false);
      setViewingMessageId(null);
    }
  };

  const resetCreateForm = () => {
    setCreateForm({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
  };

  const handleCreateMessage = async () => {
    if (!createForm.first_name.trim() || !createForm.last_name.trim() || !createForm.email.trim()) {
      toast({
        title: 'Missing details',
        description: 'First name, last name, and email are required.',
        variant: 'destructive',
      });
      return;
    }

    if (!createForm.subject.trim() || !createForm.message.trim()) {
      toast({
        title: 'Missing details',
        description: 'Subject and message are required.',
        variant: 'destructive',
      });
      return;
    }

    setCreating(true);
    try {
      const response = await contactService.createUserMessage({
        first_name: createForm.first_name.trim(),
        last_name: createForm.last_name.trim(),
        email: createForm.email.trim(),
        phone: createForm.phone.trim() || undefined,
        subject: createForm.subject.trim(),
        message: createForm.message.trim(),
      });

      if (!response.success) {
        toast({
          title: 'Create failed',
          description: response.message || 'Unable to create message.',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Message sent',
        description: response.message || 'User message created successfully.',
      });
      resetCreateForm();
      setShowCreateForm(false);
      await fetchMessages();
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this message permanently?');
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const response = await contactService.deleteUserMessage(id);
      if (!response.success) {
        toast({
          title: 'Delete failed',
          description: response.message || 'Please try again.',
          variant: 'destructive',
        });
        return;
      }

      setMessages((prev) => prev.filter((message) => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setIsDetailDialogOpen(false);
      }

      toast({
        title: 'Message deleted',
        description: 'The message was deleted successfully.',
      });
    } catch {
      toast({
        title: 'Delete failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const statusCounts = useMemo(
    () =>
      messages.reduce(
        (acc, message) => {
          acc.all += 1;
          acc[message.status] += 1;
          acc[getMessageView(message)] += 1;
          return acc;
        },
        {
          all: 0,
          inbox: 0,
          sent: 0,
          pending: 0,
          read: 0,
          replied: 0,
          closed: 0,
        }
      ),
    [messages]
  );

  const filteredMessages = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return [...messages]
      .sort((a, b) => {
        const timeA = new Date(a.created_at).getTime();
        const timeB = new Date(b.created_at).getTime();
        return timeB - timeA;
      })
      .filter((message) => {
        if (activeView !== 'all' && getMessageView(message) !== activeView) return false;
        if (statusFilter !== 'all' && message.status !== statusFilter) return false;

        if (!normalizedSearch) return true;
        const searchableText = [
          message.first_name,
          message.last_name,
          message.email,
          message.phone || '',
          message.subject,
          message.message,
        ]
          .join(' ')
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      });
  }, [messages, activeView, searchTerm, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeView, searchTerm, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / pageSize));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedMessages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMessages.slice(start, start + pageSize);
  }, [filteredMessages, currentPage]);

  const formatDate = (value: string): string => {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleString();
  };

  const preview = (text: string): string => {
    if (text.length <= 95) return text;
    return `${text.slice(0, 95)}...`;
  };

  const renderMessagesTable = () => (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Subject & Message</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && messages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-10">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No messages found for the current filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedMessages.map((message) => {
                const fullName = `${message.first_name} ${message.last_name}`.trim();
                const selected = selectedMessage?.id === message.id;
                return (
                  <TableRow key={message.id} className={selected ? 'bg-muted/30' : undefined}>
                    <TableCell className="font-medium">{fullName}</TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p>{message.email}</p>
                        <p className="text-xs text-muted-foreground">{message.phone || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="font-medium">{message.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{preview(message.message)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(message.status)}>{statusLabel(message.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(message.created_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Button
                          variant={selected ? 'secondary' : 'outline'}
                          size="sm"
                          onClick={() => void handleViewMessage(message.id)}
                          disabled={loadingMessageDetail && viewingMessageId === message.id}
                        >
                          {loadingMessageDetail && viewingMessageId === message.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Eye className="h-4 w-4 mr-1" />
                          )}
                          View
                        </Button>
                        <select
                          className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                          value={message.status}
                          onChange={(event) => void handleStatusChange(message.id, event.target.value as UserMessageStatus)}
                          disabled={updatingId === message.id}
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {statusLabel(status)}
                            </option>
                          ))}
                        </select>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void handleDelete(message.id)}
                          disabled={deletingId === message.id}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {deletingId === message.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {filteredMessages.length > 0 ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
          <p className="text-muted-foreground">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredMessages.length)} of{' '}
            {filteredMessages.length} messages
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
              Previous
            </Button>
            <span className="text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            CMS User Messages
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={showCreateForm ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setShowCreateForm((prev) => !prev)}
            >
              {showCreateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">{showCreateForm ? 'Close' : 'Send Message'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={fetchMessages} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">All</p>
            <p className="text-xl font-semibold">{statusCounts.all}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-semibold">{statusCounts.pending}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Read</p>
            <p className="text-xl font-semibold">{statusCounts.read}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Replied</p>
            <p className="text-xl font-semibold">{statusCounts.replied}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-xs text-muted-foreground">Closed</p>
            <p className="text-xl font-semibold">{statusCounts.closed}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {showCreateForm ? (
          <div className="rounded-lg border p-4 space-y-3">
            <h3 className="font-semibold">Create User Message (POST /api/user-messages)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="create-message-first-name">First Name</Label>
                <Input
                  id="create-message-first-name"
                  value={createForm.first_name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, first_name: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="create-message-last-name">Last Name</Label>
                <Input
                  id="create-message-last-name"
                  value={createForm.last_name}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, last_name: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="create-message-email">Email</Label>
                <Input
                  id="create-message-email"
                  type="email"
                  value={createForm.email}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="create-message-phone">Phone</Label>
                <Input
                  id="create-message-phone"
                  value={createForm.phone}
                  onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="create-message-subject">Subject</Label>
              <Input
                id="create-message-subject"
                value={createForm.subject}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, subject: event.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="create-message-content">Message</Label>
              <Textarea
                id="create-message-content"
                value={createForm.message}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, message: event.target.value }))}
                className="min-h-[120px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => void handleCreateMessage()} disabled={creating}>
                {creating ? 'Sending...' : 'Send Message'}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  resetCreateForm();
                  setShowCreateForm(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="message-search">Search</Label>
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="message-search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name, email, subject, or message"
                className="pl-9"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="message-status-filter">Status Filter</Label>
            <select
              id="message-status-filter"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as 'all' | UserMessageStatus)}
            >
              <option value="all">All statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as MessageView)}>
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
            <TabsTrigger value="inbox">Inbox ({statusCounts.inbox})</TabsTrigger>
            <TabsTrigger value="sent">Sent ({statusCounts.sent})</TabsTrigger>
          </TabsList>
          <TabsContent value="all">{renderMessagesTable()}</TabsContent>
          <TabsContent value="inbox">{renderMessagesTable()}</TabsContent>
          <TabsContent value="sent">{renderMessagesTable()}</TabsContent>
        </Tabs>

        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Message Detail</DialogTitle>
              <DialogDescription>GET /api/user-messages/{'{id}'}</DialogDescription>
            </DialogHeader>

            {loadingMessageDetail ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading selected message...
              </div>
            ) : selectedMessage ? (
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-semibold">ID:</span> {selectedMessage.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {selectedMessage.first_name} {selectedMessage.last_name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {selectedMessage.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {selectedMessage.phone || '-'}
                </p>
                <p>
                  <span className="font-semibold">Subject:</span> {selectedMessage.subject}
                </p>
                <p className="whitespace-pre-wrap">
                  <span className="font-semibold">Message:</span> {selectedMessage.message}
                </p>
                <p>
                  <span className="font-semibold">Status:</span>{' '}
                  <Badge variant={getStatusVariant(selectedMessage.status)}>{statusLabel(selectedMessage.status)}</Badge>
                </p>
                <p>
                  <span className="font-semibold">Created:</span> {formatDate(selectedMessage.created_at)}
                </p>
                <p>
                  <span className="font-semibold">Updated:</span> {formatDate(selectedMessage.updated_at)}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <select
                    className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                    value={selectedMessage.status}
                    onChange={(event) => void handleStatusChange(selectedMessage.id, event.target.value as UserMessageStatus)}
                    disabled={updatingId === selectedMessage.id}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {statusLabel(status)}
                      </option>
                    ))}
                  </select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void handleViewMessage(selectedMessage.id)}
                    disabled={loadingMessageDetail}
                  >
                    {loadingMessageDetail ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Reload
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => void handleDelete(selectedMessage.id)}
                    disabled={deletingId === selectedMessage.id}
                  >
                    {deletingId === selectedMessage.id ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                    Delete
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Message data not available.</p>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UserMessagesList;
