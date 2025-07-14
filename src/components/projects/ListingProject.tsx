import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import Header from '@/components/layout/Header';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Building, MapPin, Calendar, Edit, Trash2, List, Grid } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from "@/components/ui/use-toast";

interface Project {
  id: string;
  name: string;
  description: string;
  rera_project_id: string;
  sales: string;
  possession: string;
  search_address: string;
  address: string;
  street: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  locality: string;
  latitude: string;
  longitude: string;
  total_properties?: number;
  sold_properties?: number;
  is_active: boolean;
}

const ListingProject = () => {
  const { hasPermission, user: currentUser } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const token = localStorage.getItem('auth_token');

  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const updatedProjects = result.data.map((project: any) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        rera_project_id: project.rera_project_id,
        sales: project.sales,
        possession: project.possession,
        search_address: project.search_address,
        address: project.address,
        street: project.street,
        country: project.country,
        state: project.state,
        city: project.city,
        zip: project.zip,
        locality: project.locality,
        latitude: project.latitude,
        longitude: project.longitude,
        total_properties: project.total_properties,
        sold_properties: project.sold_properties,
        is_active: project.is_active
      }));

      setProjects(updatedProjects);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch projects.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const text = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(text) || { error: 'Failed to parse error response' };
        } catch {
          errorData = { error: text || 'Unknown error' };
        }
        throw new Error(errorData.error || 'Failed to delete project');
      }

      await fetchProjects();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
      toast({
        title: "Success",
        description: "Project has been deleted.",
      });
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message || 'Failed to delete project');
      toast({
        title: "Error",
        description: err.message || 'Failed to delete project',
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (possession: string) => {
    const today = new Date();
    const possessionDate = new Date(possession);
    return possessionDate >= today
      ? 'bg-green-100 text-green-800'
      : 'bg-gray-100 text-gray-800';
  };

  if (!hasPermission('manage_project')) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to manage projects.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <Button onClick={fetchProjects} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6 p-6">
        <div className="flex justify-between items-center py-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Project Listing</h2>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Project List</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Dashboard
            </Button>
            {hasPermission('create_projects') && (
              <Button onClick={() => navigate('/projects/create')}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </div>
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
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4 mr-2" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Projects List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription className="flex items-center max-w-[200px] truncate">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{project.city}, {project.state}</span>
                        </CardDescription>
                      </div>
                    </div>
                    {currentUser?.role === 'admin' && (
                      <div className="flex flex-col space-y-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/projects/edit/${project.id}`)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                        <Dialog open={isDeleteDialogOpen && selectedProject?.id === project.id} onOpenChange={(open) => {
                          setIsDeleteDialogOpen(open);
                          if (!open) setSelectedProject(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProject(project);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md w-full">
                            <DialogHeader>
                              <DialogTitle>Confirm Delete</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <p>Are you sure you want to delete the project <strong>{project.name}</strong>?</p>
                              <p className="text-sm text-gray-500">This action cannot be undone.</p>
                              <div className="flex justify-end gap-3">
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setIsDeleteDialogOpen(false);
                                    setSelectedProject(null);
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleDeleteProject(project.id);
                                  }}
                                >
                                  Confirm Delete
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-blue-100 text-blue-800">
                      RERA: {project.rera_project_id || 'N/A'}
                    </Badge>
                    <Badge className={project.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {project.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Properties:</span>
                      <span className="font-medium">{project.total_properties || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sold:</span>
                      <span className="font-medium text-green-600">{project.sold_properties || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completion Rate:</span>
                      <span className="font-medium">
                        {project.total_properties > 0 ? Math.round((project.sold_properties / project.total_properties) * 100) : 0}%
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Possession: {project.possession ? new Date(project.possession).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div>
                      <div className="text-lg font-semibold">{project.name}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {project.city}, {project.state}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="space-y-1 text-sm">
                      <div>RERA: {project.rera_project_id || 'N/A'}</div>
                      <div>Possession: {project.possession ? new Date(project.possession).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div>Total: {project.total_properties || 0}</div>
                      <div>Sold: {project.sold_properties || 0}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={project.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {project.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {currentUser?.role === 'admin' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/projects/edit/${project.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Dialog open={isDeleteDialogOpen && selectedProject?.id === project.id} onOpenChange={(open) => {
                            setIsDeleteDialogOpen(open);
                            if (!open) setSelectedProject(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md w-full">
                              <DialogHeader>
                                <DialogTitle>Confirm Delete</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <p>Are you sure you want to delete the project <strong>{project.name}</strong>?</p>
                                <p className="text-sm text-gray-500">This action cannot be undone.</p>
                                <div className="flex justify-end gap-3">
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setIsDeleteDialogOpen(false);
                                      setSelectedProject(null);
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      handleDeleteProject(project.id);
                                    }}
                                  >
                                    Confirm Delete
                                  </Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingProject;