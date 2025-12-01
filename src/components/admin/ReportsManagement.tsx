import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Calendar, Users, DollarSign, TrendingUp, FileText, Eye } from 'lucide-react';

const ReportsManagement: React.FC = () => {
  // Mock data for reports
  const availableReports = [
    {
      id: 1,
      name: 'Monthly Financial Report',
      description: 'Comprehensive financial overview including donations, expenses, and budget analysis',
      category: 'Financial',
      lastGenerated: '2024-03-15',
      frequency: 'Monthly',
      status: 'Ready'
    },
    {
      id: 2,
      name: 'User Activity Report',
      description: 'User engagement metrics, registration trends, and platform usage statistics',
      category: 'Analytics',
      lastGenerated: '2024-03-14',
      frequency: 'Weekly',
      status: 'Ready'
    },
    {
      id: 3,
      name: 'Event Attendance Report',
      description: 'Event participation rates, attendance trends, and engagement metrics',
      category: 'Events',
      lastGenerated: '2024-03-13',
      frequency: 'After Events',
      status: 'Generating'
    },
    {
      id: 4,
      name: 'Content Performance Report',
      description: 'Blog views, music downloads, and content engagement analytics',
      category: 'Content',
      lastGenerated: '2024-03-12',
      frequency: 'Monthly',
      status: 'Ready'
    }
  ];

  const quickStats = [
    {
      title: 'Total Reports',
      value: '24',
      change: '+3',
      period: 'This month',
      icon: FileText,
      color: 'text-blue-600'
    },
    {
      title: 'Downloads',
      value: '156',
      change: '+12%',
      period: 'This month',
      icon: Download,
      color: 'text-green-600'
    },
    {
      title: 'Scheduled Reports',
      value: '8',
      change: '+2',
      period: 'Active',
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Report Views',
      value: '1.2K',
      change: '+18%',
      period: 'This month',
      icon: Eye,
      color: 'text-orange-600'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Generating': return 'bg-yellow-100 text-yellow-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Financial': return 'bg-blue-100 text-blue-800';
      case 'Analytics': return 'bg-purple-100 text-purple-800';
      case 'Events': return 'bg-green-100 text-green-800';
      case 'Content': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-2">
            Generate, view, and manage comprehensive reports and analytics
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
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

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              User Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Users</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active This Month</span>
                <span className="font-medium">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">New Registrations</span>
                <span className="font-medium">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Retention Rate</span>
                <span className="font-medium text-green-600">85%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Financial Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Total Donations</span>
                <span className="font-medium">$24,580</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Monthly Recurring</span>
                <span className="font-medium">$6,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Average Donation</span>
                <span className="font-medium">$157</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Growth Rate</span>
                <span className="font-medium text-green-600">+12%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Content Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Blog Views</span>
                <span className="font-medium">12.4K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Music Downloads</span>
                <span className="font-medium">3.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Event Registrations</span>
                <span className="font-medium">456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Engagement Rate</span>
                <span className="font-medium text-green-600">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>
            Generate and download comprehensive reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availableReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{report.name}</h3>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                    <Badge variant="outline" className={getCategoryColor(report.category)}>
                      {report.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Last generated: {report.lastGenerated}</span>
                    <span>Frequency: {report.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={report.status !== 'Ready'}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" disabled={report.status !== 'Ready'}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>
            Automated report generation schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Weekly User Activity', nextRun: '2024-03-18', status: 'Active' },
              { name: 'Monthly Financial Summary', nextRun: '2024-04-01', status: 'Active' },
              { name: 'Quarterly Performance Review', nextRun: '2024-06-01', status: 'Active' }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{schedule.name}</p>
                  <p className="text-sm text-muted-foreground">Next run: {schedule.nextRun}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">{schedule.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsManagement;
