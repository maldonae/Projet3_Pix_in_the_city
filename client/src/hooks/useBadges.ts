import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  points: number;
  is_rare: boolean;
  earned_at?: string;
}

interface UserStats {
  id: number;
  pseudo: string;
  firstname: string;
  lastname: string;
  total_points: number;
  level_name: string;
  level_color: string;
  level_icon: string;
  total_photos: number;
  total_badges: number;
  unique_artists: number;
  unique_locations: number;
  member_since: string;
}

export const useBadges = (userId: string | null) => {
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(false);

  // ✅ CORRECTION 1: URLs complètes avec base URL
  const fetchUserBadges = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/badges`,
        {
          credentials: "include",
        },
      );

      // ✅ CORRECTION 2: Vérifier le status de la réponse
      if (!response.ok) {
        console.error(
          `Error fetching badges: ${response.status} ${response.statusText}`,
        );
        return;
      }

      const badges = await response.json();
      setUserBadges(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
    }
  }, [userId]);

  const fetchUserStats = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/stats`,
        {
          credentials: "include",
        },
      );

      // ✅ CORRECTION 3: Vérifier le status de la réponse
      if (!response.ok) {
        console.error(
          `Error fetching stats: ${response.status} ${response.statusText}`,
        );
        return;
      }

      const stats = await response.json();
      setUserStats(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }, [userId]);

  const checkForNewBadges = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/check-badges`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      // ✅ CORRECTION 4: Vérifier le status avant de traiter
      if (!response.ok) {
        console.error(
          `Error checking badges: ${response.status} ${response.statusText}`,
        );
        return;
      }

      const result = await response.json();

      if (Array.isArray(result.newBadges) && result.newBadges.length > 0) {
        for (const badge of result.newBadges) {
          toast.success(
            `🏆 Nouveau badge obtenu ! ${badge.name} (+${badge.points} XP)`,
            {
              autoClose: 5000,
              position: "top-right",
            },
          );
        }

        // Recharger les badges et stats
        await fetchUserBadges();
        await fetchUserStats();
      }
    } catch (error) {
      console.error("Error checking badges:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserBadges, fetchUserStats]);

  // ✅ CORRECTION 5: Ajouter une fonction pour déclencher après upload de photo
  const onPhotoUploaded = useCallback(async () => {
    // Recharger immédiatement les stats pour voir les nouveaux points
    await fetchUserStats();
    // Puis vérifier les nouveaux badges
    await checkForNewBadges();
  }, [fetchUserStats, checkForNewBadges]);

  useEffect(() => {
    if (userId) {
      fetchUserBadges();
      fetchUserStats();
    }
  }, [userId, fetchUserBadges, fetchUserStats]);

  return {
    userBadges,
    userStats,
    loading,
    checkForNewBadges,
    onPhotoUploaded, // ✅ NOUVEAU: Exposer cette fonction
    refreshData: () => {
      fetchUserBadges();
      fetchUserStats();
    },
  };
};
