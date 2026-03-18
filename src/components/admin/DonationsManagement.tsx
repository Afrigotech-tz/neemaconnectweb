import React, { useEffect, useMemo, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Heart,
  DollarSign,
  TrendingUp,
  Users,
  Gift,
  Wallet,
  CreditCard,
  ArrowUpRight,
  Loader2,
  Trash2,
  Save,
  Search,
  RefreshCw,
  Filter,
} from 'lucide-react';
import { formatTZS, formatTZShort } from '@/lib/currency';
import { donationService } from '@/services/donationService';
import { Donation, DonationCategory, DonationStatistics } from '@/types/donationTypes';
import { useToast } from '@/hooks/use-toast';

interface DonationStats {
  total: number;
  totalAmount: number;
  thisMonth: number;
  thisMonthAmount: number;
}

type DonationListMode = 'all' | 'user' | 'campaign';

interface DonationListMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const defaultMeta: DonationListMeta = {
  current_page: 1,
  last_page: 1,
  per_page: 0,
  total: 0,
};

const DonationsManagement: React.FC = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [workingDonationId, setWorkingDonationId] = useState<number | null>(null);

  const [categories, setCategories] = useState<DonationCategory[]>([]);
  const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
  const [donationStatusMap, setDonationStatusMap] = useState<Record<number, string>>({});

  const [donationStats, setDonationStats] = useState<DonationStats>({
    total: 0,
    totalAmount: 0,
    thisMonth: 0,
    thisMonthAmount: 0,
  });

  const [listMeta, setListMeta] = useState<DonationListMeta>(defaultMeta);
  const [listMode, setListMode] = useState<DonationListMode>('all');
  const [listPageInput, setListPageInput] = useState('1');
  const [userFilterId, setUserFilterId] = useState('');
  const [campaignFilterId, setCampaignFilterId] = useState('');

  const [donationLookupId, setDonationLookupId] = useState('');
  const [donationDetail, setDonationDetail] = useState<Donation | null>(null);

  const [categoryLookupId, setCategoryLookupId] = useState('');
  const [categoryDetail, setCategoryDetail] = useState<DonationCategory | null>(null);

  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [creatingDonation, setCreatingDonation] = useState(false);
  const [newDonation, setNewDonation] = useState({
    campaign_id: '',
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    currency: 'TZS',
    payment_method: 'M-Pesa',
    transaction_reference: `ADM-${Date.now()}`,
    message: '',
  });

  const normalizeCategories = (payload: unknown): DonationCategory[] => {
    if (Array.isArray(payload)) return payload as DonationCategory[];
    if (payload && typeof payload === 'object' && 'data' in (payload as { data?: unknown })) {
      const inner = (payload as { data?: unknown }).data;
      if (Array.isArray(inner)) return inner as DonationCategory[];
    }
    return [];
  };

  const normalizeDonationsWithMeta = (
    payload: unknown
  ): { donations: Donation[]; meta: DonationListMeta } => {
    if (Array.isArray(payload)) {
      return {
        donations: payload as Donation[],
        meta: {
          ...defaultMeta,
          total: payload.length,
          per_page: payload.length,
          last_page: 1,
        },
      };
    }

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const directData = record.data;

      if (Array.isArray(directData)) {
        const donations = directData as Donation[];
        const perPage = Number(record.per_page ?? donations.length) || donations.length;
        const total = Number(record.total ?? donations.length) || donations.length;
        const current = Number(record.current_page ?? 1) || 1;
        const last = Number(record.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))) || 1;
        return {
          donations,
          meta: {
            current_page: current,
            last_page: Math.max(last, 1),
            per_page: perPage,
            total,
          },
        };
      }

      if (directData && typeof directData === 'object') {
        const inner = directData as Record<string, unknown>;
        if (Array.isArray(inner.data)) {
          const donations = inner.data as Donation[];
          const perPage = Number(inner.per_page ?? donations.length) || donations.length;
          const total = Number(inner.total ?? donations.length) || donations.length;
          const current = Number(inner.current_page ?? 1) || 1;
          const last = Number(inner.last_page ?? Math.max(1, Math.ceil(total / Math.max(perPage, 1)))) || 1;
          return {
            donations,
            meta: {
              current_page: current,
              last_page: Math.max(last, 1),
              per_page: perPage,
              total,
            },
          };
        }
      }
    }

    return { donations: [], meta: defaultMeta };
  };

  const applyDonationList = (payload: unknown) => {
    const { donations, meta } = normalizeDonationsWithMeta(payload);
    setRecentDonations(donations);
    setListMeta(meta);

    const nextStatusMap: Record<number, string> = {};
    donations.forEach((donation) => {
      nextStatusMap[donation.id] = (donation.status || 'pending').toLowerCase();
    });
    setDonationStatusMap(nextStatusMap);
  };

  const refreshStatistics = async () => {
    const response = await donationService.getStatistics();
    if (!response.success || !response.data) {
      setDonationStats({ total: 0, totalAmount: 0, thisMonth: 0, thisMonthAmount: 0 });
      return;
    }

    const statsData = response.data as DonationStatistics;
    setDonationStats({
      total: Number(statsData.total_donors ?? statsData.total ?? 0),
      totalAmount: Number(statsData.total_donations ?? statsData.total_amount ?? 0),
      thisMonth: Number(statsData.today_donations ?? statsData.this_month_donations ?? 0),
      thisMonthAmount: Number(statsData.monthly_donations ?? statsData.this_month_amount ?? 0),
    });
  };

  const refreshCategories = async () => {
    const response = await donationService.getCategories();
    if (response.success) {
      setCategories(normalizeCategories(response.data));
    } else {
      setCategories([]);
    }
  };

  const loadAllDonations = async (page = 1) => {
    setListLoading(true);
    setListMode('all');
    try {
      const response = await donationService.getDonations(page);
      if (response.success) {
        applyDonationList(response.data);
      } else {
        setRecentDonations([]);
        setListMeta(defaultMeta);
        toast({ title: 'Load failed', description: response.message || 'Failed to load donations.', variant: 'destructive' });
      }
    } finally {
      setListLoading(false);
    }
  };

  const loadDonationsByUser = async (userId: number, page = 1) => {
    setListLoading(true);
    setListMode('user');
    try {
      const response = await donationService.getDonationsByUser(userId, page);
      if (response.success) {
        applyDonationList(response.data);
      } else {
        setRecentDonations([]);
        setListMeta(defaultMeta);
        toast({ title: 'Load failed', description: response.message || 'Failed to load user donations.', variant: 'destructive' });
      }
    } finally {
      setListLoading(false);
    }
  };

  const loadDonationsByCampaign = async (campaignId: number) => {
    setListLoading(true);
    setListMode('campaign');
    try {
      const response = await donationService.getDonationsByCampaign(campaignId);
      if (response.success) {
        applyDonationList(response.data);
      } else {
        setRecentDonations([]);
        setListMeta(defaultMeta);
        toast({ title: 'Load failed', description: response.message || 'Failed to load campaign donations.', variant: 'destructive' });
      }
    } finally {
      setListLoading(false);
    }
  };

  const refreshCurrentDonationList = async () => {
    const currentPage = Number(listPageInput) || 1;
    if (listMode === 'user') {
      const userId = Number(userFilterId);
      if (Number.isFinite(userId) && userId > 0) {
        await loadDonationsByUser(userId, currentPage);
      } else {
        await loadAllDonations(currentPage);
      }
      return;
    }

    if (listMode === 'campaign') {
      const campaignId = Number(campaignFilterId);
      if (Number.isFinite(campaignId) && campaignId > 0) {
        await loadDonationsByCampaign(campaignId);
      } else {
        await loadAllDonations(currentPage);
      }
      return;
    }

    await loadAllDonations(currentPage);
  };

  const refreshAllDonationData = async () => {
    setLoading(true);
    await Promise.all([refreshStatistics(), refreshCategories(), refreshCurrentDonationList()]);
    setLoading(false);
  };

  useEffect(() => {
    void refreshAllDonationData();
  }, []);

  const resetCategoryEditor = () => {
    setCategoryName('');
    setEditingCategoryId(null);
  };

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) return;

    setSavingCategory(true);
    try {
      const response = editingCategoryId
        ? await donationService.updateCategory(editingCategoryId, { name: trimmedName })
        : await donationService.createCategory({ name: trimmedName });

      if (response.success) {
        toast({
          title: editingCategoryId ? 'Category updated' : 'Category created',
          description: response.message || 'Donation category saved successfully.',
        });
        resetCategoryEditor();
        await refreshCategories();
      } else {
        toast({
          title: 'Save failed',
          description: response.message || 'Unable to save donation category.',
          variant: 'destructive',
        });
      }
    } finally {
      setSavingCategory(false);
    }
  };

  const handleEditCategory = async (category: DonationCategory) => {
    setSavingCategory(true);
    try {
      const response = await donationService.getCategory(category.id);
      if (response.success && response.data) {
        setEditingCategoryId(response.data.id);
        setCategoryName(response.data.name);
      } else {
        setEditingCategoryId(category.id);
        setCategoryName(category.name);
      }
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Delete this donation category?')) return;

    setSavingCategory(true);
    try {
      const response = await donationService.deleteCategory(categoryId);
      if (response.success) {
        toast({
          title: 'Category deleted',
          description: response.message || 'Donation category deleted successfully.',
        });
        if (editingCategoryId === categoryId) {
          resetCategoryEditor();
        }
        await refreshCategories();
      } else {
        toast({
          title: 'Delete failed',
          description: response.message || 'Unable to delete donation category.',
          variant: 'destructive',
        });
      }
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDonationStatusChange = async (donationId: number) => {
    const nextStatus = donationStatusMap[donationId];
    if (!nextStatus) return;

    setWorkingDonationId(donationId);
    try {
      const response = await donationService.updateDonationStatus(donationId, { status: nextStatus });
      if (response.success) {
        toast({
          title: 'Donation updated',
          description: response.message || 'Donation status updated successfully.',
        });
        await refreshCurrentDonationList();
        await refreshStatistics();
      } else {
        toast({
          title: 'Update failed',
          description: response.message || 'Unable to update donation status.',
          variant: 'destructive',
        });
      }
    } finally {
      setWorkingDonationId(null);
    }
  };

  const handleDeleteDonation = async (donationId: number) => {
    if (!confirm('Delete this donation record?')) return;

    setWorkingDonationId(donationId);
    try {
      const response = await donationService.deleteDonation(donationId);
      if (response.success) {
        toast({
          title: 'Donation deleted',
          description: response.message || 'Donation deleted successfully.',
        });
        await refreshCurrentDonationList();
        await refreshStatistics();
      } else {
        toast({
          title: 'Delete failed',
          description: response.message || 'Unable to delete donation record.',
          variant: 'destructive',
        });
      }
    } finally {
      setWorkingDonationId(null);
    }
  };

  const handleLookupDonation = async () => {
    const donationId = Number(donationLookupId);
    if (!Number.isFinite(donationId) || donationId <= 0) {
      toast({ title: 'Invalid donation ID', description: 'Enter a valid donation ID.', variant: 'destructive' });
      return;
    }

    const response = await donationService.getDonation(donationId);
    if (response.success && response.data) {
      setDonationDetail(response.data);
    } else {
      setDonationDetail(null);
      toast({ title: 'Not found', description: response.message || 'Donation was not found.', variant: 'destructive' });
    }
  };

  const handleLookupCategory = async () => {
    const categoryId = Number(categoryLookupId);
    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      toast({ title: 'Invalid category ID', description: 'Enter a valid category ID.', variant: 'destructive' });
      return;
    }

    const response = await donationService.getCategory(categoryId);
    if (response.success && response.data) {
      setCategoryDetail(response.data);
    } else {
      setCategoryDetail(null);
      toast({ title: 'Not found', description: response.message || 'Category was not found.', variant: 'destructive' });
    }
  };

  const handleLoadAllClick = async () => {
    const page = Math.max(1, Number(listPageInput) || 1);
    setListPageInput(String(page));
    await loadAllDonations(page);
  };

  const handleLoadUserClick = async () => {
    const userId = Number(userFilterId);
    if (!Number.isFinite(userId) || userId <= 0) {
      toast({ title: 'Invalid user ID', description: 'Enter a valid user ID.', variant: 'destructive' });
      return;
    }

    const page = Math.max(1, Number(listPageInput) || 1);
    setListPageInput(String(page));
    await loadDonationsByUser(userId, page);
  };

  const handleLoadCampaignClick = async () => {
    const campaignId = Number(campaignFilterId);
    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      toast({ title: 'Invalid campaign ID', description: 'Enter a valid campaign ID.', variant: 'destructive' });
      return;
    }

    await loadDonationsByCampaign(campaignId);
  };

  const handleCreateDonation = async () => {
    const campaignId = Number(newDonation.campaign_id);
    const amount = Number(newDonation.amount);

    if (!Number.isFinite(campaignId) || campaignId <= 0) {
      toast({ title: 'Campaign required', description: 'Select a donation campaign.', variant: 'destructive' });
      return;
    }
    if (!newDonation.donor_name.trim()) {
      toast({ title: 'Donor name required', description: 'Enter donor name.', variant: 'destructive' });
      return;
    }
    if (!newDonation.donor_email.trim()) {
      toast({ title: 'Donor email required', description: 'Enter donor email.', variant: 'destructive' });
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      toast({ title: 'Amount required', description: 'Enter a valid donation amount.', variant: 'destructive' });
      return;
    }
    if (!newDonation.transaction_reference.trim()) {
      toast({ title: 'Reference required', description: 'Enter transaction reference.', variant: 'destructive' });
      return;
    }

    setCreatingDonation(true);
    try {
      const response = await donationService.createDonation({
        campaign_id: campaignId,
        donor_name: newDonation.donor_name.trim(),
        donor_email: newDonation.donor_email.trim(),
        donor_phone: newDonation.donor_phone.trim() || undefined,
        amount,
        currency: newDonation.currency.trim() || 'TZS',
        payment_method: newDonation.payment_method.trim() || undefined,
        transaction_reference: newDonation.transaction_reference.trim(),
        message: newDonation.message.trim() || undefined,
      });

      if (response.success) {
        toast({
          title: 'Donation created',
          description: response.message || 'Donation was created successfully.',
        });
        setNewDonation((prev) => ({
          ...prev,
          donor_name: '',
          donor_email: '',
          donor_phone: '',
          amount: '',
          payment_method: 'M-Pesa',
          transaction_reference: `ADM-${Date.now()}`,
          message: '',
        }));
        await refreshStatistics();
        await refreshCurrentDonationList();
      } else {
        toast({
          title: 'Create failed',
          description: response.message || 'Failed to create donation.',
          variant: 'destructive',
        });
      }
    } finally {
      setCreatingDonation(false);
    }
  };

  const handleNextPage = async () => {
    const nextPage = Math.min(listMeta.last_page, listMeta.current_page + 1);
    if (nextPage === listMeta.current_page) return;
    setListPageInput(String(nextPage));

    if (listMode === 'user') {
      const userId = Number(userFilterId);
      if (Number.isFinite(userId) && userId > 0) {
        await loadDonationsByUser(userId, nextPage);
      }
      return;
    }

    await loadAllDonations(nextPage);
  };

  const handlePrevPage = async () => {
    const prevPage = Math.max(1, listMeta.current_page - 1);
    if (prevPage === listMeta.current_page) return;
    setListPageInput(String(prevPage));

    if (listMode === 'user') {
      const userId = Number(userFilterId);
      if (Number.isFinite(userId) && userId > 0) {
        await loadDonationsByUser(userId, prevPage);
      }
      return;
    }

    await loadAllDonations(prevPage);
  };

  const donationTypeBreakdown = useMemo(() => {
    const map = new Map<string, { type: string; count: number; amount: number }>();
    for (const donation of recentDonations) {
      const type = donation.payment_method || 'Unknown';
      const current = map.get(type) || { type, count: 0, amount: 0 };
      current.count += 1;
      current.amount += Number(donation.amount || 0);
      map.set(type, current);
    }
    return Array.from(map.values()).sort((a, b) => b.amount - a.amount);
  }, [recentDonations]);

  const categoryBreakdown = useMemo(() => {
    const categoryAmountMap = new Map<number, { amount: number; count: number }>();
    recentDonations.forEach((donation) => {
      const campaignId = Number(donation.campaign_id);
      const current = categoryAmountMap.get(campaignId) || { amount: 0, count: 0 };
      current.amount += Number(donation.amount || 0);
      current.count += 1;
      categoryAmountMap.set(campaignId, current);
    });

    return categories.map((category) => {
      const totals = categoryAmountMap.get(category.id) || { amount: 0, count: 0 };
      return {
        id: category.id,
        name: category.name,
        amount: totals.amount,
        count: totals.count,
      };
    });
  }, [categories, recentDonations]);

  const totalCategoryAmount = useMemo(
    () => Math.max(1, categoryBreakdown.reduce((sum, item) => sum + item.amount, 0)),
    [categoryBreakdown]
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'badge-success';
      case 'pending':
        return 'badge-warning';
      case 'failed':
        return 'badge-error';
      case 'refunded':
        return 'badge-info';
      default:
        return 'badge-ghost';
    }
  };

  const listModeLabel = listMode === 'all'
    ? 'All donations'
    : listMode === 'user'
      ? `User donations (User ID ${userFilterId || '-'})`
      : `Campaign donations (Campaign ID ${campaignFilterId || '-'})`;

  return (
    <div className="space-y-6" data-theme="neemadmin">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Donations Management</h1>
              <p className="text-white/80">All Donations endpoints are wired from backend documentation.</p>
            </div>
          </div>
          <Button className="btn btn-secondary gap-2 shadow-lg" onClick={() => void refreshAllDonationData()}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-base-content">{formatTZShort(donationStats.totalAmount)}</p>
              <p className="text-sm text-base-content/60 mt-1">Total Donation Amount</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-base-content">{donationStats.total}</p>
              <p className="text-sm text-base-content/60 mt-1">Total Donors</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-base-content">{formatTZShort(donationStats.thisMonthAmount)}</p>
              <p className="text-sm text-base-content/60 mt-1">Monthly Donations</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                  <Heart className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold text-base-content">{donationStats.thisMonth}</p>
              <p className="text-sm text-base-content/60 mt-1">Today Donations</p>
            </div>
          </>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
        <h2 className="text-xl font-bold text-base-content flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Donation Query Tools
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-3 rounded-xl border border-base-200 p-4">
            <Label className="font-semibold">List Donations</Label>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="donation-page">Page</Label>
                <Input
                  id="donation-page"
                  value={listPageInput}
                  onChange={(event) => setListPageInput(event.target.value)}
                  placeholder="1"
                />
              </div>
              <Button onClick={() => void handleLoadAllClick()} disabled={listLoading}>Load All</Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="donation-user-id">User ID</Label>
                <Input
                  id="donation-user-id"
                  value={userFilterId}
                  onChange={(event) => setUserFilterId(event.target.value)}
                  placeholder="e.g. 25"
                />
              </div>
              <Button variant="secondary" onClick={() => void handleLoadUserClick()} disabled={listLoading}>
                Load User
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="donation-campaign-id">Campaign ID</Label>
                <Input
                  id="donation-campaign-id"
                  value={campaignFilterId}
                  onChange={(event) => setCampaignFilterId(event.target.value)}
                  placeholder="e.g. 3"
                />
              </div>
              <Button variant="secondary" onClick={() => void handleLoadCampaignClick()} disabled={listLoading}>
                Load Campaign
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-base-200 p-4">
            <Label className="font-semibold">Lookup Details</Label>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="lookup-donation-id">Donation ID</Label>
                <Input
                  id="lookup-donation-id"
                  value={donationLookupId}
                  onChange={(event) => setDonationLookupId(event.target.value)}
                  placeholder="e.g. 1001"
                />
              </div>
              <Button variant="outline" onClick={() => void handleLookupDonation()}>
                <Search className="h-4 w-4 mr-1" />
                Find Donation
              </Button>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="lookup-category-id">Category ID</Label>
                <Input
                  id="lookup-category-id"
                  value={categoryLookupId}
                  onChange={(event) => setCategoryLookupId(event.target.value)}
                  placeholder="e.g. 2"
                />
              </div>
              <Button variant="outline" onClick={() => void handleLookupCategory()}>
                <Search className="h-4 w-4 mr-1" />
                Find Category
              </Button>
            </div>

            {donationDetail && (
              <div className="rounded-md bg-base-100 p-3 text-sm">
                <p className="font-semibold">Donation #{donationDetail.id}</p>
                <p>Donor: {donationDetail.donor_name} ({donationDetail.donor_email})</p>
                <p>Amount: {formatTZS(donationDetail.amount)} | Status: {donationDetail.status || 'pending'}</p>
              </div>
            )}

            {categoryDetail && (
              <div className="rounded-md bg-base-100 p-3 text-sm">
                <p className="font-semibold">Category #{categoryDetail.id}</p>
                <p>Name: {categoryDetail.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-base-200 p-4 space-y-3">
          <Label className="font-semibold">Create Donation</Label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="new-donation-campaign">Campaign</Label>
              <Input
                id="new-donation-campaign"
                type="number"
                min={1}
                value={newDonation.campaign_id}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, campaign_id: event.target.value }))}
                placeholder="e.g. 3"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-amount">Amount</Label>
              <Input
                id="new-donation-amount"
                type="number"
                min={0}
                value={newDonation.amount}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, amount: event.target.value }))}
                placeholder="e.g. 50000"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-name">Donor Name</Label>
              <Input
                id="new-donation-name"
                value={newDonation.donor_name}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, donor_name: event.target.value }))}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-email">Donor Email</Label>
              <Input
                id="new-donation-email"
                type="email"
                value={newDonation.donor_email}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, donor_email: event.target.value }))}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-phone">Donor Phone</Label>
              <Input
                id="new-donation-phone"
                value={newDonation.donor_phone}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, donor_phone: event.target.value }))}
                placeholder="+255712345678"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-method">Payment Method</Label>
              <Input
                id="new-donation-method"
                value={newDonation.payment_method}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, payment_method: event.target.value }))}
                placeholder="M-Pesa"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-currency">Currency</Label>
              <Input
                id="new-donation-currency"
                value={newDonation.currency}
                onChange={(event) => setNewDonation((prev) => ({ ...prev, currency: event.target.value }))}
                placeholder="TZS"
              />
            </div>

            <div>
              <Label htmlFor="new-donation-ref">Transaction Reference</Label>
              <Input
                id="new-donation-ref"
                value={newDonation.transaction_reference}
                onChange={(event) =>
                  setNewDonation((prev) => ({ ...prev, transaction_reference: event.target.value }))
                }
                placeholder="TXN123456789"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="new-donation-message">Message</Label>
            <Input
              id="new-donation-message"
              value={newDonation.message}
              onChange={(event) => setNewDonation((prev) => ({ ...prev, message: event.target.value }))}
              placeholder="Optional message"
            />
          </div>

          <Button onClick={() => void handleCreateDonation()} disabled={creatingDonation}>
            {creatingDonation ? 'Creating...' : 'Create Donation'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-green-500" />
              Donation Categories
            </h2>
            <p className="text-base-content/60 mb-6">Distribution by category for currently loaded list</p>
            <div className="space-y-5">
              <div className="rounded-xl border border-base-200 p-4 space-y-3">
                <Label htmlFor="donation-category-name">
                  {editingCategoryId ? 'Rename category' : 'New category'}
                </Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="donation-category-name"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Category name"
                  />
                  <Button
                    onClick={() => void handleSaveCategory()}
                    disabled={savingCategory || !categoryName.trim()}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {editingCategoryId ? 'Update' : 'Create'}
                  </Button>
                </div>
                {editingCategoryId && (
                  <Button variant="outline" onClick={resetCategoryEditor} disabled={savingCategory}>
                    Cancel Edit
                  </Button>
                )}
              </div>

              {categoryBreakdown.length > 0 ? (
                categoryBreakdown.map((category) => {
                  const widthPercentage = Math.max(6, Math.round((category.amount / totalCategoryAmount) * 100));
                  return (
                    <div key={category.id}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                        <div>
                          <span className="font-medium text-base-content">{category.name}</span>
                          <span className="ml-2 text-base-content/60">ID: {category.id}</span>
                          <span className="ml-2 text-base-content/60">({category.count} donations)</span>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => void handleEditCategory({ id: category.id, name: category.name })} disabled={savingCategory}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => void handleDeleteCategory(category.id)}
                            disabled={savingCategory}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                      <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${widthPercentage}%` }}
                        />
                      </div>
                      <p className="text-xs text-base-content/60 mt-1">{formatTZS(category.amount)}</p>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-base-content/60">No donation categories available.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-purple-500" />
              Donation Types
            </h2>
            <p className="text-base-content/60 mb-6">Breakdown by payment method</p>
            <div className="space-y-4">
              {donationTypeBreakdown.length > 0 ? donationTypeBreakdown.map((type, index) => {
                const iconSets = [CreditCard, ArrowUpRight, TrendingUp];
                const colorSets = ['bg-blue-50 text-blue-500', 'bg-purple-50 text-purple-500', 'bg-green-50 text-green-500'];
                const Icon = iconSets[index % iconSets.length];
                const color = colorSets[index % colorSets.length];
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-base-content">{type.type}</p>
                        <p className="text-sm text-base-content/50">{type.count} donations</p>
                      </div>
                    </div>
                    <p className="font-bold text-lg text-base-content">{formatTZS(type.amount)}</p>
                  </div>
                );
              }) : (
                <p className="text-sm text-base-content/60">No donation activity available.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-orange-500"></div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-error" />
            Donations List
          </h2>
          <p className="text-base-content/60 mb-2">{listModeLabel}</p>
          <p className="text-sm text-base-content/50 mb-6">
            Total: {listMeta.total} | Page: {listMeta.current_page}/{listMeta.last_page}
          </p>

          {listLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentDonations.length > 0 ? (
            <div className="space-y-4">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-base-200 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-200 gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-error/10 rounded-xl">
                      <Heart className="h-6 w-6 text-error" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-base-content">{donation.donor_name || 'Anonymous'}</h3>
                        <span className={`badge badge-lg ${getStatusBadge(donation.status || 'pending')}`}>
                          {donation.status || 'pending'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                        <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatTZS(donation.amount)}</span>
                        <span className="flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{donation.payment_method || 'N/A'}</span>
                        <span className="flex items-center gap-1"><Gift className="h-3 w-3" />Campaign #{donation.campaign_id}</span>
                        <span>ID #{donation.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-base-content">{formatTZS(donation.amount)}</p>
                    <p className="text-sm text-base-content/50">{new Date(donation.created_at).toLocaleDateString()}</p>
                    <div className="mt-3 flex flex-col sm:items-end gap-2">
                      <div className="w-full sm:w-[160px]">
                        <Select
                          value={donationStatusMap[donation.id] || (donation.status || 'pending').toLowerCase()}
                          onValueChange={(value) =>
                            setDonationStatusMap((prev) => ({ ...prev, [donation.id]: value }))
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="refunded">Refunded</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void handleDonationStatusChange(donation.id)}
                          disabled={workingDonationId === donation.id}
                        >
                          Save
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => void handleDeleteDonation(donation.id)}
                          disabled={workingDonationId === donation.id}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-base-content/60">No donations found for current query.</p>
          )}

          {(listMode === 'all' || listMode === 'user') && listMeta.last_page > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <Button variant="outline" onClick={() => void handlePrevPage()} disabled={listMeta.current_page <= 1 || listLoading}>
                Previous
              </Button>
              <span className="text-sm text-base-content/60">
                Page {listMeta.current_page} of {listMeta.last_page}
              </span>
              <Button variant="outline" onClick={() => void handleNextPage()} disabled={listMeta.current_page >= listMeta.last_page || listLoading}>
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationsManagement;
