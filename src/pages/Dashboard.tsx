
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Calendar, BarChart3 } from "lucide-react";
import LeadsManagement from '@/components/crm/LeadsManagement';
import PropertiesManagement from '@/components/crm/PropertiesManagement';
import FollowUpSystem from '@/components/crm/FollowUpSystem';
import ReportsSection from '@/components/crm/ReportsSection';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('leads');

  const stats = [
    {
      title: "Total Leads",
      value: "1,234",
      description: "Active leads in pipeline",
      icon: Users,
      change: "+12% from last month"
    },
    {
      title: "Properties",
      value: "456",
      description: "Listed properties",
      icon: Home,
      change: "+8% from last month"
    },
    {
      title: "Follow-ups",
      value: "89",
      description: "Pending this week",
      icon: Calendar,
      change: "-2% from last week"
    },
    {
      title: "Conversion Rate",
      value: "24%",
      description: "Leads to sales",
      icon: BarChart3,
      change: "+5% from last month"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Real Estate CRM</h1>
          <p className="text-gray-600 mt-2">Manage your leads, properties, and follow-ups efficiently</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main CRM Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="leads">Leads Management</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="followups">Follow-ups</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-6">
            <LeadsManagement />
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesManagement />
          </TabsContent>

          <TabsContent value="followups" className="space-y-6">
            <FollowUpSystem />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportsSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
