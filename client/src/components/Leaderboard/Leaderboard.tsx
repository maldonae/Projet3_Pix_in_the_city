import { useEffect, useState } from "react";
import "./Leaderboard.css";

interface LeaderboardEntry {
  id: number;
  pseudo: string;
  total_points: number;
  level_name: string;
  level_color: string;
  total_badges: number;
  total_photos: number;
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/leaderboard?limit=20`,
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        setLeaderboard(data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className="loading">Chargement du classement...</div>;
  }

  return (
    <div className="leaderboard">
      <h2>🏆 Classement des Street Art Hunters</h2>
      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <div
            key={entry.id}
            className={`leaderboard-entry ${index < 3 ? "podium" : ""}`}
          >
            <div className="rank">
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
              {index > 2 && `#${index + 1}`}
            </div>
            <div className="user-info">
              <span className="pseudo">{entry.pseudo}</span>
              <div
                className="level-badge"
                style={{ backgroundColor: entry.level_color }}
              >
                {entry.level_name}
              </div>
            </div>
            <div className="stats">
              <span className="points">{entry.total_points} XP</span>
              <div className="mini-stats">
                <span>{entry.total_photos} photos</span>
                <span>{entry.total_badges} badges</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
