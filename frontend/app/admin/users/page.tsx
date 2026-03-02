'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody, Button, Input, Select } from '@/components/ui';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useToast } from '@/lib/toast';
import { User } from '@/types/auth';
import { authApi } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await authApi.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      toast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  const handleToggleRole = async (userId: string, currentRole: 'user' | 'admin') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    const confirmMessage = `Are you sure you want to change this user's role to ${newRole}?`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      await authApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast(`User role changed to ${newRole}`, 'success');
    } catch (error) {
      toast('Failed to update user role', 'error');
    }
  };

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    const confirmMessage = `Are you sure you want to delete ${userEmail}? This action cannot be undone.`;
    
    if (!confirm(confirmMessage)) return;
    
    try {
      await authApi.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast('User deleted successfully', 'success');
    } catch (error: any) {
      toast(error.userMessage || 'Failed to delete user', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">User Management</h1>
            <p className="text-slate-400 mt-2">View and manage user accounts</p>
          </div>
          <Button onClick={loadUsers} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <Select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                options={[
                  { value: 'all', label: 'All Roles' },
                  { value: 'admin', label: 'Admins' },
                  { value: 'user', label: 'Users' },
                ]}
              />
            </div>
          </CardBody>
        </Card>

        {/* Users List */}
        <Card>
          <CardBody className="p-6">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-slate-800 rounded animate-pulse"></div>
                ))}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">👥</div>
                <p className="text-slate-400">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">User</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Email</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Role</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Joined</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-900/50">
                        <td className="py-3 px-4">
                          <div className="font-medium text-white">
                            {user.firstName} {user.lastName}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-300 text-sm">
                          {user.createdAt ? formatDate(user.createdAt) : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleToggleRole(user.id, user.role)}
                              className={
                                user.role === 'admin' 
                                  ? 'bg-blue-600 hover:bg-blue-700'
                                  : 'bg-purple-600 hover:bg-purple-700'
                              }
                            >
                              Make {user.role === 'admin' ? 'User' : 'Admin'}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="bg-red-600 hover:bg-red-700"
                              disabled={user.email === 'admin@campus.edu'} // Protect main admin
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
