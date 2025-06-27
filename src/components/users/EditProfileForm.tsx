import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';

const EditProfileForm = ({ user, onClose }) => {
  const { user: currentUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [role, setRole] = useState(user?.role || 'agent');

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setRole(user?.role || 'agent');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ name, phone, role }),
      });
      if (response.ok) {
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
  const canEdit = isAdmin || currentUser?.id === user?.id;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={!canEdit} required />
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
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={!canEdit}>Save Changes</Button>
      </div>
    </form>
  );
};

export default EditProfileForm;