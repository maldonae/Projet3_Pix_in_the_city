import React from 'react';
import './BadgeCard.css';

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

interface BadgeCardProps {
  badge: Badge;
  isEarned?: boolean;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, isEarned = false }) => {
  const getCategoryColor = (category: string) => {
    const colors = {
      discovery: '#4CAF50',
      photography: '#2196F3',
      social: '#FF9800',
      exploration: '#9C27B0',
      special: '#F44336'
    };
    return colors[category] || '#757575';
  };

  return (
    <div className={`badge-card ${isEarned ? 'earned' : 'not-earned'} ${badge.is_rare ? 'rare' : ''}`}>
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
            Obtenu le {new Date(badge.earned_at).toLocaleDateString('fr-FR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
