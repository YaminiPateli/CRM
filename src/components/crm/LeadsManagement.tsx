
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Filter, Users, Phone, Mail } from "lucide-react";
import CreateLeadForm from './CreateLeadForm';
import LeadDetailsModal from './LeadDetailsModal';
import { useToast } from "@/hooks/use-toast";

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { toast } = useToast();

  // Mock data - replace with API calls
  const mockLeads = [
    {
      id: 1,
      name: "John Smith",
      email: "john@example.com",
      phone: "+1234567890",
      status: "active",
      type: "buyer",
      leadSource: "Website Form",
      leadScore: 85,
      budget: "$500K - $750K",
      timeline: "3-6 months",
      assignedAgent: "Sarah Johnson",
      lastContact: "2024-01-15",
      createdAt: "2024-01-10"
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily@example.com",
      phone: "+1234567891",
      status: "qualified",
      type: "seller",
      leadSource: "Referral",
      leadScore: 92,
      budget: "$800K - $1M",
      timeline: "1-3 months",
      assignedAgent: "Mike Wilson",
      lastContact: "2024-01-14",
      createdAt: "2024-01-08"
    }
  ];

  useEffect(() => {
    setLeads(mockLeads);
    setFilteredLeads(mockLeads);
  }, []);

  useEffect(() => {
    let filtered = leads;

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(lead => lead.leadSource === sourceFilter);
    }

    setFilteredLeads(filtered);
  }, [searchQuery, statusFilter, sourceFilter, leads]);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      qualified: 'bg-blue-100 text-blue-800',
      nurturing: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-gray-100 text-gray-800',
      converted: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const autoAssignLead = (lead) => {
    // Simple round-robin assignment logic
    const agents = ["Sarah Johnson", "Mike Wilson", "Lisa Chen", "David Brown"];
    const randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    const updatedLead = { ...lead, assignedAgent: randomAgent };
    setLeads(prev => prev.map(l => l.id === lead.id ? updatedLead : l));
    
    toast({
      title: "Lead Auto-Assigned",
      description: `Lead has been assigned to ${randomAgent}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leads Management
              </CardTitle>
              <CardDescription>
                Manage and track your real estate leads
              </CardDescription>
            </div>
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Lead
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Lead</DialogTitle>
                  <DialogDescription>
                    Add a new lead to your CRM system
                  </DialogDescription>
                </DialogHeader>
                <CreateLeadForm 
                  onClose={() => setIsCreateModalOpen(false)}
                  onLeadCreated={(newLead) => {
                    setLeads(prev => [...prev, newLead]);
                    setIsCreateModalOpen(false);
                    toast({
                      title: "Lead Created",
                      description: "New lead has been added successfully",
                    });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="nurturing">Nurturing</SelectItem>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                <SelectItem value="Website Form">Website Form</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Leads Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{lead.name}</div>
                        <div className="text-sm text-gray-500">{lead.leadSource}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {lead.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{lead.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${lead.leadScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{lead.leadScore}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {lead.assignedAgent || (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => autoAssignLead(lead)}
                        >
                          Auto Assign
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>{lead.lastContact}</TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedLead(lead);
                          setIsDetailsModalOpen(true);
                        }}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          onLeadUpdated={(updatedLead) => {
            setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l));
          }}
        />
      )}
    </div>
  );
};

export default LeadsManagement;
