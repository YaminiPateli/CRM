
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Download, Calendar } from "lucide-react";

const ReportsSection = () => {
  const [dateRange, setDateRange] = useState('last30days');

  // Mock data for charts
  const leadsData = [
    { month: 'Jan', leads: 45, converted: 12 },
    { month: 'Feb', leads: 52, converted: 15 },
    { month: 'Mar', leads: 38, converted: 8 },
    { month: 'Apr', leads: 61, converted: 18 },
    { month: 'May', leads: 55, converted: 16 },
    { month: 'Jun', leads: 67, converted: 22 }
  ];

  const sourceData = [
    { name: 'Website Form', value: 35, color: '#8884d8' },
    { name: 'Referral', value: 25, color: '#82ca9d' },
    { name: 'Social Media', value: 20, color: '#ffc658' },
    { name: 'Cold Call', value: 15, color: '#ff7300' },
    { name: 'Walk-in', value: 5, color: '#00ff00' }
  ];

  const propertyData = [
    { type: 'House', sold: 15, listed: 25 },
    { type: 'Condo', sold: 8, listed: 18 },
    { type: 'Townhouse', sold: 5, listed: 12 },
    { type: 'Apartment', sold: 3, listed: 8 }
  ];

  const agentPerformance = [
    { agent: 'Sarah Johnson', leads: 45, properties: 12, conversion: 26.7 },
    { agent: 'Mike Wilson', leads: 38, properties: 8, conversion: 21.1 },
    { agent: 'Lisa Chen', leads: 42, properties: 15, conversion: 35.7 },
    { agent: 'David Brown', leads: 35, properties: 9, conversion: 25.7 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 450000 },
    { month: 'Feb', revenue: 520000 },
    { month: 'Mar', revenue: 380000 },
    { month: 'Apr', revenue: 610000 },
    { month: 'May', revenue: 550000 },
    { month: 'Jun', revenue: 670000 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Reports & Analytics
              </CardTitle>
              <CardDescription>
                Comprehensive insights into your real estate business performance
              </CardDescription>
            </div>
            <div className="flex gap-3">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last7days">Last 7 days</SelectItem>
                  <SelectItem value="last30days">Last 30 days</SelectItem>
                  <SelectItem value="last90days">Last 90 days</SelectItem>
                  <SelectItem value="lastyear">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Leads</p>
                        <p className="text-3xl font-bold">1,234</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +12% vs last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                        <p className="text-3xl font-bold">24.5%</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +3.2% vs last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Properties Sold</p>
                        <p className="text-3xl font-bold">89</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +8% vs last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Revenue</p>
                        <p className="text-3xl font-bold">$2.1M</p>
                        <p className="text-sm text-green-600 flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          +15% vs last month
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Lead Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={sourceData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sourceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                        <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Generation & Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={leadsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="leads" fill="#8884d8" name="Total Leads" />
                      <Bar dataKey="converted" fill="#82ca9d" name="Converted" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Property Performance by Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={propertyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="listed" fill="#8884d8" name="Listed" />
                      <Bar dataKey="sold" fill="#82ca9d" name="Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="agents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Agent</th>
                          <th className="text-right p-3">Leads</th>
                          <th className="text-right p-3">Properties Sold</th>
                          <th className="text-right p-3">Conversion Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {agentPerformance.map((agent, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{agent.agent}</td>
                            <td className="p-3 text-right">{agent.leads}</td>
                            <td className="p-3 text-right">{agent.properties}</td>
                            <td className="p-3 text-right">{agent.conversion}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                      <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
