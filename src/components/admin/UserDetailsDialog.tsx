import React, { useState, useEffect } from 'react';
import { UserWithRoles } from '@/services/userService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserRoleManagement from './UserRoleManagement';
import { format } from 'date-fns';

interface UserDetailsDialogProps {
  user: UserWithRoles | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserUpdate: () => void;
}

const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  user,
  open,
  onOpenChange,
  onUserUpdate
}) => {
  if (!user) return null;

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName.charAt(0)}${surname.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Avatar className="h-16 w-16 mx-auto sm:mx-0">
              <AvatarImage src={user.profile?.profile_picture || ''} />
              <AvatarFallback className="text-lg">
                {getInitials(user.first_name, user.surname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-2">
              <DialogTitle className="text-xl font-bold">
                {user.first_name} {user.surname}
              </DialogTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.email}</span>
                <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="w-fit mx-auto sm:mx-0">
                  {user.status}
                </Badge>
              </div>
              <DialogDescription className="text-sm">
                User details, role management, and permissions overview
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="details" className="text-sm">User Details</TabsTrigger>
            <TabsTrigger value="roles" className="text-sm">Role Management</TabsTrigger>
            <TabsTrigger value="permissions" className="text-sm">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1 bg-blue-100 rounded">
                      <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email Address</span>
                      <span className="text-sm font-medium break-all">{user.email}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone Number</span>
                      <span className="text-sm font-medium">{user.phone_number || 'Not provided'}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Gender</span>
                      <span className="text-sm font-medium capitalize">{user.gender || 'Not specified'}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Account Status</span>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className="w-fit">
                        {user.status}
                      </Badge>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Verification Method</span>
                      <span className="text-sm font-medium">{user.verification_method || 'Not verified'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1 bg-green-100 rounded">
                      <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Member Since</span>
                      <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Updated</span>
                      <span className="text-sm font-medium">{formatDate(user.updated_at)}</span>
                    </div>
                    {user.profile && (
                      <>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Address</span>
                          <span className="text-sm font-medium">{user.profile.address || 'Not provided'}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">City</span>
                          <span className="text-sm font-medium">{user.profile.city || 'Not provided'}</span>
                        </div>
                        <div className="flex flex-col space-y-1">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Bio</span>
                          <span className="text-sm font-medium">{user.profile.bio || 'No bio provided'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Roles Summary */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1 bg-purple-100 rounded">
                    <svg className="h-4 w-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  Current Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.roles && user.roles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.roles.map((role) => (
                      <Badge 
                        key={role.id} 
                        variant={role.name === 'super_admin' ? 'destructive' : 'outline'}
                        className="px-3 py-1"
                      >
                        {role.name}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">No roles assigned to this user</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles" className="space-y-6 mt-0">
            <UserRoleManagement user={user} onRoleUpdate={onUserUpdate} />
          </TabsContent>

          <TabsContent value="permissions" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <div className="p-1 bg-orange-100 rounded">
                    <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Direct Permissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user.permissions && user.permissions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {user.permissions.map((permission, index) => (
                      <Badge key={index} variant="outline" className="px-3 py-1">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="p-3 bg-gray-100 rounded-full w-fit mx-auto mb-3">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm text-muted-foreground">No direct permissions assigned</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {user.roles && user.roles.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className="p-1 bg-indigo-100 rounded">
                      <svg className="h-4 w-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    Role-Based Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {user.roles.map((role) => (
                    <div key={role.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <Badge variant={role.name === 'super_admin' ? 'destructive' : 'outline'} className="px-3 py-1">
                            {role.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {role.description}
                          </span>
                        </div>
                      </div>
                      {role.permissions && role.permissions.length > 0 ? (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          {role.permissions.map((permission, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                              {permission.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground pt-2 border-t">No specific permissions defined for this role</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsDialog;
