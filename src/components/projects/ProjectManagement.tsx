import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import he from 'he';
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
  is_active: boolean; // Added to reflect the status
}

const ProjectManagement = () => {
  const { hasPermission } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  const handleDeleteProject = async (project: Project) => {
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

  const handleEditProject = (project: Project) => {
    navigate(`/projects/edit/${project.id}`);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  const parseDescription = (description?: string) => {
    const safeDescription = description ? he.decode(description) : '';
    console.log('Parsed description (after decode):', safeDescription);
    return parse(safeDescription, {
      trim: true,
      replace: (domNode) => {
        if (domNode.type === 'tag') {
          if (domNode.name === 'script') {
            return <span>{/* Neutralize script content */}</span>;
          }
          if (domNode.attribs) {
            const dangerousAttrs = Object.keys(domNode.attribs).filter(attr => attr.startsWith('on'));
            if (dangerousAttrs.length > 0) {
              const { ...safeAttribs } = domNode.attribs;
              dangerousAttrs.forEach(attr => delete safeAttribs[attr]);
              domNode.attribs = safeAttribs;
            }
          }
        }
        return domNode;
      },
    });
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
          {filteredProjects.slice(0, 5).map(project => (
            <Card key={project.id} className="p-4 shadow-sm border rounded-lg flex flex-col justify-between min-h-[220px]">
              <CardHeader className="p-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle
                      className="text-base font-semibold text-gray-900 cursor-pointer hover:text-blue-600"
                      onClick={() => handleViewDetails(project)}
                    >
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {project.city}, {project.state}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {hasPermission('edit_projects') && (
                      <Button variant="outline" size="icon" onClick={() => handleEditProject(project)} className="h-8 w-8 p-0">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    )}
                    {hasPermission('delete_projects') && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-red-600 border-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 mt-3">
                <div className="text-sm text-gray-700 line-clamp-2">
                  {parseDescription(project.description)}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Possession: {project.possession ? new Date(project.possession).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <Badge
                  className={`mt-2 ${project.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {project.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardContent>
            </Card>
          ))}
          <Card className="hover:shadow-lg transition-shadow flex items-center justify-center border border-dashed min-h-[220px]">
            <Button
              variant="outline"
              className="inline-flex items-center justify-center gap-0 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-fit h-fit text-lg"
              onClick={() => navigate('/projects')}
            >
              View All Projects
            </Button>
          </Card>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the project "{projectToDelete?.name}"? The project can be restored later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => handleDeleteProject(projectToDelete!)} 
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