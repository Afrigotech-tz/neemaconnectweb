import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, DollarSign, TrendingUp, Users, Download, Filter } from 'lucide-react';

const DonationsManagement: React.FC = () => {
  // Mock data for donations
  const recentDonations = [
    {
      id: 1,
      donor: 'John Smith',
      amount: 250,
      date: '2024-03-15',
      type: 'One-time',
      purpose: 'General Fund',
      status: 'Completed'
    },
    {
      id: 2,
      donor: 'Anonymous',
      amount: 100,
      date: '2024-03-14',
      type: 'Monthly',
      purpose: 'Youth Ministry',
      status: 'Completed'
    },
    {
      id: 3,
      donor: 'Mary Johnson',
      amount: 500,
      date: '2024-03-13',
      type: 'One-time',
      purpose: 'Building Fund',
      status: 'Pending'
    },
    {
      id: 4,
      donor: 'David Wilson',
      amount: 75,
      date: '2024-03-12',
      type: 'Weekly',
      purpose: 'Music Ministry',
      status: 'Completed'
    }
  ];

  const donationStats = [
    {
      title: 'Total Donations',
      value: '$24,580',
      change: '+12%',
      period: 'This month',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Active Donors',
      value: '156',
      change: '+8%',
      period: 'This month',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Avg. Donation',
      value: '$157',
      change: '+5%',
      period: 'This month',
      icon: TrendingUp,
      color: 'text-purple-600'
    },
    {
      title: 'Recurring Donors',
      value: '89',
      change: '+15%',
      period: 'This month',
      icon: Heart,
      color: 'text-red-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-600" />
            Donations Management
          </h1>
          <p className="text-gray-600 mt-2">
            Track and manage donations, donors, and fundraising campaigns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {donationStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span>
                  <span className="ml-1">{stat.period}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Donation Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Donation Categories</CardTitle>
            <CardDescription>Distribution by purpose</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'General Fund', amount: '$12,450', percentage: 51 },
                { name: 'Building Fund', amount: '$6,200', percentage: 25 },
                { name: 'Youth Ministry', amount: '$3,100', percentage: 13 },
                { name: 'Music Ministry', amount: '$2,830', percentage: 11 }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">{category.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Types</CardTitle>
            <CardDescription>Frequency breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'One-time', count: 89, amount: '$15,670' },
                { type: 'Monthly', count: 45, amount: '$6,750' },
                { type: 'Weekly', count: 22, amount: '$2,160' }
              ].map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{type.type}</p>
                    <p className="text-sm text-muted-foreground">{type.count} donations</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{type.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
          <CardDescription>
            Latest donation transactions and donor activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDonations.map((donation) => (
              <div key={donation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium">{donation.donor}</h3>
                    <Badge className={getStatusColor(donation.status)}>
                      {donation.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <span>${donation.amount}</span>
                    <span>{donation.date}</span>
                    <span>{donation.type}</span>
                    <span>{donation.purpose}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${donation.amount}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" className="w-full">
              View All Donations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationsManagement;
