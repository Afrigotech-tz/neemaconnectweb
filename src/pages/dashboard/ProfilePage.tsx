import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { profileService } from "@/services/profileService";
import { userService } from "@/services/userService";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  Upload,
  Trash2,
  MapPin,
  User,
  LogOut,
  Save,
  Calendar,
  Briefcase,
} from "lucide-react";

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingNames, setUpdatingNames] = useState(false);
  const [profileData, setProfileData] = useState(user?.profile || null);
  const [locationData, setLocationData] = useState({
    address: user?.profile?.address || "",
    postal_code: user?.profile?.postal_code || "",
    location_public: user?.profile?.location_public || false,
  });
  const [editableData, setEditableData] = useState({
    first_name: user?.first_name || "",
    surname: user?.surname || "",
    bio: user?.profile?.bio || "",
    city: user?.profile?.city || "",
    state_province: user?.profile?.state_province || "",
    date_of_birth: user?.profile?.date_of_birth || "",
    occupation: user?.profile?.occupation || "",
    profile_public: user?.profile?.profile_public ?? true,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.profile) {
      setProfileData(user.profile);
      setLocationData({
        address: user.profile.address,
        postal_code: user.profile.postal_code,
        location_public: user.profile.location_public,
      });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user?.id) return;

    setUploading(true);
    try {
      const response = await profileService.uploadProfilePicture(user.id, file);
      if (response.success) {
        toast({
          title: "Success",
          description: "Profile picture updated successfully",
        });
        // Update user data in context
        if (response.data?.profile_picture_url) {
          updateUser({
            profile: {
              ...user.profile,
              profile_picture: response.data.profile_picture_url,
            } as any,
          });
        }
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProfilePicture = async () => {
    if (!user?.id) return;

    setUploading(true);
    try {
      const response = await profileService.deleteProfilePicture(user.id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Profile picture removed successfully",
        });
        // Update user data in context
        updateUser({
          profile: {
            ...user.profile,
            profile_picture: null,
          } as any,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleLocationUpdate = async () => {
    setLoading(true);
    try {
      const response = await profileService.updateLocation(locationData);
      if (response.success) {
        toast({
          title: "Success",
          description: "Location updated successfully",
        });
        // Update user data in context
        updateUser({
          profile: {
            ...user.profile,
            address: locationData.address,
            postal_code: locationData.postal_code,
            location_public: locationData.location_public,
          } as any,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNamesUpdate = async () => {
    if (!user?.id) return;

    setUpdatingNames(true);
    try {
      const response = await userService.updateUser(user.id, {
        first_name: editableData.first_name,
        surname: editableData.surname,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Names updated successfully",
        });
        // Update user data in context
        updateUser({
          first_name: editableData.first_name,
          surname: editableData.surname,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update names",
        variant: "destructive",
      });
    } finally {
      setUpdatingNames(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!user?.id) return;

    setUpdatingProfile(true);
    try {
      const response = await profileService.updateProfile(user.id, {
        bio: editableData.bio,
        city: editableData.city,
        state_province: editableData.state_province,
        date_of_birth: editableData.date_of_birth,
        occupation: editableData.occupation,
        profile_public: editableData.profile_public,
      });
      if (response.success) {
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
        // Update user data in context
        updateUser({
          profile: {
            ...user.profile,
            bio: editableData.bio,
            city: editableData.city,
            state_province: editableData.state_province,
            date_of_birth: editableData.date_of_birth,
            occupation: editableData.occupation,
            profile_public: editableData.profile_public,
          } as any,
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Your personal account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage
                    src={profileData?.profile_picture || undefined}
                    alt={`${user.first_name} ${user.surname}`}
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(user.first_name, user.surname)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Label htmlFor="profile-picture" className="cursor-pointer">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4" />
                          {uploading ? "Uploading..." : "Change Photo"}
                        </span>
                      </Button>
                      <Input
                        id="profile-picture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePictureUpload}
                        disabled={uploading}
                      />
                    </Label>
                    {profileData?.profile_picture && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={handleDeleteProfilePicture}
                        disabled={uploading}
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </Button>
                    )}
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={editableData.first_name}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        first_name: e.target.value,
                      })
                    }
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    value={editableData.surname}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        surname: e.target.value,
                      })
                    }
                    placeholder="Enter your surname"
                  />
                </div>
              </div>

              <Button
                onClick={handleNamesUpdate}
                disabled={updatingNames}
                className="w-full mb-4"
                variant="outline"
              >
                {updatingNames ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating Names...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Names
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email} disabled />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={user.phone_number} disabled />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={editableData.bio}
                  onChange={(e) =>
                    setEditableData({ ...editableData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={editableData.city}
                    onChange={(e) =>
                      setEditableData({ ...editableData, city: e.target.value })
                    }
                    placeholder="Enter your city"
                  />
                </div>
                <div>
                  <Label htmlFor="state_province">State/Province</Label>
                  <Input
                    id="state_province"
                    value={editableData.state_province}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        state_province: e.target.value,
                      })
                    }
                    placeholder="Enter your state/province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="date_of_birth"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="h-4 w-4" />
                    Date of Birth
                  </Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={editableData.date_of_birth}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label
                    htmlFor="occupation"
                    className="flex items-center gap-2"
                  >
                    <Briefcase className="h-4 w-4" />
                    Occupation
                  </Label>
                  <Input
                    id="occupation"
                    value={editableData.occupation}
                    onChange={(e) =>
                      setEditableData({
                        ...editableData,
                        occupation: e.target.value,
                      })
                    }
                    placeholder="Enter your occupation"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="profile_public"
                  className="flex flex-col space-y-1"
                >
                  <span>Make profile public</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Allow others to view your profile
                  </span>
                </Label>
                <Switch
                  id="profile_public"
                  checked={editableData.profile_public}
                  onCheckedChange={(checked) =>
                    setEditableData({
                      ...editableData,
                      profile_public: checked,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleProfileUpdate}
                disabled={updatingProfile}
                className="w-full"
              >
                {updatingProfile ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating Profile...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
              <CardDescription>
                Update your address and location preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={locationData.address}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter your address"
                />
              </div>

              <div>
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input
                  id="postal_code"
                  value={locationData.postal_code}
                  onChange={(e) =>
                    setLocationData({
                      ...locationData,
                      postal_code: e.target.value,
                    })
                  }
                  placeholder="Enter your postal code"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="location_public"
                  className="flex flex-col space-y-1"
                >
                  <span>Make location public</span>
                  <span className="text-sm text-muted-foreground font-normal">
                    Allow others to see your location
                  </span>
                </Label>
                <Switch
                  id="location_public"
                  checked={locationData.location_public}
                  onCheckedChange={(checked) =>
                    setLocationData({
                      ...locationData,
                      location_public: checked,
                    })
                  }
                />
              </div>

              <Button
                onClick={handleLocationUpdate}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Location"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Your account status and verification details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Account Status</Label>
                <Input
                  value={user.status === "active" ? "Active" : "Inactive"}
                  disabled
                  className={
                    user.status === "active"
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                />
              </div>
              <div>
                <Label>Verification Method</Label>
                <Input
                  value={
                    user.verification_method === "email" ? "Email" : "Mobile"
                  }
                  disabled
                />
              </div>
              <div>
                <Label>Member Since</Label>
                <Input
                  value={new Date(user.created_at).toLocaleDateString()}
                  disabled
                />
              </div>
              <div>
                <Label>Last Updated</Label>
                <Input
                  value={new Date(user.updated_at).toLocaleDateString()}
                  disabled
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
