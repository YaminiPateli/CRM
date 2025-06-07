
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Mail, Shield, Calendar } from "lucide-react";
import CreateUserForm from './CreateUserForm';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
  assignedLeads: number;
  convertedLeads: number;
}

const UserManagement = () => {
  const { hasPermission } = useAuth();
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Admin',
      email: 'admin@demo.com',
      role: 'admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00Z',
      createdAt: '2023-06-01T00:00:00Z',
      assignedLeads: 0,
      convertedLeads: 0
    },
    {
      id: '2',
      name: 'Sarah Manager',
      email: 'manager@demo.com',
      role: 'manager',
      status: 'active',
      lastLogin: '2024-01-14T15:45:00Z',
      createdAt: '2023-08-15T00:00:00Z',
      assignedLeads: 45,
      convertedLeads: 12
    },
    {
      id: '3',
      name: 'Mike Agent',
      email: 'agent@demo.com',
      role: 'agent',
      status: 'active',
      lastLogin: '2024-01-15T09:20:00Z',
      createdAt: '2023-10-01T00:00:00Z',
      assignedLeads: 78,
      convertedLeads: 23
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'agent': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleUserCreated = (newUser: Omit<User, 'id' | 'lastLogin' | 'createdAt' | 'assignedLeads' | 'convertedLeads'>) => {
    const user: User = {
      ...newUser,
      id: Date.now().toString(),
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      assignedLeads: 0,
      convertedLeads: 0
    };
    setUsers([...users, user]);
    setIsCreateDialogOpen(false);
  };

  if (!hasPermission('manage_users')) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage users.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        {hasPermission('create_users') && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <CreateUserForm 
                onClose={() => setIsCreateDialogOpen(false)}
                onUserCreated={handleUserCreated}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
          </select>
        </CardContent>
      </Card>

      {/* Users List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {user.email}
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <Badge className={getRoleColor(user.role)}>
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Assigned Leads:</span>
                  <span className="font-medium">{user.assignedLeads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Converted:</span>
                  <span className="font-medium text-green-600">{user.convertedLeads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Conversion Rate:</span>
                  <span className="font-medium">
                    {user.assignedLeads > 0 ? Math.round((user.convertedLeads / user.assignedLeads) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
