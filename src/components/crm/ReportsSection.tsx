
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, FileText, Users, Home, Calendar, TrendingUp } from "lucide-react";
import { exportToCSV, generateLeadReport, generatePropertyReport, generateFollowUpReport } from '@/utils/exportUtils';
import { useAuth } from '@/contexts/AuthContext';

const ReportsSection = () => {
  const { hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedReport, setSelectedReport] = useState('leads');

  // Mock data - replace with real data from your API
  const leadStatusData = [
    { name: 'New', value: 45, color: '#3B82F6' },
    { name: 'Contacted', value: 78, color: '#10B981' },
    { name: 'Visited', value: 32, color: '#F59E0B' },
    { name: 'Converted', value: 23, color: '#8B5CF6' },
    { name: 'Dropped', value: 15, color: '#EF4444' }
  ];

  const agentPerformanceData = [
    { name: 'Sarah Johnson', leads: 85, converted: 23, revenue: 2300000 },
    { name: 'Mike Wilson', leads: 72, converted: 18, revenue: 1800000 },
    { name: 'Emily Davis', leads: 65, converted: 15, revenue: 1500000 },
    { name: 'James Brown', leads: 58, converted: 12, revenue: 1200000 }
  ];

  const weeklyTrendsData = [
    { week: 'Week 1', leads: 28, conversions: 6, followUps: 45 },
    { week: 'Week 2', leads: 35, conversions: 8, followUps: 52 },
    { week: 'Week 3', leads: 42, conversions: 12, followUps: 38 },
    { week: 'Week 4', leads: 38, conversions: 9, followUps: 41 }
  ];

  const propertyTypeData = [
    { name: 'Apartment', value: 120, color: '#3B82F6' },
    { name: 'Villa', value: 85, color: '#10B981' },
    { name: 'Commercial', value: 45, color: '#F59E0B' },
    { name: 'Plot', value: 32, color: '#8B5CF6' }
  ];

  // Mock data for exports
  const mockLeads = [
    { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', status: 'new', source: 'Website', score: 85, assignedAgent: 'Sarah Johnson', createdAt: '2024-01-15', lastContact: '2024-01-15', budget: '50-75 Lakhs', requirements: '3 BHK Apartment' }
  ];

  const mockProperties = [
    { id: '1', address: '123 Main St', city: 'Mumbai', type: 'apartment', price: 5000000, beds: 3, baths: 2, sqft: 1200, status: 'available', agent: 'Sarah Johnson', listedDate: '2024-01-01' }
  ];

  const mockFollowUps = [
    { id: '1', title: 'Call John Doe', contact: 'John Doe', property: '123 Main St', type: 'call', priority: 'high', status: 'pending', dueDate: '2024-01-20', dueTime: '10:00', assignedAgent: 'Sarah Johnson', createdAt: '2024-01-15' }
  ];

  const handleExportReport = (type: string) => {
    if (!hasPermission('export_reports')) {
      alert('You do not have permission to export reports');
      return;
    }

    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'leads':
        data = generateLeadReport(mockLeads);
        filename = `leads_report_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'properties':
        data = generatePropertyReport(mockProperties);
        filename = `properties_report_${new Date().toISOString().split('T')[0]}`;
        break;
      case 'followups':
        data = generateFollowUpReport(mockFollowUps);
        filename = `followups_report_${new Date().toISOString().split('T')[0]}`;
        break;
      default:
        return;
    }

    exportToCSV(data, filename);
  };

  const totalLeads = leadStatusData.reduce((sum, item) => sum + item.value, 0);
  const conversionRate = Math.round((leadStatusData.find(item => item.name === 'Converted')?.value || 0) / totalLeads * 100);
  const totalRevenue = agentPerformanceData.reduce((sum, agent) => sum + agent.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights into your business performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
            <p className="text-xs text-green-600">+12% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <p className="text-xs text-green-600">+2.5% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 10000000).toFixed(1)}Cr</div>
            <p className="text-xs text-green-600">+8.2% from last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentPerformanceData.length}</div>
            <p className="text-xs text-blue-600">All agents active</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
            <CardDescription>Current lead pipeline breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={leadStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {leadStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Property Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Property Type Distribution</CardTitle>
            <CardDescription>Properties by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={propertyTypeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Lead conversion by agent</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="converted" fill="#10B981" name="Converted Leads" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
            <CardDescription>Lead and conversion trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#3B82F6" name="New Leads" />
                <Line type="monotone" dataKey="conversions" stroke="#10B981" name="Conversions" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Export Reports */}
      {hasPermission('export_reports') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Export Reports
            </CardTitle>
            <CardDescription>Download detailed reports in CSV format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => handleExportReport('leads')}
                className="flex items-center justify-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Leads Report
              </Button>
              <Button 
                onClick={() => handleExportReport('properties')}
                className="flex items-center justify-center"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Properties Report
              </Button>
              <Button 
                onClick={() => handleExportReport('followups')}
                className="flex items-center justify-center"
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Follow-ups Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReportsSection;
