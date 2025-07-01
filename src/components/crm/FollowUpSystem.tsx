
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Calendar, Clock, User, AlertTriangle } from "lucide-react";
import CreateFollowUpForm from './CreateFollowUpForm';
import { useToast } from "@/hooks/use-toast";

const FollowUpSystem = () => {
  const [followUps, setFollowUps] = useState([]);
  const [filteredFollowUps, setFilteredFollowUps] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with API calls
  const mockFollowUps = [
    {
      id: 1,
      title: "Follow up with John Smith",
      contact: "John Smith",
      property: "123 Main Street",
      type: "call",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-16",
      dueTime: "10:00 AM",
      description: "Discuss property viewing feedback",
      assignedAgent: "Sarah Johnson",
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      title: "Send property listings to Emily",
      contact: "Emily Davis",
      property: null,
      type: "email",
      priority: "medium",
      status: "completed",
      dueDate: "2024-01-15",
      dueTime: "2:00 PM",
      description: "Send updated listings matching her criteria",
      assignedAgent: "Mike Wilson",
      createdAt: "2024-01-12"
    },
    {
      id: 3,
      title: "Schedule property showing",
      contact: "Michael Brown",
      property: "456 Oak Avenue",
      type: "meeting",
      priority: "high",
      status: "pending",
      dueDate: "2024-01-17",
      dueTime: "3:30 PM",
      description: "Schedule showing for Beverly Hills condo",
      assignedAgent: "Lisa Chen",
      createdAt: "2024-01-13"
    }
  ];

  useEffect(() => {
    setFollowUps(mockFollowUps);
    setFilteredFollowUps(mockFollowUps);
  }, []);

  useEffect(() => {
    let filtered = followUps;

    if (searchQuery) {
      filtered = filtered.filter(followUp =>
        followUp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        followUp.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(followUp => followUp.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(followUp => followUp.priority === priorityFilter);
    }

    setFilteredFollowUps(filtered);
  }, [searchQuery, statusFilter, priorityFilter, followUps]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type) => {
    const icons = {
      call: "📞",
      email: "📧",
      meeting: "🤝",
      reminder: "⏰"
    };
    return icons[type] || "📋";
  };

  const isOverdue = (dueDate) => {
    const today = new Date().toISOString().split('T')[0];
    return dueDate < today;
  };

  const markAsCompleted = (followUpId) => {
    setFollowUps(prev => prev.map(f => 
      f.id === followUpId ? { ...f, status: 'completed' } : f
    ));
    toast({
      title: "Follow-up Completed",
      description: "Follow-up has been marked as completed",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Follow-up System
              </CardTitle>
              <CardDescription>
                Manage and track your follow-up tasks and reminders
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Follow-up
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl h-[100vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Follow-up</DialogTitle>
                  <DialogDescription>
                    Schedule a follow-up task or reminder
                  </DialogDescription>
                </DialogHeader>
                <CreateFollowUpForm 
                  onClose={() => setIsCreateModalOpen(false)}
                  onFollowUpCreated={(newFollowUp) => {
                    setFollowUps(prev => [...prev, newFollowUp]);
                    setIsCreateModalOpen(false);
                    toast({
                      title: "Follow-up Created",
                      description: "New follow-up has been scheduled successfully",
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-yellow-600" />
                  <div>
                    <div className="text-2xl font-bold">{followUps.filter(f => f.status === 'pending').length}</div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold">
                      {followUps.filter(f => isOverdue(f.dueDate) && f.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">Overdue</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <User className="h-8 w-8 text-green-600" />
                  <div>
                    <div className="text-2xl font-bold">{followUps.filter(f => f.status === 'completed').length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold">{followUps.length}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search follow-ups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Follow-ups Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFollowUps.map((followUp) => (
                  <TableRow key={followUp.id} className={isOverdue(followUp.dueDate) && followUp.status === 'pending' ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <span>{getTypeIcon(followUp.type)}</span>
                          {followUp.title}
                        </div>
                        <div className="text-sm text-gray-500">{followUp.description}</div>
                        {followUp.property && (
                          <div className="text-sm text-blue-600">{followUp.property}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{followUp.contact}</TableCell>
                    <TableCell className="capitalize">{followUp.type}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(followUp.priority)}>
                        {followUp.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className={isOverdue(followUp.dueDate) && followUp.status === 'pending' ? 'text-red-600 font-medium' : ''}>
                          {followUp.dueDate}
                        </div>
                        <div className="text-sm text-gray-500">{followUp.dueTime}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(followUp.status)}>
                        {followUp.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{followUp.assignedAgent}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {followUp.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => markAsCompleted(followUp.id)}
                          >
                            Complete
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpSystem;
