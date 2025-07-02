
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Calendar, BarChart3, Building, UserCog } from "lucide-react";
import Header from '@/components/layout/Header';
import LeadsManagement from '@/components/crm/LeadsManagement';
import PropertiesManagement from '@/components/crm/PropertiesManagement';
import FollowUpSystem from '@/components/crm/FollowUpSystem';
import ReportsSection from '@/components/crm/ReportsSection';
import ProjectManagement from '@/components/projects/ProjectManagement';
import UserManagement from '@/components/users/UserManagement';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { hasPermission } = useAuth();
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
      title: "Projects",
      value: "12",
      description: "Active projects",
      icon: Building,
      change: "+2 new this month"
    },
    {
      title: "Follow-ups",
      value: "89",
      description: "Pending this week",
      icon: Calendar,
      change: "-2% from last week"
    }
  ];

  const availableTabs = [
    { id: 'leads', label: 'Leads Management', permission: 'view_leads' },
    { id: 'properties', label: 'Properties', permission: 'view_leads' },
    { id: 'projects', label: 'Projects', permission: 'create_projects' },
    { id: 'followups', label: 'Follow-ups', permission: 'view_leads' },
    { id: 'users', label: 'Users', permission: 'manage_users' },
    { id: 'reports', label: 'Reports', permission: 'view_reports' }
  ].filter(tab => hasPermission(tab.permission));

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Real Estate CRM</h1>
            <p className="text-gray-600 mt-2">Manage your leads, properties, projects, and follow-ups efficiently</p>
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
            <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
              {availableTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="leads" className="space-y-6">
              <LeadsManagement />
            </TabsContent>

            <TabsContent value="properties" className="space-y-6">
              <PropertiesManagement />
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <ProjectManagement />
            </TabsContent>

            <TabsContent value="followups" className="space-y-6">
              <FollowUpSystem />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <UserManagement />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ReportsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
