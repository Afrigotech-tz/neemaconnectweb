import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Camera,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Save,
  Shield,
  Trash2,
  User,
  Briefcase,
  Eye,
  Clock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profileService";
import { userService } from "@/services/userService";
import { Profile } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  getCachedProfilePicture,
  removeCachedProfilePicture,
  saveProfilePictureToCache,
} from "@/lib/profilePictureCache";

const extractProfilePayload = (data: unknown): Partial<Profile> => {
  if (!data || typeof data !== "object") {
    return {};
  }

  const payload = data as Record<string, unknown>;
  if (payload.profile && typeof payload.profile === "object") {
    return payload.profile as Partial<Profile>;
  }

  return payload as Partial<Profile>;
};

const toInputValue = (value: string | null | undefined) => value || "";
const addImageCacheBuster = (url: string | null | undefined) => {
  if (!url) return null;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${Date.now()}`;
};
const toDateInputValue = (value: string | null | undefined) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const isoMatch = value.match(/^(\d{4}-\d{2}-\d{2})T/);
  if (isoMatch?.[1]) return isoMatch[1];
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
};

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [initializing, setInitializing] = useState(true);
  const [profileData, setProfileData] = useState<Profile | null>(user?.profile || null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [cachedAvatarUrl, setCachedAvatarUrl] = useState<string | null>(
    user?.id ? getCachedProfilePicture(String(user.id), user.profile?.profile_picture || null) : null
  );

  const [uploading, setUploading] = useState(false);
  const [updatingNames, setUpdatingNames] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  const [editableData, setEditableData] = useState({
    first_name: user?.first_name || "",
    surname: user?.surname || "",
    bio: toInputValue(user?.profile?.bio),
    city: toInputValue(user?.profile?.city),
    state_province: toInputValue(user?.profile?.state_province),
    date_of_birth: toDateInputValue(user?.profile?.date_of_birth),
    occupation: toInputValue(user?.profile?.occupation),
    profile_public: user?.profile?.profile_public ?? true,
  });

  const [locationData, setLocationData] = useState({
    address: toInputValue(user?.profile?.address),
    city: toInputValue(user?.profile?.city),
    state_province: toInputValue(user?.profile?.state_province),
    postal_code: toInputValue(user?.profile?.postal_code),
    location_public: user?.profile?.location_public ?? false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    if (!user?.id) return;
    const cached = getCachedProfilePicture(String(user.id), profileData?.profile_picture || user.profile?.profile_picture || null);
    setCachedAvatarUrl(cached);
  }, [user?.id, user?.profile?.profile_picture, profileData?.profile_picture]);

  const hydrateFromProfile = useCallback((profile: Partial<Profile> | null | undefined) => {
    setProfileData((profile as Profile) || null);

    setEditableData((prev) => ({
      ...prev,
      bio: toInputValue(profile?.bio),
      city: toInputValue(profile?.city),
      state_province: toInputValue(profile?.state_province),
      date_of_birth: toDateInputValue(profile?.date_of_birth),
      occupation: toInputValue(profile?.occupation),
      profile_public: profile?.profile_public ?? true,
    }));

    setLocationData({
      address: toInputValue(profile?.address),
      city: toInputValue(profile?.city),
      state_province: toInputValue(profile?.state_province),
      postal_code: toInputValue(profile?.postal_code),
      location_public: profile?.location_public ?? false,
    });
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setEditableData((prev) => ({
      ...prev,
      first_name: user.first_name || "",
      surname: user.surname || "",
    }));
  }, [user?.id, user?.first_name, user?.surname, navigate]);

  useEffect(() => {
    if (!user?.id) return;

    if (user.profile) {
      hydrateFromProfile(user.profile);
    }

    const loadProfile = async () => {
      setInitializing(true);
      const response = await profileService.getProfile();

      if (response.success && response.data) {
        const profilePayload = extractProfilePayload(response.data);
        const mergedProfile = {
          ...(profileData || {}),
          ...profilePayload,
        } as Profile;

        hydrateFromProfile(mergedProfile);
        updateUser({ profile: mergedProfile as any });
      }

      setInitializing(false);
    };

    void loadProfile();
    // Intentionally run only for authenticated user changes.
    // Including `profileData` here would cause a re-fetch loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, hydrateFromProfile, updateUser]);

  const getInitials = (firstName: string, surname: string) =>
    `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();

  const hasNameChanges = useMemo(() => {
    if (!user) return false;
    return (
      editableData.first_name.trim() !== (user.first_name || "") ||
      editableData.surname.trim() !== (user.surname || "")
    );
  }, [editableData.first_name, editableData.surname, user]);

  const hasProfileChanges = useMemo(() => {
    return (
      editableData.bio !== toInputValue(profileData?.bio) ||
      editableData.city !== toInputValue(profileData?.city) ||
      editableData.state_province !== toInputValue(profileData?.state_province) ||
      editableData.date_of_birth !== toDateInputValue(profileData?.date_of_birth) ||
      editableData.occupation !== toInputValue(profileData?.occupation) ||
      editableData.profile_public !== (profileData?.profile_public ?? true)
    );
  }, [editableData, profileData]);

  const hasLocationChanges = useMemo(() => {
    return (
      locationData.address !== toInputValue(profileData?.address) ||
      locationData.city !== toInputValue(profileData?.city) ||
      locationData.state_province !== toInputValue(profileData?.state_province) ||
      locationData.postal_code !== toInputValue(profileData?.postal_code) ||
      locationData.location_public !== (profileData?.location_public ?? false)
    );
  }, [locationData, profileData]);

  const profileCompletion = useMemo(() => {
    const checks = [
      editableData.first_name.trim().length > 0,
      editableData.surname.trim().length > 0,
      editableData.bio.trim().length > 0,
      editableData.city.trim().length > 0,
      editableData.state_province.trim().length > 0,
      editableData.occupation.trim().length > 0,
      locationData.address.trim().length > 0,
      locationData.postal_code.trim().length > 0,
      Boolean(profileData?.profile_picture),
    ];

    const filled = checks.filter(Boolean).length;
    return Math.round((filled / checks.length) * 100);
  }, [editableData, locationData, profileData?.profile_picture]);

  const handleLogout = () => {
    logout();
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) return;

    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be 5MB or less.",
        variant: "destructive",
      });
      event.target.value = "";
      return;
    }

    setUploading(true);
    try {
      const response = await profileService.uploadProfilePicture(file);
      if (!response.success) {
        toast({
          title: "Upload failed",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      let nextUrl = response.data?.profile_picture_url || null;
      if (!nextUrl) {
        const refreshedProfile = await profileService.getProfile();
        if (refreshedProfile.success && refreshedProfile.data) {
          const profilePayload = extractProfilePayload(refreshedProfile.data);
          nextUrl = profilePayload.profile_picture || null;
        }
      }

      const mergedProfile = {
        ...(profileData || {}),
        profile_picture: addImageCacheBuster(nextUrl),
      } as Profile;

      const cachedDataUrl = await saveProfilePictureToCache(String(user.id), file, nextUrl || mergedProfile.profile_picture);
      if (cachedDataUrl) {
        setCachedAvatarUrl(cachedDataUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setAvatarPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return newPreviewUrl;
      });

      setProfileData(mergedProfile);
      updateUser({ profile: mergedProfile as any });

      toast({
        title: "Profile picture updated",
        description: "Your new profile photo is now active.",
      });
    } catch {
      toast({
        title: "Upload failed",
        description: "Unable to upload profile picture right now.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const response = await profileService.deleteProfilePicture();
      if (!response.success) {
        toast({
          title: "Delete failed",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      const mergedProfile = {
        ...(profileData || {}),
        profile_picture: null,
      } as Profile;

      removeCachedProfilePicture(String(user.id));
      setCachedAvatarUrl(null);

      setAvatarPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) {
          URL.revokeObjectURL(prev);
        }
        return null;
      });

      setProfileData(mergedProfile);
      updateUser({ profile: mergedProfile as any });

      toast({
        title: "Profile picture removed",
        description: "Your profile picture was removed successfully.",
      });
    } catch {
      toast({
        title: "Delete failed",
        description: "Unable to remove profile picture right now.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleNamesUpdate = async () => {
    if (!user?.id) return;

    const firstName = editableData.first_name.trim();
    const surname = editableData.surname.trim();

    if (!firstName || !surname) {
      toast({
        title: "Missing fields",
        description: "First name and surname are required.",
        variant: "destructive",
      });
      return;
    }

    if (!hasNameChanges) {
      toast({
        title: "No changes",
        description: "Your names are already up to date.",
      });
      return;
    }

    setUpdatingNames(true);
    try {
      const response = await userService.updateUser(user.id, {
        first_name: firstName,
        surname,
      });

      if (!response.success) {
        toast({
          title: "Update failed",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      updateUser({ first_name: firstName, surname });
      setEditableData((prev) => ({ ...prev, first_name: firstName, surname }));

      toast({
        title: "Names updated",
        description: "Your account names were updated successfully.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update your names right now.",
        variant: "destructive",
      });
    } finally {
      setUpdatingNames(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    if (!hasProfileChanges) {
      toast({
        title: "No changes",
        description: "Profile details are already up to date.",
      });
      return;
    }

    setUpdatingProfile(true);
    const payload = {
      bio: editableData.bio,
      city: editableData.city,
      state_province: editableData.state_province,
      date_of_birth: editableData.date_of_birth,
      occupation: editableData.occupation,
      profile_public: editableData.profile_public,
    };

    try {
      const response = await profileService.updateProfile(payload);
      if (!response.success) {
        toast({
          title: "Update failed",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      const updatedProfile = {
        ...(profileData || {}),
        ...payload,
        ...extractProfilePayload(response.data),
      } as Profile;

      setProfileData(updatedProfile);
      updateUser({ profile: updatedProfile as any });

      toast({
        title: "Profile updated",
        description: "Your profile details were saved successfully.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update profile details right now.",
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleLocationUpdate = async () => {
    if (!user?.id) return;

    if (!hasLocationChanges) {
      toast({
        title: "No changes",
        description: "Location details are already up to date.",
      });
      return;
    }

    setUpdatingLocation(true);
    try {
      const response = await profileService.updateLocation(locationData);
      if (!response.success) {
        toast({
          title: "Update failed",
          description: response.message,
          variant: "destructive",
        });
        return;
      }

      const updatedProfile = {
        ...(profileData || {}),
        ...locationData,
        ...extractProfilePayload(response.data),
      } as Profile;

      setProfileData(updatedProfile);
      updateUser({ profile: updatedProfile as any });

      toast({
        title: "Location updated",
        description: "Your location and visibility preferences were saved.",
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Unable to update location right now.",
        variant: "destructive",
      });
    } finally {
      setUpdatingLocation(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-cyan-700 via-sky-700 to-emerald-700 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-4 border-white/50 shadow-lg">
                <AvatarImage
                  src={avatarPreviewUrl || cachedAvatarUrl || profileData?.profile_picture || undefined}
                  alt={`${user.first_name} ${user.surname}`}
                />
                <AvatarFallback className="text-lg font-semibold text-slate-800">
                  {getInitials(editableData.first_name, editableData.surname)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h1 className="text-2xl font-bold sm:text-3xl">
                  {editableData.first_name} {editableData.surname}
                </h1>
                <p className="text-sm text-white/90">{user.email}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge className="bg-white/20 text-white hover:bg-white/20">
                    {user.status === "active" ? "Active Account" : "Inactive Account"}
                  </Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/20">
                    {user.verification_method === "email" ? "Email Verified" : "Mobile Verified"}
                  </Badge>
                  <Badge className="bg-white/20 text-white hover:bg-white/20">Profile {profileCompletion}% complete</Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="gap-2 bg-white/15 text-white hover:bg-white/25"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                Change Photo
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureUpload}
                disabled={uploading}
              />

              <Button
                variant="secondary"
                className="gap-2 bg-white/15 text-white hover:bg-white/25"
                onClick={handleDeleteProfilePicture}
                disabled={!profileData?.profile_picture || uploading}
              >
                <Trash2 className="h-4 w-4" />
                Remove Photo
              </Button>

              <Button
                variant="secondary"
                className="gap-2 bg-white/15 text-white hover:bg-white/25"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between text-sm text-white/90">
              <span>Profile completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <Progress value={profileCompletion} className="h-2.5 bg-white/25" />
          </div>
        </div>
      </Card>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid h-auto grid-cols-3 bg-muted/80 p-1">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="location">Location & Privacy</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name Details
                </CardTitle>
                <CardDescription>Update your public account name.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={editableData.first_name}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, first_name: e.target.value }))
                      }
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="surname">Surname</Label>
                    <Input
                      id="surname"
                      value={editableData.surname}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, surname: e.target.value }))
                      }
                      placeholder="Surname"
                    />
                  </div>
                </div>

                <Button onClick={handleNamesUpdate} disabled={updatingNames || !hasNameChanges} className="w-full">
                  {updatingNames ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving names...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Names
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Profile Details
                </CardTitle>
                <CardDescription>Improve your visibility and biography information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={editableData.bio}
                    onChange={(e) =>
                      setEditableData((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    placeholder="Write a short bio"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={editableData.occupation}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, occupation: e.target.value }))
                      }
                      placeholder="Occupation"
                    />
                  </div>
                  <div>
                    <Label htmlFor="date_of_birth" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date of Birth
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={editableData.date_of_birth}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, date_of_birth: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={editableData.city}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, city: e.target.value }))
                      }
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state_province">State/Province</Label>
                    <Input
                      id="state_province"
                      value={editableData.state_province}
                      onChange={(e) =>
                        setEditableData((prev) => ({ ...prev, state_province: e.target.value }))
                      }
                      placeholder="State or province"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="profile_public" className="space-y-1">
                    <span className="text-sm font-medium">Public profile</span>
                    <p className="text-xs text-muted-foreground">Allow others to discover your profile details.</p>
                  </Label>
                  <Switch
                    id="profile_public"
                    checked={editableData.profile_public}
                    onCheckedChange={(checked) =>
                      setEditableData((prev) => ({ ...prev, profile_public: checked }))
                    }
                  />
                </div>

                <Button onClick={handleProfileUpdate} disabled={updatingProfile || !hasProfileChanges} className="w-full">
                  {updatingProfile ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving profile...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location & Visibility
              </CardTitle>
              <CardDescription>Update your address and how location is shared.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={locationData.address}
                  onChange={(e) =>
                    setLocationData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Street address"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="location-city">City</Label>
                  <Input
                    id="location-city"
                    value={locationData.city}
                    onChange={(e) =>
                      setLocationData((prev) => ({ ...prev, city: e.target.value }))
                    }
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="location-state">State/Province</Label>
                  <Input
                    id="location-state"
                    value={locationData.state_province}
                    onChange={(e) =>
                      setLocationData((prev) => ({ ...prev, state_province: e.target.value }))
                    }
                    placeholder="State or province"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={locationData.postal_code}
                  onChange={(e) =>
                    setLocationData((prev) => ({ ...prev, postal_code: e.target.value }))
                  }
                  placeholder="Postal code"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <Label htmlFor="location_public" className="space-y-1">
                  <span className="text-sm font-medium">Public location</span>
                  <p className="text-xs text-muted-foreground">Allow others to see your general location.</p>
                </Label>
                <Switch
                  id="location_public"
                  checked={locationData.location_public}
                  onCheckedChange={(checked) =>
                    setLocationData((prev) => ({ ...prev, location_public: checked }))
                  }
                />
              </div>

              <Button onClick={handleLocationUpdate} disabled={updatingLocation || !hasLocationChanges} className="w-full">
                {updatingLocation ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving location...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Location
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Status
                </CardTitle>
                <CardDescription>Read-only account and verification details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="mt-1 text-sm font-semibold">
                      {user.status === "active" ? "Active" : "Inactive"}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Verification</p>
                    <p className="mt-1 text-sm font-semibold capitalize">{user.verification_method}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Profile Visibility</p>
                  <p className="mt-1 text-sm font-semibold flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    {editableData.profile_public ? "Public" : "Private"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Account Timeline
                </CardTitle>
                <CardDescription>Key dates linked to your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Member Since</p>
                  <p className="mt-1 text-sm font-semibold">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <p className="text-xs text-muted-foreground">Last Updated</p>
                  <p className="mt-1 text-sm font-semibold">{new Date(user.updated_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your primary account contact channels.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    {user.phone_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {initializing && (
        <Card className="border-dashed">
          <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Syncing profile data...
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;
