import React from 'react';
import { Button } from "@/components/ui/button";
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
      color: 'text-info'
    },
    {
      title: 'Downloads',
      value: '156',
      change: '+12%',
      period: 'This month',
      icon: Download,
      color: 'text-success'
    },
    {
      title: 'Scheduled Reports',
      value: '8',
      change: '+2',
      period: 'Active',
      icon: Calendar,
      color: 'text-secondary'
    },
    {
      title: 'Report Views',
      value: '1.2K',
      change: '+18%',
      period: 'This month',
      icon: Eye,
      color: 'text-warning'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ready': return 'badge-success';
      case 'Generating': return 'badge-warning';
      case 'Error': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Financial': return 'badge-info';
      case 'Analytics': return 'badge-secondary';
      case 'Events': return 'badge-success';
      case 'Content': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="space-y-6" data-theme="neemadmin">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-primary" />
            Reports & Analytics
          </h1>
          <p className="text-base-content/60 mt-2">
            Generate, view, and manage comprehensive reports and analytics
          </p>
        </div>
        <Button className="btn btn-primary">
          <FileText className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-sm font-medium text-base-content/70">{stat.title}</h2>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-base-content">{stat.value}</p>
                  <div className="flex items-center text-xs text-base-content/50">
                    <span className="text-success font-medium">{stat.change}</span>
                    <span className="ml-1">{stat.period}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-lg text-base-content">
              <Users className="h-5 w-5 text-info" />
              User Metrics
            </h2>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Total Users</span>
                <span className="font-medium text-base-content">1,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Active This Month</span>
                <span className="font-medium text-base-content">892</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">New Registrations</span>
                <span className="font-medium text-base-content">23</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Retention Rate</span>
                <span className="font-medium text-success">85%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-lg text-base-content">
              <DollarSign className="h-5 w-5 text-success" />
              Financial Overview
            </h2>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Total Donations</span>
                <span className="font-medium text-base-content">$24,580</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Monthly Recurring</span>
                <span className="font-medium text-base-content">$6,750</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Average Donation</span>
                <span className="font-medium text-base-content">$157</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Growth Rate</span>
                <span className="font-medium text-success">+12%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title flex items-center gap-2 text-lg text-base-content">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Content Performance
            </h2>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Blog Views</span>
                <span className="font-medium text-base-content">12.4K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Music Downloads</span>
                <span className="font-medium text-base-content">3.2K</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Event Registrations</span>
                <span className="font-medium text-base-content">456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-base-content/70">Engagement Rate</span>
                <span className="font-medium text-success">78%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Reports */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl text-base-content">Available Reports</h2>
          <p className="text-base-content/60">Generate and download comprehensive reports</p>
          <div className="divider"></div>
          <div className="space-y-4">
            {availableReports.map((report) => (
              <div key={report.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-base-300 rounded-lg hover:bg-base-200 transition-colors gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-medium text-base-content">{report.name}</h3>
                    <span className={`badge ${getStatusBadge(report.status)}`}>
                      {report.status}
                    </span>
                    <span className={`badge badge-outline ${getCategoryBadge(report.category)}`}>
                      {report.category}
                    </span>
                  </div>
                  <p className="text-sm text-base-content/60 mb-2">{report.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-base-content/50">
                    <span>Last generated: {report.lastGenerated}</span>
                    <span>Frequency: {report.frequency}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="btn btn-outline btn-sm" disabled={report.status !== 'Ready'}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="btn btn-outline btn-sm" disabled={report.status !== 'Ready'}>
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Schedule */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-xl text-base-content">Scheduled Reports</h2>
          <p className="text-base-content/60">Automated report generation schedule</p>
          <div className="divider"></div>
          <div className="space-y-3">
            {[
              { name: 'Weekly User Activity', nextRun: '2024-03-18', status: 'Active' },
              { name: 'Monthly Financial Summary', nextRun: '2024-04-01', status: 'Active' },
              { name: 'Quarterly Performance Review', nextRun: '2024-06-01', status: 'Active' }
            ].map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-base-300 rounded-lg">
                <div>
                  <p className="font-medium text-base-content">{schedule.name}</p>
                  <p className="text-sm text-base-content/60">Next run: {schedule.nextRun}</p>
                </div>
                <span className="badge badge-success">{schedule.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsManagement;

