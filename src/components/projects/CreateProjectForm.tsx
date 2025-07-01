import React, { useState } from "react";
import Header from '@/components/layout/Header';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectFormData {
  name: string;
  location: string;
  type: "residential" | "commercial";
  description: string;
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  startDate: string;
  status: "planning" | "active" | "completed";
  totalValue: number;
}

const CreateProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: "",
    location: "",
    type: "residential",
    description: "",
    totalProperties: 0,
    availableProperties: 0,
    soldProperties: 0,
    startDate: "",
    status: "planning",
    totalValue: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("Properties") || name === "totalValue"
        ? parseInt(value) || 0
        : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Call API or use props to pass project data
    console.log("Project Submitted:", formData);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard"); // or use "/projects" if that's your list view
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="space-y-6 p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-fit mx-auto">
          <Input
            name="name"
            placeholder="Project Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
          <Textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              name="totalProperties"
              placeholder="Total Properties"
              value={formData.totalProperties}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="availableProperties"
              placeholder="Available Properties"
              value={formData.availableProperties}
              onChange={handleChange}
            />
            <Input
              type="number"
              name="soldProperties"
              placeholder="Sold Properties"
              value={formData.soldProperties}
              onChange={handleChange}
            />
          </div>

          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>

          <Input
            type="number"
            name="totalValue"
            placeholder="Total Value (₹)"
            value={formData.totalValue}
            onChange={handleChange}
          />

          <div className="pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
