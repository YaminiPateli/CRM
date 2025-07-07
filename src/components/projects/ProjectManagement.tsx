// src/components/projects/ProjectManagement.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, MapPin, Calendar, Edit2, Trash2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import ProjectDetailsModal from './ProjectDetailsModal';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/components/ui/use-toast";

const ProjectManagement = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:3001/api/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      console.error('Error:', err);
      toast({
        title: "Error",
        description: "Failed to fetch projects.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (project) => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`http://localhost:3001/api/projects/${project.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete project');
      }
      setProjects(projects.filter(p => p.id !== project.id));
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
      toast({
        title: "Success",
        description: `Project "${project.name}" has been deleted.`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || 'Failed to delete project',
        variant: "destructive"
      });
    }
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditProject = (project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        {hasPermission('create_projects') && (
          <Button onClick={() => navigate('/projects/create')}>
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
        )}
      </div>

      <Input
        placeholder="Search projects..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle 
                    className="cursor-pointer hover:text-blue-600" 
                    onClick={() => handleViewDetails(project)}
                  >
                    {project.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {hasPermission('edit_projects') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditProject(project)}
                      >
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    )}
                    {hasPermission('delete_projects') && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteDialogOpen(true);
                        }} 
                        className="text-red-600 border-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    )}
                  </div>
                </div>
                <CardDescription>
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {project.city}, {project.state}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{project.description}</p>
                <p className="text-sm">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Possession: {project.possession ? new Date(project.possession).toLocaleDateString() : 'N/A'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the project "{projectToDelete?.name}". The project can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteProject(projectToDelete)} 
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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