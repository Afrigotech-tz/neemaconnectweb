import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, TrendingUp, Users, Download, Gift, Wallet, CreditCard, ArrowUpRight, Loader2 } from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { formatTZS, formatTZShort } from '@/lib/currency';

interface DonationStats {
  total: number;
  totalAmount: number;
  thisMonth: number;
  thisMonthAmount: number;
}

const DonationsManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [donationStats, setDonationStats] = useState<DonationStats>({
    total: 0,
    totalAmount: 0,
    thisMonth: 0,
    thisMonthAmount: 0
  });

  // Mock data for recent donations (in real app, fetch from API)
  const [recentDonations, setRecentDonations] = useState([
    { id: 1, donor: 'John Smith', amount: 250000, date: '2024-03-15', type: 'One-time', purpose: 'General Fund', status: 'Completed' },
    { id: 2, donor: 'Anonymous', amount: 100000, date: '2024-03-14', type: 'Monthly', purpose: 'Youth Ministry', status: 'Completed' },
    { id: 3, donor: 'Mary Johnson', amount: 500000, date: '2024-03-13', type: 'One-time', purpose: 'Building Fund', status: 'Pending' },
    { id: 4, donor: 'David Wilson', amount: 75000, date: '2024-03-12', type: 'Weekly', purpose: 'Music Ministry', status: 'Completed' }
  ]);

  useEffect(() => {
    const fetchDonationStats = async () => {
      setLoading(true);
      try {
        const stats = await dashboardService.getAdminStats();
        setDonationStats({
          total: stats.donations.total,
          totalAmount: stats.donations.totalAmount,
          thisMonth: stats.donations.thisMonth,
          thisMonthAmount: stats.donations.thisMonthAmount
        });
      } catch (error) {
        console.error('Error fetching donation stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonationStats();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return 'badge-success';
      case 'Pending': return 'badge-warning';
      case 'Failed': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-orange-500 to-secondary p-6 text-white shadow-xl">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Donations Management</h1>
              <p className="text-white/80">Track and manage donations and donors</p>
            </div>
          </div>
          <Button className="btn btn-secondary gap-2 shadow-lg">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-base-content">{formatTZShort(donationStats.totalAmount)}</p>
                <p className="text-sm text-base-content/60 mt-1">Total Donations</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-base-content">{donationStats.total}</p>
                <p className="text-sm text-base-content/60 mt-1">Active Donors</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-base-content">{formatTZShort(donationStats.thisMonthAmount)}</p>
                <p className="text-sm text-base-content/60 mt-1">This Month</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-orange-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-orange-500">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                </div>
                <p className="text-3xl font-bold text-base-content">{donationStats.thisMonth}</p>
                <p className="text-sm text-base-content/60 mt-1">Donations This Month</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Donation Categories & Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
              <Gift className="h-5 w-5 text-green-500" />
              Donation Categories
            </h2>
            <p className="text-base-content/60 mb-6">Distribution by purpose</p>
            <div className="space-y-5">
              {[
                { name: 'General Fund', amount: 12450000, percentage: 51, color: 'bg-blue-500' },
                { name: 'Building Fund', amount: 6200000, percentage: 25, color: 'bg-purple-500' },
                { name: 'Youth Ministry', amount: 3100000, percentage: 13, color: 'bg-green-500' },
                { name: 'Music Ministry', amount: 2830000, percentage: 11, color: 'bg-orange-500' }
              ].map((category, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-base-content">{category.name}</span>
                    <span className="text-base-content/60">{formatTZS(category.amount)}</span>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-3 overflow-hidden">
                    <div className={`${category.color} h-full rounded-full transition-all duration-500`} style={{ width: `${category.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Types */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <div className="p-6">
            <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-purple-500" />
              Donation Types
            </h2>
            <p className="text-base-content/60 mb-6">Frequency breakdown</p>
            <div className="space-y-4">
              {[
                { type: 'One-time', count: 89, amount: 15670000, icon: CreditCard, color: 'bg-blue-50 text-blue-500' },
                { type: 'Monthly', count: 45, amount: 6750000, icon: ArrowUpRight, color: 'bg-purple-50 text-purple-500' },
                { type: 'Weekly', count: 22, amount: 2160000, icon: TrendingUp, color: 'bg-green-50 text-green-500' }
              ].map((type, index) => {
                const Icon = type.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-base-200 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${type.color}`}>
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
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Donations */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-primary to-orange-500"></div>
        <div className="p-6">
          <h2 className="text-xl font-bold text-base-content flex items-center gap-2 mb-2">
            <Heart className="h-5 w-5 text-error" />
            Recent Donations
          </h2>
          <p className="text-base-content/60 mb-6">Latest donation transactions</p>
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-base-200 rounded-xl hover:border-primary/20 hover:shadow-md transition-all duration-200 gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-error/10 rounded-xl">
                    <Heart className="h-6 w-6 text-error" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base-content">{donation.donor}</h3>
                      <span className={`badge badge-lg ${getStatusBadge(donation.status)}`}>{donation.status}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/60">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{formatTZS(donation.amount)}</span>
                      <span className="flex items-center gap-1"><ArrowUpRight className="h-3 w-3" />{donation.type}</span>
                      <span className="flex items-center gap-1"><Gift className="h-3 w-3" />{donation.purpose}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-base-content">{formatTZS(donation.amount)}</p>
                  <p className="text-sm text-base-content/50">{donation.date}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="btn btn-outline w-full">
              View All Donations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationsManagement;

