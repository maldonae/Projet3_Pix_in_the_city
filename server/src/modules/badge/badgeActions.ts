import type { RequestHandler } from "express";
import badgeRepository from "./badgeRepository";
import badgeService from "./badgeService";

// ✅ CORRECTION - Typage correct des fonctions RequestHandler
const browse: RequestHandler = async (req, res) => {
  try {
    const badges = await badgeRepository.readAll();
    res.json(badges);
  } catch (error) {
    console.error("Error fetching badges:", error);
    res.status(500).json({ error: "Failed to fetch badges" });
  }
};

const getUserBadges: RequestHandler = async (req, res) => {
  const userId = Number.parseInt(req.params.id);
  try {
    const userBadges = await badgeRepository.readUserBadges(userId);
    res.json(userBadges);
  } catch (error) {
    console.error("Error fetching user badges:", error);
    res.status(500).json({ error: "Failed to fetch user badges" });
  }
};

const getUserStats: RequestHandler = async (req, res) => {
  const userId = Number.parseInt(req.params.id);
  try {
    const stats = await badgeRepository.readUserStats(userId);
    if (!stats) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(stats);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

const getLeaderboard: RequestHandler = async (req, res) => {
  const limit = Number.parseInt(req.query.limit as string) || 10;
  try {
    const leaderboard = await badgeRepository.readLeaderboard(limit);
    res.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

const checkAndAwardBadges: RequestHandler = async (req, res) => {
  const userId = Number.parseInt(req.params.id);
  try {
    const newBadges = await badgeService.checkAndAwardBadges(userId);
    res.json({
      message: "Badges checked successfully",
      newBadges: newBadges
    });
  } catch (error) {
    console.error("Error checking badges:", error);
    res.status(500).json({ error: "Failed to check badges" });
  }
};

// ✅ CORRECTION - Export par défaut avec toutes les fonctions
export default {
  browse,
  getUserBadges,
  getUserStats,
  getLeaderboard,
  checkAndAwardBadges
};
