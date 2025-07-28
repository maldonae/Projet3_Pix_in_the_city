import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser";
import "../../pages/Profil/Profil.css";

interface Photo {
  id: number;
  title: string;
  content: string;
  artist: string;
  picture: string;
  user_id: number;
  dateoftheday: string;
  latitude: number;
  longitude: number;
}

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

function Profil() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [userPhotos, setUserPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour obtenir le titre basé sur le niveau
  const getUserTitle = (levelName: string) => {
    const titles: { [key: string]: string } = {
      Novice: "Passant·e Curieux·se",
      Explorateur: "Explorateur·trice Urbain·e",
      Chasseur: "Chasseur·se d'Art",
      Expert: "Expert·e Street Art",
      Maître: "Maître des Rues",
      Légende: "Légende Urbaine",
    };
    return titles[levelName] || "Passant·e Curieux·se";
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      try {
        // Récupérer les stats utilisateur
        const statsResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}/stats`,
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
          `${import.meta.env.VITE_API_URL}/api/users/${user.id}/badges`,
          {
            credentials: "include",
          },
        );
        if (badgesResponse.ok) {
          const badges = await badgesResponse.json();
          setUserBadges(badges);
        }

        // Récupérer les photos de l'utilisateur
        const photosResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/api/photos`,
          {
            credentials: "include",
          },
        );
        if (photosResponse.ok) {
          const allPhotos = await photosResponse.json();
          const userPhotos = allPhotos.filter(
            (photo: Photo) => photo.user_id === user.id,
          );
          setUserPhotos(userPhotos);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="profil_div">
        <div className="loading">Chargement du profil...</div>
      </div>
    );
  }

  return (
    <div className="profil_div">
      <section className="profil_container">
        {/* Avatar de l'utilisateur */}
        <div className="user_picture">
          <img
            src={"/src/assets/images/avatar/avatar_background.png"}
            alt="user_background"
            className="user_background"
          />
          <img
            src={"/src/assets/images/icon_user.png"}
            alt="icon_user"
            className="icon_user"
          />
        </div>

        {/* Pseudo de l'utilisateur */}
        <h1 id="username">{user?.pseudo}</h1>

        {/* Niveau de l'utilisateur - DONNÉES RÉELLES */}
        <p id="user_level" aria-label="Niveau de l'utilisateur">
          {userStats?.level_name || "LEVEL 1"}
        </p>

        {/* Titre de l'utilisateur - BASÉ SUR LE NIVEAU */}
        <p id="user_title" aria-label="Titre de l'utilisateur">
          {userStats
            ? getUserTitle(userStats.level_name)
            : "Passant·e Curieux·se"}
        </p>

        <div className="user_results">
          {/* Points accumulés */}
          <p id="user_points" aria-label="Points accumulés">
            Points
          </p>
          {/* Badges accumulés */}
          <p id="user_badges_label" aria-label="badges accumulés">
            Badges obtenus
          </p>
        </div>

        <div className="user_results">
          {/* Points accumulés - DONNÉES RÉELLES */}
          <p id="user_points_number" aria-label="Points accumulés">
            {userStats?.total_points || 0} XP
          </p>
          {/* Badges accumulés - DONNÉES RÉELLES */}
          <p id="user_badges_number" aria-label="badges accumulés">
            {userBadges.length > 0 ? userBadges.map(() => "🏆").join("") : "🎯"}
          </p>
        </div>

        {/* BOUTON CLASSEMENT */}
        <div className="action-buttons">
          <button
            type="button"
            className="btn-classement"
            onClick={() => navigate("/classement")}
          >
            🏆 Voir le classement
          </button>
        </div>

        {/* NOUVELLE SECTION - BADGES DÉTAILLÉS */}
        {userBadges.length > 0 && (
          <section aria-label="user-badges" className="user-badges-section">
            <h2>🏆 Mes Badges ({userBadges.length})</h2>
            <div className="badges-container">
              {userBadges.slice(0, 6).map((badge) => (
                <div
                  key={badge.id}
                  className={`badge-item ${badge.is_rare ? "rare" : ""}`}
                  title={badge.description}
                >
                  {badge.is_rare ? "⭐" : "🏆"} {badge.name}
                </div>
              ))}
              {userBadges.length > 6 && (
                <div className="badge-more">
                  +{userBadges.length - 6} autres
                </div>
              )}
            </div>
          </section>
        )}

        {/* NOUVELLE SECTION - STATS RAPIDES */}
        <div className="quick-stats">
          <div className="stat-box">
            <span className="stat-number">
              📸 {userStats?.total_photos || 0}
            </span>
            <span className="stat-label">Photos</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">
              🎨 {userStats?.unique_artists || 0}
            </span>
            <span className="stat-label">Artistes</span>
          </div>
        </div>

        {/* Contributions de l'utilisateur - DONNÉES RÉELLES */}
        <section
          aria-label="user-contributions"
          className="contributions-section"
        >
          <h2 id="user-contributions">Contributions ({userPhotos.length})</h2>
          {userPhotos.length > 0 ? (
            <ul className="contributions-list">
              {userPhotos.slice(0, 3).map((photo) => (
                <li key={photo.id}>
                  <figure>
                    <img
                      src={`${import.meta.env.VITE_API_URL}/photos/${photo.picture}`}
                      alt={`Contribution : ${photo.title}`}
                      className="contribution-photo"
                      onError={(e) => {
                        // Image de fallback si l'image ne charge pas
                        (e.target as HTMLImageElement).src =
                          "/src/assets/images/essai_photo.webp";
                      }}
                    />
                    <figcaption>{photo.title || "Sans titre"}</figcaption>
                  </figure>
                </li>
              ))}
              {userPhotos.length > 3 && (
                <li>
                  <div className="more-contributions">
                    +{userPhotos.length - 3} autres photos
                  </div>
                </li>
              )}
            </ul>
          ) : (
            <div className="no-contributions">
              Aucune contribution pour le moment.
              <br />
              <a href="/post_a_photo">Ajoutez votre première œuvre !</a>
            </div>
          )}
        </section>

        {/* Paramètres et modification du profil */}
        <section aria-label="user-settings">
          <button
            type="button"
            onClick={() => navigate(`/modifier_mon_profil/${user?.id}`)}
            className="btn-edit-profile"
          >
            <img
              src={"/src/assets/images/repair.png"}
              alt="repair_icon"
              className="repair_icon"
            />
            Modifier mon profil
          </button>
        </section>
      </section>
    </div>
  );
}

export default Profil;
