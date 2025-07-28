import { useEffect } from "react";
import { toast } from "react-toastify";
import "./BadgeNotification.css";

// Type pour un badge
interface Badge {
  id: number;
  name: string;
  icon: string;
  points: number;
  is_rare?: boolean;
}

interface BadgeNotificationProps {
  badges: Badge[]; // ✅ Type spécifique au lieu de any[]
  onClose: () => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({
  badges,
  onClose,
}) => {
  useEffect(() => {
    if (badges.length > 0) {
      // ✅ for...of au lieu de forEach (recommandation Biome)
      for (const badge of badges) {
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
          },
        );
      }
      onClose();
    }
  }, [badges, onClose]);

  return null;
};

export default BadgeNotification;
