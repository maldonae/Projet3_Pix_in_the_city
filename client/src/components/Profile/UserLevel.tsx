import type React from "react";
import "./UserLevel.css";

interface Level {
  name: string;
  color: string;
}

interface UserLevelProps {
  currentLevel: Level;
  totalPoints: number;
  nextLevelPoints?: number;
}

const UserLevel: React.FC<UserLevelProps> = ({
  currentLevel,
  totalPoints,
  nextLevelPoints,
}) => {
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

export default UserLevel;
