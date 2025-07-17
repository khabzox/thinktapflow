import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export interface UserProfile {
  id: string;
  full_name: string;
  username: string;
  email: string;
  bio: string;
  avatar_url: string;
}

export interface UserSettings {
  email_notifications: boolean;
  content_updates: boolean;
  marketing_updates: boolean;
  two_factor_enabled: boolean;
}

export function useUserSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [formProfile, setFormProfile] = useState<UserProfile | null>(null);
  const [formSettings, setFormSettings] = useState<UserSettings | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  // Update form data when profile/settings change
  useEffect(() => {
    if (profile) setFormProfile(profile);
    if (settings) setFormSettings(settings);
  }, [profile, settings]);

  const fetchUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      setUserId(user.id);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create one
        if (profileError.code === "PGRST116") {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([{ id: user.id, email: user.email }])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
        } else {
          throw profileError;
        }
      } else {
        setProfile(profileData);
      }

      const { data: settingsData, error: settingsError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (settingsError) {
        // If settings don't exist, create them
        if (settingsError.code === "PGRST116") {
          const { data: newSettings, error: createError } = await supabase
            .from("user_settings")
            .insert([{ user_id: user.id }])
            .select()
            .single();

          if (createError) throw createError;
          setSettings(newSettings);
        } else {
          throw settingsError;
        }
      } else {
        setSettings(settingsData);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error loading user data");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setUploadingAvatar(true);
      if (!userId) throw new Error("No user ID found");

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File size must be less than 2MB");
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        throw new Error("File must be an image");
      }

      // Create a unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { data, error } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success("Avatar updated successfully");
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error updating avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleProfileChange = (updates: Partial<UserProfile>) => {
    if (!formProfile) return;
    setFormProfile({ ...formProfile, ...updates });
  };

  const handleSettingsChange = (updates: Partial<UserSettings>) => {
    if (!formSettings) return;
    setFormSettings({ ...formSettings, ...updates });
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setSaving(true);

      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: profile?.email || "",
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Current password is incorrect");
      }

      // Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      toast.success("Password updated successfully");
      return true;
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Error updating password");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      if (!userId || !formProfile) throw new Error("No user data found");

      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (checkError) {
        // If profile doesn't exist, create it
        if (checkError.code === "PGRST116") {
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert([
              {
                id: userId,
                full_name: formProfile.full_name,
                username: formProfile.username,
                email: formProfile.email,
                bio: formProfile.bio,
                avatar_url: formProfile.avatar_url,
              },
            ])
            .select()
            .single();

          if (createError) throw createError;
          setProfile(newProfile);
          toast.success("Profile created successfully");
          return;
        }
        throw checkError;
      }

      // If profile exists, update it
      const { data, error } = await supabase
        .from("profiles")
        .update({
          full_name: formProfile.full_name,
          username: formProfile.username,
          email: formProfile.email,
          bio: formProfile.bio,
          avatar_url: formProfile.avatar_url,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating profile");
      // Revert form data to current profile
      setFormProfile(profile);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      if (!userId || !formSettings) throw new Error("No user data found");

      // First check if settings exist
      const { data: existingSettings, error: checkError } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (checkError) {
        // If settings don't exist, create them
        if (checkError.code === "PGRST116") {
          const { data: newSettings, error: createError } = await supabase
            .from("user_settings")
            .insert([{ user_id: userId, ...formSettings }])
            .select()
            .single();

          if (createError) throw createError;
          setSettings(newSettings);
          toast.success("Settings created successfully");
          return;
        }
        throw checkError;
      }

      // If settings exist, update them
      const { data, error } = await supabase
        .from("user_settings")
        .update({ ...formSettings, updated_at: new Date().toISOString() })
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      setSettings(data);
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating settings");
      // Revert form data to current settings
      setFormSettings(settings);
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    profile: formProfile,
    settings: formSettings,
    uploadingAvatar,
    handleProfileChange,
    handleSettingsChange,
    saveProfile,
    saveSettings,
    updatePassword,
    uploadAvatar,
  };
}
