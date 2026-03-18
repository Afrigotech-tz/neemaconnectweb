import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Clock3,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Save,
  Settings2,
  Shield,
  Trash2,
  UserCog,
} from "lucide-react";
import { roleService } from "@/services/roleService/roleService";
import { CreateRoleData, Permission, Role } from "@/types/rolePermissionTypes";
import { useLanguage } from "@/contexts/LanguageContext";

const SETTINGS_STORAGE_KEY = "dashboard_system_settings_v2";

type AppSettings = {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
    sessionTimeoutMinutes: number;
  };
  privacy: {
    profileVisible: boolean;
    activitySharing: boolean;
    dataCollection: boolean;
  };
  system: {
    darkMode: boolean;
    language: string;
    timezone: string;
  };
};

const defaultSettings = (language: string): AppSettings => ({
  notifications: {
    email: true,
    sms: false,
    push: true,
  },
  security: {
    twoFactor: false,
    loginAlerts: true,
    sessionTimeoutMinutes: 30,
  },
  privacy: {
    profileVisible: true,
    activitySharing: true,
    dataCollection: false,
  },
  system: {
    darkMode: false,
    language: language || "en",
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
  },
});

const timezoneOptions = [
  "UTC",
  "Africa/Dar_es_Salaam",
  "Africa/Nairobi",
  "Africa/Lagos",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Kolkata",
];

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Swahili", value: "sw" },
];

const mergeSettings = (base: AppSettings, input: Partial<AppSettings>): AppSettings => ({
  notifications: { ...base.notifications, ...(input.notifications || {}) },
  security: { ...base.security, ...(input.security || {}) },
  privacy: { ...base.privacy, ...(input.privacy || {}) },
  system: { ...base.system, ...(input.system || {}) },
});

const normalizeRoles = (input: Role[] | undefined): Role[] => {
  if (!Array.isArray(input)) return [];
  return input.map((role) => ({
    ...role,
    permissions: Array.isArray(role.permissions) ? role.permissions : [],
  }));
};

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { language, setLanguage } = useLanguage();

  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaults = defaultSettings("en");
    try {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return defaults;
      return mergeSettings(defaults, JSON.parse(raw) as Partial<AppSettings>);
    } catch {
      return defaults;
    }
  });
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(settings));
  const [savingSettings, setSavingSettings] = useState(false);

  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [showAddRole, setShowAddRole] = useState(false);
  const [creatingRole, setCreatingRole] = useState(false);
  const [savingRolePermissions, setSavingRolePermissions] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);

  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [roleSearch, setRoleSearch] = useState("");
  const [rolePermissionDraft, setRolePermissionDraft] = useState<number[]>([]);

  const [newRoleForm, setNewRoleForm] = useState({
    name: "",
    display_name: "",
    description: "",
    is_active: true,
    permission_ids: [] as number[],
  });

  useEffect(() => {
    setSettings((prev) => {
      const next = mergeSettings(prev, { system: { language } } as Partial<AppSettings>);
      return next;
    });
  }, [language]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.system.darkMode);
  }, [settings.system.darkMode]);

  const refreshRoleData = async () => {
    setRolesLoading(true);
    try {
      const [rolesResponse, permissionsResponse] = await Promise.all([
        roleService.getRoles(),
        roleService.getPermissions(),
      ]);

      if (!rolesResponse.success) {
        toast({
          title: "Roles error",
          description: rolesResponse.message || "Failed to load roles.",
          variant: "destructive",
        });
      }

      if (!permissionsResponse.success) {
        toast({
          title: "Permissions error",
          description: permissionsResponse.message || "Failed to load permissions.",
          variant: "destructive",
        });
      }

      const nextRoles = normalizeRoles(rolesResponse.data);
      const nextPermissions = Array.isArray(permissionsResponse.data) ? permissionsResponse.data : [];
      setRoles(nextRoles);
      setPermissions(nextPermissions);

      setSelectedRoleId((prev) => {
        if (nextRoles.length === 0) return null;
        if (!prev || !nextRoles.some((role) => role.id === prev)) {
          return nextRoles[0].id;
        }
        return prev;
      });
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    void refreshRoleData();
  }, []);

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) || null,
    [roles, selectedRoleId]
  );

  useEffect(() => {
    if (!selectedRole) {
      setRolePermissionDraft([]);
      return;
    }
    const ids = (selectedRole.permissions || []).map((permission) => permission.id);
    setRolePermissionDraft(ids);
  }, [selectedRole?.id, selectedRole?.updated_at]);

  const filteredRoles = useMemo(() => {
    const normalizedQuery = roleSearch.trim().toLowerCase();
    if (!normalizedQuery) return roles;
    return roles.filter((role) => {
      return (
        role.name.toLowerCase().includes(normalizedQuery) ||
        role.display_name.toLowerCase().includes(normalizedQuery) ||
        (role.description || "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [roles, roleSearch]);

  const permissionsByModule = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>((acc, permission) => {
      const moduleName = permission.module || "General";
      if (!acc[moduleName]) acc[moduleName] = [];
      acc[moduleName].push(permission);
      return acc;
    }, {});
  }, [permissions]);

  const settingsChanged = JSON.stringify(settings) !== savedSnapshot;
  const selectedRolePermissionIds = selectedRole
    ? new Set((selectedRole.permissions || []).map((permission) => permission.id))
    : new Set<number>();
  const draftPermissionIds = new Set(rolePermissionDraft);
  const rolePermissionsChanged =
    selectedRolePermissionIds.size !== draftPermissionIds.size ||
    [...selectedRolePermissionIds].some((id) => !draftPermissionIds.has(id));

  const enabledPreferencesCount = useMemo(() => {
    const values = [
      settings.notifications.email,
      settings.notifications.sms,
      settings.notifications.push,
      settings.security.twoFactor,
      settings.security.loginAlerts,
      settings.privacy.profileVisible,
      settings.privacy.activitySharing,
      settings.privacy.dataCollection,
      settings.system.darkMode,
    ];
    return values.filter(Boolean).length;
  }, [settings]);

  const updateBooleanSetting = (
    section: keyof Pick<AppSettings, "notifications" | "security" | "privacy" | "system">,
    key: string,
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setLanguage(settings.system.language);
      setSavedSnapshot(JSON.stringify(settings));
      toast({
        title: "Settings saved",
        description: "Your dashboard settings were saved successfully.",
      });
    } catch {
      toast({
        title: "Save failed",
        description: "Unable to save settings right now.",
        variant: "destructive",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleResetDefaults = () => {
    const defaults = defaultSettings(language);
    setSettings(defaults);
    toast({
      title: "Defaults restored",
      description: "You can now save to apply default settings.",
    });
  };

  const toggleDraftPermission = (permissionId: number) => {
    setRolePermissionDraft((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const toggleNewRolePermission = (permissionId: number) => {
    setNewRoleForm((prev) => ({
      ...prev,
      permission_ids: prev.permission_ids.includes(permissionId)
        ? prev.permission_ids.filter((id) => id !== permissionId)
        : [...prev.permission_ids, permissionId],
    }));
  };

  const handleSaveRolePermissions = async () => {
    if (!selectedRole) return;
    setSavingRolePermissions(true);
    try {
      const response = await roleService.addPermissionsToRole(selectedRole.id, {
        role_id: selectedRole.id,
        permission_ids: rolePermissionDraft,
      });

      if (!response.success) {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update role permissions.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Permissions updated",
        description: `Permissions for "${selectedRole.display_name}" were saved.`,
      });
      await refreshRoleData();
    } finally {
      setSavingRolePermissions(false);
    }
  };

  const handleCreateRole = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = newRoleForm.name.trim();
    const trimmedDisplayName = newRoleForm.display_name.trim();
    if (!trimmedName || !trimmedDisplayName) {
      toast({
        title: "Validation error",
        description: "Role name and display name are required.",
        variant: "destructive",
      });
      return;
    }

    setCreatingRole(true);
    try {
      const payload: CreateRoleData = {
        name: trimmedName,
        display_name: trimmedDisplayName,
        description: newRoleForm.description.trim(),
        is_active: newRoleForm.is_active,
      };

      const createResponse = await roleService.createRole(payload);
      if (!createResponse.success || !createResponse.data) {
        toast({
          title: "Create failed",
          description: createResponse.message || "Failed to create role.",
          variant: "destructive",
        });
        return;
      }

      if (newRoleForm.permission_ids.length > 0) {
        await roleService.addPermissionsToRole(createResponse.data.id, {
          role_id: createResponse.data.id,
          permission_ids: newRoleForm.permission_ids,
        });
      }

      toast({
        title: "Role created",
        description: `Role "${trimmedDisplayName}" was created successfully.`,
      });

      setShowAddRole(false);
      setNewRoleForm({
        name: "",
        display_name: "",
        description: "",
        is_active: true,
        permission_ids: [],
      });
      await refreshRoleData();
      setSelectedRoleId(createResponse.data.id);
    } finally {
      setCreatingRole(false);
    }
  };

  const handleRoleStatusToggle = async (role: Role, nextState: boolean) => {
    const response = await roleService.updateRole(role.id, {
      name: role.name,
      display_name: role.display_name,
      description: role.description || "",
      is_active: nextState,
    });

    if (!response.success) {
      toast({
        title: "Status update failed",
        description: response.message || "Could not update role status.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Role updated",
      description: `${role.display_name} is now ${nextState ? "active" : "inactive"}.`,
    });
    await refreshRoleData();
  };

  const handleDeleteRole = async (role: Role) => {
    const shouldDelete = window.confirm(
      `Delete role "${role.display_name}"? This action cannot be undone.`
    );
    if (!shouldDelete) return;

    setDeletingRoleId(role.id);
    try {
      const response = await roleService.deleteRole(role.id);
      if (!response.success) {
        toast({
          title: "Delete failed",
          description: response.message || "Failed to delete role.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Role deleted",
        description: `Role "${role.display_name}" was removed.`,
      });
      await refreshRoleData();
    } finally {
      setDeletingRoleId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl flex items-center gap-2">
                <Settings2 className="h-7 w-7" />
                Settings Control Center
              </h1>
              <p className="text-white/80 mt-1">
                Manage notifications, privacy, security, and role governance in one place.
              </p>
            </div>
            <Button
              variant="secondary"
              className="gap-2 bg-white/15 text-white hover:bg-white/25"
              onClick={() => void refreshRoleData()}
              disabled={rolesLoading}
            >
              {rolesLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh Data
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Roles</p>
            <p className="text-2xl font-bold mt-1">{roles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Permissions</p>
            <p className="text-2xl font-bold mt-1">{permissions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Enabled Preferences</p>
            <p className="text-2xl font-bold mt-1">{enabledPreferencesCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Settings State</p>
            <p className="text-base font-semibold mt-2">
              {settingsChanged ? "Unsaved changes" : "All changes saved"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
          <TabsTrigger value="roles">Roles & Access</TabsTrigger>
        </TabsList>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Control how alerts and updates are delivered.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates by email.</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(value) => updateBooleanSetting("notifications", "email", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive critical alerts by SMS.</p>
                </div>
                <Switch
                  checked={settings.notifications.sms}
                  onCheckedChange={(value) => updateBooleanSetting("notifications", "sms", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Enable browser push notifications.</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(value) => updateBooleanSetting("notifications", "push", value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock3 className="h-5 w-5" />
                System Preferences
              </CardTitle>
              <CardDescription>Set visual mode, language, and timezone.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.system.language}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      system: { ...prev.system, language: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={settings.system.timezone}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      system: { ...prev.system, timezone: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezoneOptions.map((zone) => (
                      <SelectItem key={zone} value={zone}>
                        {zone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3 md:col-span-2">
                <div>
                  <Label>Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">Switch dashboard to dark theme.</p>
                </div>
                <Switch
                  checked={settings.system.darkMode}
                  onCheckedChange={(value) => updateBooleanSetting("system", "darkMode", value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleResetDefaults}>
              Reset Defaults
            </Button>
            <Button onClick={handleSaveSettings} disabled={savingSettings || !settingsChanged}>
              {savingSettings ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Controls
              </CardTitle>
              <CardDescription>Apply account protection and alert rules.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Require additional verification at sign in.</p>
                </div>
                <Switch
                  checked={settings.security.twoFactor}
                  onCheckedChange={(value) => updateBooleanSetting("security", "twoFactor", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify on suspicious login activity.</p>
                </div>
                <Switch
                  checked={settings.security.loginAlerts}
                  onCheckedChange={(value) => updateBooleanSetting("security", "loginAlerts", value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Session Timeout (Minutes)</Label>
                <Input
                  type="number"
                  min={5}
                  max={240}
                  value={settings.security.sessionTimeoutMinutes}
                  onChange={(event) => {
                    const parsed = Number(event.target.value);
                    setSettings((prev) => ({
                      ...prev,
                      security: {
                        ...prev.security,
                        sessionTimeoutMinutes: Number.isNaN(parsed) ? 30 : Math.max(5, Math.min(240, parsed)),
                      },
                    }));
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Privacy Controls
              </CardTitle>
              <CardDescription>Control visibility and data sharing behavior.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile.</p>
                </div>
                <Switch
                  checked={settings.privacy.profileVisible}
                  onCheckedChange={(value) => updateBooleanSetting("privacy", "profileVisible", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Activity Sharing</Label>
                  <p className="text-sm text-muted-foreground">Share your activity with other users.</p>
                </div>
                <Switch
                  checked={settings.privacy.activitySharing}
                  onCheckedChange={(value) => updateBooleanSetting("privacy", "activitySharing", value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Anonymous Data Collection</Label>
                  <p className="text-sm text-muted-foreground">Help improve the platform with anonymous usage data.</p>
                </div>
                <Switch
                  checked={settings.privacy.dataCollection}
                  onCheckedChange={(value) => updateBooleanSetting("privacy", "dataCollection", value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} disabled={savingSettings || !settingsChanged}>
              {savingSettings ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Security & Privacy
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <UserCog className="h-5 w-5" />
                    Role Governance
                  </CardTitle>
                  <CardDescription>Manage roles, activation status, and permissions.</CardDescription>
                </div>
                <Button className="gap-2" onClick={() => setShowAddRole(true)}>
                  <Plus className="h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="space-y-3 lg:col-span-1">
                <Input
                  placeholder="Search roles..."
                  value={roleSearch}
                  onChange={(event) => setRoleSearch(event.target.value)}
                />
                <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-lg border p-2">
                  {rolesLoading ? (
                    <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading roles...
                    </div>
                  ) : filteredRoles.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No roles found.</p>
                  ) : (
                    filteredRoles.map((role) => (
                      <div
                        key={role.id}
                        className={`rounded-md border p-3 transition-colors ${
                          selectedRoleId === role.id ? "border-primary bg-primary/5" : "hover:bg-muted/40"
                        }`}
                      >
                        <button
                          className="w-full text-left"
                          onClick={() => setSelectedRoleId(role.id)}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{role.display_name}</p>
                            <Badge variant={role.is_active ? "default" : "secondary"}>
                              {role.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{role.name}</p>
                        </button>
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={role.is_active}
                              onCheckedChange={(checked) => void handleRoleStatusToggle(role, checked)}
                            />
                            <span className="text-xs text-muted-foreground">Enabled</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void handleDeleteRole(role)}
                            disabled={deletingRoleId === role.id}
                          >
                            {deletingRoleId === role.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4 text-destructive" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3 lg:col-span-2">
                <div className="rounded-lg border p-4">
                  <h3 className="font-semibold text-lg">
                    {selectedRole ? selectedRole.display_name : "Select a role"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedRole
                      ? selectedRole.description || "No role description provided."
                      : "Choose a role from the left panel to manage permissions."}
                  </p>
                </div>

                {selectedRole ? (
                  <>
                    <div className="max-h-[420px] space-y-4 overflow-y-auto rounded-lg border p-4">
                      {Object.entries(permissionsByModule).map(([moduleName, modulePermissions]) => (
                        <div key={moduleName} className="space-y-2">
                          <p className="text-sm font-semibold uppercase text-muted-foreground">{moduleName}</p>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {modulePermissions.map((permission) => (
                              <label
                                key={permission.id}
                                className="flex items-center gap-2 rounded border p-2 text-sm"
                              >
                                <Checkbox
                                  checked={rolePermissionDraft.includes(permission.id)}
                                  onCheckedChange={() => toggleDraftPermission(permission.id)}
                                />
                                <span>{permission.display_name || permission.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={() => void handleSaveRolePermissions()}
                        disabled={!rolePermissionsChanged || savingRolePermissions}
                      >
                        {savingRolePermissions ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Role Permissions
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No role selected.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showAddRole} onOpenChange={setShowAddRole}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define role metadata and assign permissions in one flow.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateRole} className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                  id="role-name"
                  placeholder="content_manager"
                  value={newRoleForm.name}
                  onChange={(event) =>
                    setNewRoleForm((prev) => ({ ...prev, name: event.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-display-name">Display Name</Label>
                <Input
                  id="role-display-name"
                  placeholder="Content Manager"
                  value={newRoleForm.display_name}
                  onChange={(event) =>
                    setNewRoleForm((prev) => ({ ...prev, display_name: event.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>
              <Input
                id="role-description"
                placeholder="Role scope and responsibilities"
                value={newRoleForm.description}
                onChange={(event) =>
                  setNewRoleForm((prev) => ({ ...prev, description: event.target.value }))
                }
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label>Role Active</Label>
                <p className="text-sm text-muted-foreground">Inactive roles cannot be assigned to users.</p>
              </div>
              <Switch
                checked={newRoleForm.is_active}
                onCheckedChange={(value) =>
                  setNewRoleForm((prev) => ({ ...prev, is_active: value }))
                }
              />
            </div>

            <div className="max-h-64 overflow-y-auto rounded-lg border p-3">
              <p className="font-medium mb-2">Permissions</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center gap-2 rounded border p-2 text-sm">
                    <Checkbox
                      checked={newRoleForm.permission_ids.includes(permission.id)}
                      onCheckedChange={() => toggleNewRolePermission(permission.id)}
                    />
                    <span>{permission.display_name || permission.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowAddRole(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={creatingRole}>
                {creatingRole ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Role"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
