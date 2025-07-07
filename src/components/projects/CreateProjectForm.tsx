import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';

const CreateProjectForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rera_project_id: '',
    sales: '',
    possession: '',
    search_address: '',
    address: '',
    street: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    locality: '',
    latitude: '',
    longitude: ''
  });

  const salesOptions = [
    { value: '', label: 'All' },
    { value: '', label: 'None' },
    { value: 'nancy_gandhi', label: 'NANCY GANDHI (Sales) (Sales Team)' },
    { value: 'hardik_shah', label: 'HARDIK SHAH (Manager) (Sales Team)' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:3001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          created_by: user?.id,
          is_active: true,
          created_at: new Date().toISOString()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const project = await response.json();
      console.log("Created:", project);
      navigate('/dashboard'); // Redirect to /dashboard (mapped to ProjectManagement)
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl mx-auto p-6">
      <div><label>Project Name</label><Input name="name" placeholder="Project Name" value={formData.name} onChange={handleChange} required /></div>
      <div><label>Description</label><Textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} /></div>
      <div><label>RERA Project ID</label><Input name="rera_project_id" placeholder="RERA Project ID" value={formData.rera_project_id} onChange={handleChange} /></div>
      <div><label>Sales Channel</label><select name="sales" value={formData.sales} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" style={{ backgroundColor: formData.sales ? '#6B46C1' : 'transparent', color: formData.sales ? '#FFFFFF' : '#6B7280' }}><option value="">All</option><option value="">None</option><option value="nancy_gandhi">NANCY GANDHI (Sales) (Sales Team)</option><option value="hardik_shah">HARDIK SHAH (Manager) (Sales Team)</option></select></div>
      <div><label>Possession</label><Input type="date" name="possession" value={formData.possession} onChange={handleChange} /></div>
      <div><label>Search Address</label><Input name="search_address" placeholder="Search Address" value={formData.search_address} onChange={handleChange} /></div>
      <div><label>Address</label><Textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} /></div>
      <div className="flex gap-4"><div className="flex-1"><label>Street</label><Input name="street" placeholder="Street" value={formData.street} onChange={handleChange} /></div><div className="flex-1"><label>Country </label><Input name="country" placeholder="Country" value={formData.country} onChange={handleChange} required /></div></div>
      <div className="flex gap-4"><div className="flex-1"><label>State</label><Input name="state" placeholder="State" value={formData.state} onChange={handleChange} required /></div><div className="flex-1"><label>City</label><Input name="city" placeholder="City" value={formData.city} onChange={handleChange} required /></div></div>
      <div className="flex gap-4"><div className="flex-1"><label>Zip Code</label><Input name="zip" placeholder="Zip Code" value={formData.zip} onChange={handleChange} /></div><div className="flex-1"><label>Locality </label><Input name="locality" placeholder="Locality" value={formData.locality} onChange={handleChange} /></div></div>
      <div className="flex gap-4"><div className="flex-1"><label>Latitude</label><Input type="number" step="any" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} /></div><div className="flex-1"><label>Longitude </label><Input type="number" step="any" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} /></div></div>
      <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Project"}</Button>
    </form>
  );
};

export default CreateProjectForm;