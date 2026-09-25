import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, router } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppButton from '@/components/AppButton';
import { COLORS } from '@/constants/colors';
import { useAuth, signOut } from '@/lib/auth';
import { getProfile, type Profile } from '@/lib/profiles';


export default function ProfileScreen() {
  const { user } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const result = await getProfile(user.id);
      setProfile(result);
    } catch (error) {
      console.error(
        'Failed to load profile:',
        error
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleSignOut = async () => {
    setLoggingOut(true);

    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error(
        'Sign out failed:',
        error
      );
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={COLORS.primary}
        />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="person-circle-outline"
          size={72}
          color={COLORS.primary}
        />

        <Text style={styles.title}>
          Profile
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Full Name
        </Text>

        <Text style={styles.value}>
          {profile?.full_name || 'Not set'}
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {profile?.email ||
            user?.email ||
            'Not available'}
        </Text>

        <Text style={styles.label}>
          Role
        </Text>

        <Text style={styles.value}>
          {profile?.role === 'teacher'
            ? 'Teacher'
            : 'Student'}
        </Text>
      </View>

      <View style={styles.buttons}>
        <AppButton
          title="Sign Out"
          icon="log-out-outline"
          onPress={handleSignOut}
          disabled={loggingOut}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    paddingTop: 32,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  header: {
    alignItems: 'center',
    marginBottom: 24,
  },

  title: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },

  buttons: {
    marginTop: 24,
  },
});
