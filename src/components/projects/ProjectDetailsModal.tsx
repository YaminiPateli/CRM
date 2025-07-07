// src/components/projects/ProjectDetailsModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Calendar } from "lucide-react";

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
}

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const completionPercentage = project.total_properties
    ? Math.round((project.sold_properties / project.total_properties) * 100)
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            <Badge className="bg-blue-100 text-blue-800">Active</Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Location</p>
                  <p className="flex items-center font-medium">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.city}, {project.state}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">RERA ID</p>
                  <p className="font-medium">{project.rera_project_id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Possession Date</p>
                  <p className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-1" />
                    {project.possession ? new Date(project.possession).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sales Channel</p>
                  <p className="font-medium">{project.sales || 'None'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{project.description || 'No description available'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Full Address</p>
                <p className="font-medium">{project.address || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="w-5 h-5 mr-2" />
                Property Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{project.total_properties || 0}</p>
                  <p className="text-sm text-gray-600">Total Properties</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {(project.total_properties || 0) - (project.sold_properties || 0)}
                  </p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{project.sold_properties || 0}</p>
                  <p className="text-sm text-gray-600">Sold</p>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;