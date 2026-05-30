import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { apiFetch } from '@/lib/api'
import Loader from '@/components/ui/loader'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/store/authSlice'
import { Users, Search, Trash2, Shield, User, Calendar, ShieldAlert } from 'lucide-react'

export default function AdminUsers() {
  const currentUser = useSelector(selectCurrentUser)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all') // 'all', 'admin', 'user'
  const [updatingId, setUpdatingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const res = await apiFetch('/users')
      if (res && res.users) {
        setUsers(res.users)
      }
    } catch (err) {
      console.error('Failed to load users:', err)
      toast.error('Failed to load users database.')
    } finally {
      setLoading(false)
    }
  }

  // Promote/Demote User Role
  async function handleToggleRole(targetUser) {
    const targetId = targetUser._id || targetUser.id
    if (!targetId) return

    // Self lockout safety check
    if (String(currentUser?.id) === String(targetId) || String(currentUser?._id) === String(targetId)) {
      toast.error('Operation blocked: You cannot change your own administrative role.')
      return
    }

    const nextRole = targetUser.role === 'admin' ? 'user' : 'admin'
    const confirmMessage = `Are you sure you want to ${
      nextRole === 'admin' ? 'promote this user to Admin' : 'revoke Admin privileges from this user'
    } for "${targetUser.name}"?`

    if (!window.confirm(confirmMessage)) return

    setUpdatingId(targetId)
    try {
      await apiFetch(`/users/${targetId}/role`, {
        method: 'PUT',
        data: { role: nextRole }
      })
      toast.success(`Role updated successfully for "${targetUser.name}"!`)
      await loadUsers()
    } catch (err) {
      toast.error(err?.message || 'Failed to update user role.')
    } finally {
      setUpdatingId(null)
    }
  }

  // Delete User Account
  async function handleDeleteUser(targetUser) {
    const targetId = targetUser._id || targetUser.id
    if (!targetId) return

    // Self deletion safety check
    if (String(currentUser?.id) === String(targetId) || String(currentUser?._id) === String(targetId)) {
      toast.error('Operation blocked: You cannot delete your own active administrator account.')
      return
    }

    if (!window.confirm(`Delete user "${targetUser.name}" (${targetUser.email})? This action is permanent and cannot be undone.`)) {
      return
    }

    setDeletingId(targetId)
    try {
      await apiFetch(`/users/${targetId}`, {
        method: 'DELETE'
      })
      toast.success(`User "${targetUser.name}" deleted successfully.`)
      await loadUsers()
    } catch (err) {
      toast.error(err?.message || 'Failed to delete user.')
    } finally {
      setDeletingId(null)
    }
  }

  // Filtered Users List
  const filteredUsers = users.filter((u) => {
    const nameMatch = u.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const emailMatch = u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    const queryMatch = nameMatch || emailMatch

    if (roleFilter === 'admin') {
      return queryMatch && u.role === 'admin'
    }
    if (roleFilter === 'user') {
      return queryMatch && u.role === 'user'
    }
    return queryMatch
  })

  // Get initial letters for Avatar
  const getInitials = (name) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
    }
    return name.charAt(0).toUpperCase()
  }

  // Check if target is current logged-in user
  const isSelf = (userObj) => {
    const uid = userObj._id || userObj.id
    return String(currentUser?.id) === String(uid) || String(currentUser?._id) === String(uid)
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Administration</h1>
          <p className="text-sm text-muted-foreground">Manage user accounts, roles, access permissions, and system profiles.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-2.5 py-1 flex items-center gap-1.5 font-medium">
            <Users className="w-3.5 h-3.5" /> {users.length} Total Users
          </Badge>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="pl-9 text-sm focus-visible:ring-primary h-9"
          />
        </div>
        <div className="flex bg-muted p-0.5 rounded-lg border h-9 items-center">
          <button
            onClick={() => setRoleFilter('all')}
            className={`text-xs font-semibold px-3.5 py-1 rounded-md transition-all ${
              roleFilter === 'all' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            All Roles
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`text-xs font-semibold px-3.5 py-1 rounded-md transition-all ${
              roleFilter === 'admin' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Admins
          </button>
          <button
            onClick={() => setRoleFilter('user')}
            className={`text-xs font-semibold px-3.5 py-1 rounded-md transition-all ${
              roleFilter === 'user' ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Users
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader /></div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Registered Users Database</CardTitle>
            <CardDescription className="text-xs">View all users registered on Pathfinder. Double-check roles to protect safety boundaries.</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            {filteredUsers.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted">No users found matching current filters.</div>
            ) : (
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="border-b bg-muted/20 text-muted-foreground text-xs uppercase font-semibold">
                    <th className="p-4">User Details</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Role Permission</th>
                    <th className="p-4">Date Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.map((u) => {
                    const self = isSelf(u)
                    const uid = u._id || u.id
                    return (
                      <tr key={uid} className={`hover:bg-muted/10 transition-colors ${self ? 'bg-primary/5 hover:bg-primary/5' : ''}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {/* Round Custom Initial Avatar */}
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary/15 to-primary/5 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shadow-sm">
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                {u.name}
                                {self && (
                                  <Badge className="bg-primary text-[10px] px-1.5 py-0.5 scale-90 border-none font-semibold hover:bg-primary">
                                    You
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-xs font-mono text-muted-foreground">{u.email}</td>
                        <td className="p-4">
                          <Badge
                            className={`font-semibold text-xs transition border ${
                              u.role === 'admin'
                                ? 'bg-violet-600/10 text-violet-600 border-violet-600/20 hover:bg-violet-600/10'
                                : 'bg-muted text-muted-foreground border-muted-foreground/10 hover:bg-muted'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              {u.role}
                            </span>
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70" />
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                          </span>
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleToggleRole(u)}
                              disabled={self || updatingId === uid}
                              className={`h-8 text-xs gap-1.5 ${
                                self
                                  ? 'opacity-40 cursor-not-allowed'
                                  : u.role === 'admin'
                                  ? 'hover:bg-amber-500/10 hover:text-amber-600 hover:border-amber-500/20'
                                  : 'hover:bg-violet-600/10 hover:text-violet-600 hover:border-violet-600/20'
                              }`}
                            >
                              {updatingId === uid ? (
                                <>
                                  <Loader size={12} /> Updating...
                                </>
                              ) : u.role === 'admin' ? (
                                <>
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" /> Revoke Admin
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3.5 h-3.5 text-violet-600" /> Make Admin
                                </>
                              )}
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteUser(u)}
                              disabled={self || deletingId === uid}
                              className={`h-8 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 ${
                                self ? 'opacity-40 cursor-not-allowed' : ''
                              }`}
                            >
                              {deletingId === uid ? (
                                'Deleting...'
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </span>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
