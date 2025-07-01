import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent';
  status: boolean;
}

interface EditUserFormProps {
  user: User;
  onClose: () => void;
  onUserUpdated: () => void;
}

const EditUserForm = ({ user, onClose, onUserUpdated }: EditUserFormProps) => {
  const { user: currentUser } = useAuth();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState(user.status);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || '');
    setRole(user.role);
    setStatus(user.status);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, role, status }),
      });
      if (response.ok) {
        onUserUpdated();
        onClose();
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const isAdmin = currentUser?.role === 'admin';
  const canEdit = isAdmin || currentUser?.id === user.id;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!canEdit} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!canEdit} required />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={setRole} disabled={!canEdit}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="agent">Agent</SelectItem>
          </SelectContent>  
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status ? 'true' : 'false'} onValueChange={(value) => setStatus(value === 'true')} disabled={!canEdit}>
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end gap-3">
        {/* <Button type="button" variant="outline" onClick={onClose}>Cancel</Button> */}
        <Button type="submit" disabled={!canEdit}>Save Changes</Button>
      </div>
    </form>
  );
};

export default EditUserForm;