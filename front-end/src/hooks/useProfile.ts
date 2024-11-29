import { useState, useCallback } from 'react';
import { ProfileService } from '../services/profileService';
import { ProfileData } from '../types/profile';

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = useCallback(async (profileData: ProfileData, recipientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ProfileService.createProfile(profileData, recipientId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const profile = await ProfileService.getProfile(id);
      return profile;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (id: string, profileData: ProfileData, recipientId: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await ProfileService.updateProfile(id, profileData, recipientId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProfile = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await ProfileService.deleteProfile(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createProfile,
    getProfile,
    updateProfile,
    deleteProfile,
  };
};
