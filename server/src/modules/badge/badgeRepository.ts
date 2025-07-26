// server/src/modules/badge/badgeRepository.ts
import client from "../../../database/client";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  condition_type: string;
  condition_value: number;
  points: number;
  is_rare: boolean;
  created_at: string;
}

interface UserBadge extends Badge {
  earned_at: string;
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

interface LeaderboardEntry {
  id: number;
  pseudo: string;
  total_points: number;
  level_name: string;
  level_color: string;
  total_badges: number;
  total_photos: number;
}

const badgeRepository = {
  // Récupérer tous les badges disponibles
  async readAll(): Promise<Badge[]> {
    const [badges] = await client.query(
      "SELECT * FROM badge ORDER BY category, condition_value"
    );
    return badges as Badge[];
  },

  // Récupérer un badge spécifique
  async read(id: number): Promise<Badge | null> {
    const [badges] = await client.query(
      "SELECT * FROM badge WHERE id = ?",
      [id]
    );
    return badges.length > 0 ? (badges[0] as Badge) : null;
  },

  // Récupérer les badges d'un utilisateur
  async readUserBadges(userId: number): Promise<UserBadge[]> {
    const [userBadges] = await client.query(
      `SELECT b.*, ub.earned_at 
       FROM user_badge ub 
       JOIN badge b ON ub.badge_id = b.id 
       WHERE ub.user_id = ? 
       ORDER BY ub.earned_at DESC`,
      [userId]
    );
    return userBadges as UserBadge[];
  },

  // Récupérer les badges que l'utilisateur n'a pas encore
  async readAvailableBadges(userId: number): Promise<Badge[]> {
    const [availableBadges] = await client.query(
      `SELECT b.* FROM badge b 
       WHERE b.id NOT IN (
         SELECT ub.badge_id FROM user_badge ub WHERE ub.user_id = ?
       )`,
      [userId]
    );
    return availableBadges as Badge[];
  },

  // Attribuer un badge à un utilisateur
  async awardBadge(userId: number, badgeId: number): Promise<void> {
    await client.query(
      "INSERT INTO user_badge (user_id, badge_id) VALUES (?, ?)",
      [userId, badgeId]
    );
  },

  // Vérifier si un utilisateur a un badge
  async userHasBadge(userId: number, badgeId: number): Promise<boolean> {
    const [result] = await client.query(
      "SELECT COUNT(*) as count FROM user_badge WHERE user_id = ? AND badge_id = ?",
      [userId, badgeId]
    );
    return result[0].count > 0;
  },

  // Récupérer les statistiques d'un utilisateur
  async readUserStats(userId: number): Promise<UserStats | null> {
    const [stats] = await client.query(
      "SELECT * FROM user_stats WHERE id = ?",
      [userId]
    );
    return stats.length > 0 ? (stats[0] as UserStats) : null;
  },

  // Récupérer les statistiques brutes pour calculs de badges
  async readUserStatistics(userId: number): Promise<any> {
    const [photoStats] = await client.query(
      `SELECT 
        COUNT(*) as photo_count,
        COUNT(DISTINCT artist) as unique_artists,
        COUNT(DISTINCT CONCAT(
          CASE 
            WHEN latitude BETWEEN 45.754 AND 45.764 AND longitude BETWEEN 4.830 AND 4.850 THEN '69001'
            WHEN latitude BETWEEN 45.750 AND 45.760 AND longitude BETWEEN 4.825 AND 4.845 THEN '69002'
            WHEN latitude BETWEEN 45.745 AND 45.755 AND longitude BETWEEN 4.840 AND 4.860 THEN '69003'
            WHEN latitude BETWEEN 45.765 AND 45.775 AND longitude BETWEEN 4.835 AND 4.855 THEN '69004'
            WHEN latitude BETWEEN 45.755 AND 45.765 AND longitude BETWEEN 4.845 AND 4.865 THEN '69005'
            WHEN latitude BETWEEN 45.760 AND 45.770 AND longitude BETWEEN 4.850 AND 4.870 THEN '69006'
            WHEN latitude BETWEEN 45.740 AND 45.750 AND longitude BETWEEN 4.840 AND 4.860 THEN '69007'
            WHEN latitude BETWEEN 45.735 AND 45.745 AND longitude BETWEEN 4.855 AND 4.875 THEN '69008'
            WHEN latitude BETWEEN 45.770 AND 45.780 AND longitude BETWEEN 4.800 AND 4.820 THEN '69009'
            ELSE 'autre'
          END
        )) as unique_locations
       FROM photo 
       WHERE user_id = ?`,
      [userId]
    );

    const [userInfo] = await client.query(
      `SELECT DATEDIFF(NOW(), created_at) as days_since_registration 
       FROM user 
       WHERE id = ?`,
      [userId]
    );

    return {
      photo_count: photoStats[0]?.photo_count || 0,
      unique_artists: photoStats[0]?.unique_artists || 0,
      unique_locations: photoStats[0]?.unique_locations || 0,
      days_since_registration: userInfo[0]?.days_since_registration || 0
    };
  },

  // Ajouter des points à un utilisateur
  async addPoints(userId: number, points: number): Promise<void> {
    await client.query(
      "UPDATE user SET total_points = total_points + ? WHERE id = ?",
      [points, userId]
    );
  },

  // Récupérer les points actuels d'un utilisateur
  async getUserPoints(userId: number): Promise<number> {
    const [result] = await client.query(
      "SELECT total_points FROM user WHERE id = ?",
      [userId]
    );
    return result[0]?.total_points || 0;
  },

  // Mettre à jour le niveau d'un utilisateur
  async updateUserLevel(userId: number, levelId: number): Promise<void> {
    await client.query(
      "UPDATE user SET current_level_id = ? WHERE id = ?",
      [levelId, userId]
    );
  },

  // Récupérer le niveau approprié pour un nombre de points
  async getLevelForPoints(points: number): Promise<any> {
    const [level] = await client.query(
      "SELECT id FROM level WHERE ? BETWEEN min_points AND max_points",
      [points]
    );
    return level[0] || null;
  },

  // Récupérer le leaderboard
  async readLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const [leaderboard] = await client.query(
      `SELECT 
        u.id, u.pseudo, u.total_points,
        l.name as level_name, l.color as level_color,
        COUNT(DISTINCT ub.badge_id) as total_badges,
        COUNT(DISTINCT p.id) as total_photos
       FROM user u
       LEFT JOIN level l ON u.current_level_id = l.id
       LEFT JOIN user_badge ub ON u.id = ub.user_id
       LEFT JOIN photo p ON u.id = p.user_id
       GROUP BY u.id, u.pseudo, u.total_points, l.name, l.color
       ORDER BY u.total_points DESC
       LIMIT ?`,
      [limit]
    );
    return leaderboard as LeaderboardEntry[];
  }
};

export default badgeRepository;
