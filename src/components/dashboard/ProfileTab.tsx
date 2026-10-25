import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin, Languages, Camera, Save, X, Bell, Shield } from "lucide-react";

interface NotificationPreferences {
  community_updates: boolean;
  new_members: boolean;
  weekly_digest: boolean;
  marketing: boolean;
}

type ProfileVisibility = 'public' | 'logged_in' | 'private';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  phone: string | null;
  primary_city: string | null;
  languages: string[] | null;
  notification_preferences: NotificationPreferences | null;
  profile_visibility: ProfileVisibility;
}

const VISIBILITY_OPTIONS = [
  {
    value: "public" as ProfileVisibility,
    label: "Public",
    description: "Anyone can see your profile",
  },
  {
    value: "logged_in" as ProfileVisibility,
    label: "Logged-in Users",
    description: "Only users who are signed in can see your profile",
  },
  {
    value: "private" as ProfileVisibility,
    label: "Private",
    description: "Only you can see your profile",
  },
];

interface ProfileTabProps {
  profile: Profile | null;
  loading: boolean;
  onProfileUpdate: () => void;
}

const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  community_updates: true,
  new_members: false,
  weekly_digest: true,
  marketing: false,
};

const NOTIFICATION_OPTIONS = [
  {
    key: "community_updates" as keyof NotificationPreferences,
    label: "Community Updates",
    description: "Get notified when communities you follow post updates or announcements",
  },
  {
    key: "new_members" as keyof NotificationPreferences,
    label: "New Member Alerts",
    description: "Receive notifications when new members join your communities",
  },
  {
    key: "weekly_digest" as keyof NotificationPreferences,
    label: "Weekly Digest",
    description: "Receive a weekly summary of activity from your saved communities",
  },
  {
    key: "marketing" as keyof NotificationPreferences,
    label: "Product Updates & Tips",
    description: "Hear about new features and tips to get the most out of Nearloom",
  },
];

const AVAILABLE_LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "mr", name: "Marathi" },
  { code: "bn", name: "Bengali" },
  { code: "gu", name: "Gujarati" },
  { code: "pa", name: "Punjabi" },
];

export const ProfileTab = ({ profile, loading, onProfileUpdate }: ProfileTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Profile>>({});

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      primary_city: profile?.primary_city || "",
      languages: profile?.languages || ["en"],
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          primary_city: formData.primary_city,
          languages: formData.languages,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditing(false);
      onProfileUpdate();
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleLanguage = (code: string) => {
    const current = formData.languages || [];
    if (current.includes(code)) {
      setFormData({ ...formData, languages: current.filter((l) => l !== code) });
    } else {
      setFormData({ ...formData, languages: [...current, code] });
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getLanguageName = (code: string) => {
    return AVAILABLE_LANGUAGES.find((l) => l.code === code)?.name || code;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card className="p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/10">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                {getInitials(profile?.full_name)}
              </AvatarFallback>
            </Avatar>
            <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-bold">{profile?.full_name || "User"}</h2>
            <p className="text-muted-foreground">{profile?.email}</p>
            {profile?.primary_city && (
              <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{profile.primary_city}</span>
              </div>
            )}
          </div>
          <div>
            {!isEditing ? (
              <Button onClick={handleEdit}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Personal Information</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            {isEditing ? (
              <Input
                value={formData.full_name || ""}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-foreground py-2">{profile?.full_name || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email
            </Label>
            <p className="text-foreground py-2">{profile?.email || "Not set"}</p>
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone
            </Label>
            {isEditing ? (
              <Input
                value={formData.phone || ""}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
              />
            ) : (
              <p className="text-foreground py-2">{profile?.phone || "Not set"}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Primary City
            </Label>
            {isEditing ? (
              <Input
                value={formData.primary_city || ""}
                onChange={(e) => setFormData({ ...formData, primary_city: e.target.value })}
                placeholder="Enter your city"
              />
            ) : (
              <p className="text-foreground py-2">{profile?.primary_city || "Not set"}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Language Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Languages className="h-5 w-5" />
          Language Preferences
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select languages you're comfortable with for community interactions
        </p>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            AVAILABLE_LANGUAGES.map((lang) => (
              <Badge
                key={lang.code}
                variant={formData.languages?.includes(lang.code) ? "default" : "outline"}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => toggleLanguage(lang.code)}
              >
                {lang.name}
              </Badge>
            ))
          ) : (
            profile?.languages?.map((code) => (
              <Badge key={code} variant="secondary">
                {getLanguageName(code)}
              </Badge>
            )) || <span className="text-muted-foreground">No languages selected</span>
          )}
        </div>
      </Card>

      {/* Email Notification Preferences */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Email Notifications
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose which email notifications you'd like to receive
        </p>
        <div className="space-y-4">
          {NOTIFICATION_OPTIONS.map((option) => {
            const currentPrefs = profile?.notification_preferences || DEFAULT_NOTIFICATION_PREFERENCES;
            const isEnabled = currentPrefs[option.key];

            return (
              <div
                key={option.key}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex-1 pr-4">
                  <p className="font-medium">{option.label}</p>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
                <Switch
                  checked={isEnabled}
                  onCheckedChange={async (checked) => {
                    if (!profile?.id) return;
                    
                    const updatedPrefs = {
                      ...currentPrefs,
                      [option.key]: checked,
                    };

                    try {
                      const { error } = await supabase
                        .from("profiles")
                        .update({
                          notification_preferences: updatedPrefs,
                          updated_at: new Date().toISOString(),
                        })
                        .eq("id", profile.id);

                      if (error) throw error;
                      
                      toast.success(`${option.label} ${checked ? "enabled" : "disabled"}`);
                      onProfileUpdate();
                    } catch (error: unknown) {
                      console.error("Notification preference update failed", error);
                      toast.error("Failed to update notification preferences");
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Privacy Settings
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Control who can see your profile information
        </p>
        <RadioGroup
          value={profile?.profile_visibility || "public"}
          onValueChange={async (value: ProfileVisibility) => {
            if (!profile?.id) return;

            try {
              const { error } = await supabase
                .from("profiles")
                .update({
                  profile_visibility: value,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", profile.id);

              if (error) throw error;

              toast.success(`Profile visibility set to ${VISIBILITY_OPTIONS.find(o => o.value === value)?.label}`);
              onProfileUpdate();
            } catch (error: unknown) {
              console.error("Profile visibility update failed", error);
              toast.error("Failed to update privacy settings");
            }
          }}
          className="space-y-3"
        >
          {VISIBILITY_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => {
                const radio = document.querySelector(`input[value="${option.value}"]`) as HTMLInputElement;
                radio?.click();
              }}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                <p className="font-medium">{option.label}</p>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      {/* Account Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive" size="sm" disabled>
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
