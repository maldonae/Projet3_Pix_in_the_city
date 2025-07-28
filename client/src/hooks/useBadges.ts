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

  const fetchUserBadges = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/users/${userId}/badges`, {
        credentials: "include",
      });
      const badges = await response.json();
      setUserBadges(badges);
    } catch (error) {
      console.error("Error fetching user badges:", error);
    }
  }, [userId]);

  const fetchUserStats = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await fetch(`/api/users/${userId}/stats`, {
        credentials: "include",
      });
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
      const response = await fetch(`/api/users/${userId}/check-badges`, {
        method: "POST",
        credentials: "include",
      });
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
    refreshData: () => {
      fetchUserBadges();
      fetchUserStats();
    },
  };
};
