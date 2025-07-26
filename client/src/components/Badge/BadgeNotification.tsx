import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import './BadgeNotification.css';

interface BadgeNotificationProps {
  badges: any[];
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({ badges, onClose }) => {
  useEffect(() => {
    if (badges.length > 0) {
      badges.forEach(badge => {
        toast.success(
          <div className="badge-toast">
            <div className="badge-toast-icon">
              <img src={`/icons/badges/${badge.icon}`} alt={badge.name} />
            </div>
            <div className="badge-toast-content">
              <strong>Nouveau badge obtenu !</strong>
              <p>{badge.name}</p>
              <small>+{badge.points} XP</small>
            </div>
          </div>,
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      });
      onClose();
    }
  }, [badges, onClose]);

  return null;
};

export default BadgeNotification;
