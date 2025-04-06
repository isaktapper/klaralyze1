"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Plus, X, User, Shield, Mail } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type TeamMember = {
  id: string
  email: string
  role: 'admin' | 'member'
  status: 'pending' | 'active'
}

export default function InvitePage() {
  const [emails, setEmails] = useState<string[]>([''])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', email: 'admin@example.com', role: 'admin', status: 'active' },
    { id: '2', email: 'member@example.com', role: 'member', status: 'active' },
    { id: '3', email: 'pending@example.com', role: 'member', status: 'pending' },
  ])

  const handleAddEmail = () => {
    setEmails([...emails, ''])
  }

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index)
    setEmails(newEmails)
  }

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails]
    newEmails[index] = value
    setEmails(newEmails)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Here you would typically send the invitations
    toast.success('Invitations sent successfully!')
    setEmails([''])
  }

  const handleRoleChange = (memberId: string, newRole: 'admin' | 'member') => {
    setTeamMembers(teamMembers.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
    toast.success('Role updated successfully!')
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
          <p className="mt-2 text-sm text-gray-600">
            Invite new team members and manage their roles
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Invite Section */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Invite Team Members</h2>
              <p className="mt-1 text-sm text-gray-600">
                Send invitations to new team members
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {emails.map((email, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Label htmlFor={`email-${index}`}>Email address</Label>
                      <Input
                        id={`email-${index}`}
                        type="email"
                        value={email}
                        onChange={(e) => handleEmailChange(index, e.target.value)}
                        placeholder="team@example.com"
                        required
                      />
                    </div>
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveEmail(index)}
                        className="mt-6"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddEmail}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add another email
                </Button>

                <Button type="submit" className="w-full">
                  Send invitations
                </Button>
              </form>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
              <p className="mt-1 text-sm text-gray-600">
                Manage your team members and their roles
              </p>

              <div className="mt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Member</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-gray-400" />
                            <span>{member.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={member.role}
                            onValueChange={(value: 'admin' | 'member') => handleRoleChange(member.id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <div className="flex items-center gap-2">
                                  <Shield className="h-4 w-4" />
                                  <span>Admin</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="member">
                                <div className="flex items-center gap-2">
                                  <User className="h-4 w-4" />
                                  <span>Member</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                            member.status === 'active' 
                              ? "bg-green-50 text-green-700" 
                              : "bg-yellow-50 text-yellow-700"
                          )}>
                            {member.status === 'active' ? 'Active' : 'Pending'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 