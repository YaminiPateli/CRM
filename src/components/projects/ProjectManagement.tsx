import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, MapPin, Calendar } from "lucide-react";
import ProjectDetailsModal from './ProjectDetailsModal';
import { useAuth } from '@/contexts/AuthContext';

interface Project {
  id: string;
  name: string;
  location: string;
  type: 'residential' | 'commercial';
  description: string;
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  startDate: string;
  status: 'planning' | 'active' | 'completed';
  totalValue: number;
}

const ProjectManagement = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'Sunset Residency',
      location: 'Mumbai, Maharashtra',
      type: 'residential',
      description: 'Premium residential complex with modern amenities',
      totalProperties: 120,
      availableProperties: 45,
      soldProperties: 75,
      startDate: '2024-01-15',
      status: 'active',
      totalValue: 50000000
    },
    {
      id: '2',
      name: 'Tech Park Plaza',
      location: 'Bangalore, Karnataka',
      type: 'commercial',
      description: 'State-of-the-art commercial complex',
      totalProperties: 80,
      availableProperties: 30,
      soldProperties: 50,
      startDate: '2023-06-01',
      status: 'active',
      totalValue: 120000000
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
          <p className="text-gray-600">Manage your real estate projects and properties</p>
        </div>
        {hasPermission('create_projects') && (
          <Button onClick={() => navigate('/projects/create')}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
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
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleProjectClick(project)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                {project.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm capitalize">{project.type}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Properties:</span>
                  <span className="font-medium">{project.totalProperties}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium text-green-600">{project.availableProperties}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sold:</span>
                  <span className="font-medium text-blue-600">{project.soldProperties}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Started: {new Date(project.startDate).toLocaleDateString()}
                  </span>
                  <span className="font-bold text-lg">
                    ₹{(project.totalValue / 10000000).toFixed(1)}Cr
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectManagement;
