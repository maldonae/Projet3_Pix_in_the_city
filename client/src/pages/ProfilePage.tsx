import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProfilePage.css";

interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
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

// Composant BadgeCard intégré
const BadgeCard: React.FC<{ badge: Badge; isEarned: boolean }> = ({
  badge,
  isEarned,
}) => {
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      discovery: "#4CAF50",
      photography: "#2196F3",
      social: "#FF9800",
      exploration: "#9C27B0",
      special: "#F44336",
    };
    return colors[category] || "#757575";
  };

  return (
    <div
      className={`badge-card ${isEarned ? "earned" : "not-earned"} ${badge.is_rare ? "rare" : ""}`}
    >
      <div className="badge-icon-container">
        <img
          src={`/icons/badges/${badge.icon}`}
          alt={badge.name}
          className="badge-icon"
        />
        {badge.is_rare && <span className="rare-indicator">★</span>}
      </div>

      <div className="badge-info">
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>

        <div className="badge-details">
          <span
            className="badge-category"
            style={{ backgroundColor: getCategoryColor(badge.category) }}
          >
            {badge.category}
          </span>
          <span className="badge-points">+{badge.points} XP</span>
        </div>

        {isEarned && badge.earned_at && (
          <div className="earned-date">
            Obtenu le {new Date(badge.earned_at).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant UserLevel intégré
const UserLevel: React.FC<{
  currentLevel: { name: string; color: string };
  totalPoints: number;
  nextLevelPoints?: number;
}> = ({ currentLevel, totalPoints, nextLevelPoints }) => {
  const getProgressPercentage = () => {
    if (!nextLevelPoints) return 100;
    const currentLevelMin = getLevelMinPoints(currentLevel.name);
    const progress =
      ((totalPoints - currentLevelMin) / (nextLevelPoints - currentLevelMin)) *
      100;
    return Math.min(100, Math.max(0, progress));
  };

  const getLevelMinPoints = (levelName: string) => {
    const levelMins: { [key: string]: number } = {
      Novice: 0,
      Explorateur: 50,
      Chasseur: 150,
      Expert: 350,
      Maître: 700,
      Légende: 1300,
    };
    return levelMins[levelName] || 0;
  };

  return (
    <div className="user-level">
      <div className="level-header">
        <div
          className="level-badge"
          style={{ backgroundColor: currentLevel.color }}
        >
          <span className="level-name">{currentLevel.name}</span>
        </div>
        <div className="level-points">
          <span className="current-points">{totalPoints}</span>
          {nextLevelPoints && (
            <span className="next-level-points">/ {nextLevelPoints} XP</span>
          )}
        </div>
      </div>

      {nextLevelPoints && (
        <div className="progress-container">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${getProgressPercentage()}%`,
                backgroundColor: currentLevel.color,
              }}
            />
          </div>
          <span className="progress-text">
            {nextLevelPoints - totalPoints} XP pour le niveau suivant
          </span>
        </div>
      )}
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Récupérer les stats utilisateur
        const statsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${id}/stats`,
          {
            credentials: "include",
          },
        );
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }

        // Récupérer les badges de l'utilisateur
        const badgesResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${id}/badges`,
          {
            credentials: "include",
          },
        );
        if (badgesResponse.ok) {
          const badges = await badgesResponse.json();
          setUserBadges(badges);
        }

        // Récupérer tous les badges disponibles
        const allBadgesResponse = await fetch(
          "${import.meta.env.VITE_API_URL}/api/badges",
          {
            credentials: "include",
          },
        );
        if (allBadgesResponse.ok) {
          const allBadgesData = await allBadgesResponse.json();
          setAllBadges(allBadgesData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  if (loading) {
    return <div className="loading">Chargement du profil...</div>;
  }

  if (!userStats) {
    return <div className="error">Utilisateur non trouvé</div>;
  }

  const earnedBadgeIds = userBadges.map((badge) => badge.id);

  // Calculer le prochain niveau
  const getNextLevelPoints = (currentLevel: string) => {
    const levelPoints: { [key: string]: number } = {
      Novice: 50,
      Explorateur: 150,
      Chasseur: 350,
      Expert: 700,
      Maître: 1300,
      Légende: Number.POSITIVE_INFINITY,
    };
    return levelPoints[currentLevel];
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>🎨 Profil de {userStats.pseudo}</h1>
        <UserLevel
          currentLevel={{
            name: userStats.level_name,
            color: userStats.level_color,
          }}
          totalPoints={userStats.total_points}
          nextLevelPoints={getNextLevelPoints(userStats.level_name)}
        />
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <span className="stat-number">{userStats.total_photos}</span>
          <span className="stat-label">📸 Photos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{userStats.total_badges}</span>
          <span className="stat-label">🏆 Badges</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{userStats.unique_artists}</span>
          <span className="stat-label">🎨 Artistes</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{userStats.unique_locations}</span>
          <span className="stat-label">📍 Lieux</span>
        </div>
      </div>

      <div className="badges-section">
        <h2>🏆 Badges obtenus ({userStats.total_badges})</h2>
        {userBadges.length > 0 ? (
          <div className="badges-grid">
            {userBadges.map((badge) => (
              <BadgeCard
                key={`earned-${badge.id}`}
                badge={badge}
                isEarned={true}
              />
            ))}
          </div>
        ) : (
          <p className="no-badges">
            Aucun badge obtenu pour le moment. Uploadez votre première photo
            pour commencer !
          </p>
        )}

        <h2>🎯 Badges à débloquer</h2>
        <div className="badges-grid">
          {allBadges
            .filter((badge) => !earnedBadgeIds.includes(badge.id))
            .map((badge) => (
              <BadgeCard
                key={`available-${badge.id}`}
                badge={badge}
                isEarned={false}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
