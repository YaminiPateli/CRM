
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Building, Calendar, DollarSign, Home, Users } from "lucide-react";

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

interface ProjectDetailsModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const ProjectDetailsModal = ({ project, isOpen, onClose }: ProjectDetailsModalProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const completionPercentage = Math.round((project.soldProperties / project.totalProperties) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">{project.name}</DialogTitle>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
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
                    {project.location}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-medium capitalize">{project.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="flex items-center font-medium">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="flex items-center font-medium">
                    <DollarSign className="w-4 h-4 mr-1" />
                    ₹{(project.totalValue / 10000000).toFixed(1)}Cr
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{project.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Property Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Property Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{project.totalProperties}</p>
                  <p className="text-sm text-gray-600">Total Properties</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{project.availableProperties}</p>
                  <p className="text-sm text-gray-600">Available</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{project.soldProperties}</p>
                  <p className="text-sm text-gray-600">Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{completionPercentage}%</p>
                  <p className="text-sm text-gray-600">Completion</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View Properties
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Add Property
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                View Leads
              </button>
              <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                Generate Report
              </button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
