import badgeRepository from "./badgeRepository";

interface BadgeCondition {
  id: number;
  condition_type: string;
  condition_value: number;
  points: number;
}

// ✅ CORRECTION: Utiliser le type exact du repository
type UserStatistics = Awaited<
  ReturnType<typeof badgeRepository.readUserStatistics>
>;

// ✅ SUPPRESSION de l'export nommé - seulement l'export par défaut
const badgeService = {
  // Vérifier et attribuer les badges à un utilisateur
  async checkAndAwardBadges(userId: number): Promise<BadgeCondition[]> {
    const newBadges: BadgeCondition[] = [];
    // Récupérer les statistiques de l'utilisateur
    const userStats = await badgeRepository.readUserStatistics(userId);
    // Récupérer tous les badges que l'utilisateur n'a pas encore
    const availableBadges = await badgeRepository.readAvailableBadges(userId);
    // Vérifier chaque badge disponible
    for (const badge of availableBadges as BadgeCondition[]) {
      if (await this.checkBadgeCondition(badge, userStats, userId)) {
        await this.awardBadgeWithPoints(userId, badge.id, badge.points);
        newBadges.push(badge);
      }
    }
    // Mettre à jour le niveau de l'utilisateur
    await this.updateUserLevel(userId);
    return newBadges;
  },

  // Vérifier si un badge doit être attribué
  async checkBadgeCondition(
    badge: BadgeCondition,
    userStats: UserStatistics,
    userId: number,
  ): Promise<boolean> {
    switch (badge.condition_type) {
      case "photo_count":
        return userStats.photo_count >= badge.condition_value;
      case "artist_count":
        return userStats.unique_artists >= badge.condition_value;
      case "location_count":
        return userStats.unique_locations >= badge.condition_value;
      case "special_action":
        // Pour les badges spéciaux comme "Vétéran"
        if (badge.condition_value === 365) {
          // ✅ SOLUTION: Récupérer les jours depuis l'inscription
          const daysSinceRegistration =
            await badgeRepository.getDaysSinceRegistration(userId);

          return daysSinceRegistration >= 365;
        }
        return false;
      default:
        return false;
    }
  },

  // Attribuer un badge et ses points (transaction)
  async awardBadgeWithPoints(
    userId: number,
    badgeId: number,
    points: number,
  ): Promise<void> {
    // ✅ CORRECTION - Typo "hasbadge" → "hasBadge"
    const hasBadge = await badgeRepository.userHasBadge(userId, badgeId);
    if (hasBadge) {
      return; // Badge déjà obtenu
    }
    // Attribuer le badge
    await badgeRepository.awardBadge(userId, badgeId);
    // Ajouter les points
    await badgeRepository.addPoints(userId, points);
  },

  // Mettre à jour le niveau d'un utilisateur basé sur ses points
  async updateUserLevel(userId: number): Promise<void> {
    try {
      const currentPoints = await badgeRepository.getUserPoints(userId);

      const newLevel = await badgeRepository.getLevelForPoints(currentPoints);

      if (newLevel?.id) {
        await badgeRepository.updateUserLevel(userId, newLevel.id);
      } else {
        // Calcul manuel si getLevelForPoints échoue
        let levelId = 1;
        if (currentPoints >= 1300) levelId = 6;
        else if (currentPoints >= 700) levelId = 5;
        else if (currentPoints >= 350) levelId = 4;
        else if (currentPoints >= 150) levelId = 3;
        else if (currentPoints >= 50) levelId = 2;

        await badgeRepository.updateUserLevel(userId, levelId);
      }
    } catch (_error) {}
  },
  // Fonction à appeler après qu'un utilisateur poste une photo
  async onPhotoAdded(userId: number): Promise<BadgeCondition[]> {
    return await this.checkAndAwardBadges(userId);
  },

  // Calculer les points à attribuer pour une action
  getPointsForAction(action: string): number {
    const pointsMap: Record<string, number> = {
      photo_upload: 5,
      first_photo: 10,
      photo_with_description: 2,
    };
    return pointsMap[action] || 0;
  },

  // Ajouter des points à un utilisateur (méthode simple)
  async awardPoints(userId: number, points: number): Promise<void> {
    await badgeRepository.addPoints(userId, points);
  },
};

export default badgeService;
