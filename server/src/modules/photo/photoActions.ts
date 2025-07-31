import fs from "node:fs";
import type { RequestHandler } from "express";
import { validateMIMEType } from "validate-image-type";

import badgeRepository from "../badge/badgeRepository";
import badgeService from "../badge/badgeService";
import photoRepository from "./photoRepository";

// ✅ Type pour les badges
interface BadgeCondition {
  id: number;
  condition_type: string;
  condition_value: number;
  points: number;
}

// Import access to data
// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all photos
    const photos = await photoRepository.readAll();
    // Répond avec les photos en JSON format
    res.json(photos);
  } catch (err) {
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch une photo spécifique basée sur l'ID fournie
    const photoid = Number(req.params.id);
    const photo = await photoRepository.read(photoid);
    // Si la photo n'est pas trouvée, répondre avec une erreur 404
    // Sinon, répondre avec une photo en format JSON
    if (photo == null) {
      res.sendStatus(404);
    } else {
      res.json(photo);
    }
  } catch (err) {
    next(err);
  }
};

// The A of BREAD - Add (Create) operation - MODIFIÉ POUR LES BADGES
const add: RequestHandler = async (req, res, next) => {
  try {
    // ✅ Type assertion au lieu d'interface custom
    const reqWithFile = req as typeof req & {
      file?: Express.Multer.File;
      user?: { id: number };
    };

    // Vérifie si un fichier est présent
    if (!reqWithFile.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const validation = await validateMIMEType(reqWithFile.file.path, {
      allowMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (!validation.ok) {
      fs.unlinkSync(reqWithFile.file.path);
      res.status(400).json({ error: "Invalid image type" });
      return;
    }

    // Vérifier si l'utilisateur est authentifié
    if (!reqWithFile.user?.id) {
      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return;
    }

    // Extrait des photos du request body
    const { title, content, artist, date } = req.body;
    const { latitude, longitude } = req.body;
    const defaultLatitude = 45.7597; // Latitude par défaut (centre de Lyon)
    const defaultLongitude = 4.8422; // Longitude par défaut (centre de Lyon)

    const newLatitude =
      latitude !== undefined ? Number.parseFloat(latitude) : defaultLatitude;
    const newLongitude =
      longitude !== undefined ? Number.parseFloat(longitude) : defaultLongitude;

    const newPhoto = {
      title,
      content,
      artist,
      dateoftheday: date,
      latitude: newLatitude,
      longitude: newLongitude,
      picture: reqWithFile.file.filename,
      user_id: reqWithFile.user.id,
    };

    // Create the photo
    const insertId = await photoRepository.create(newPhoto);

    // NOUVEAU : Gestion des badges et points
    let pointsEarned = 0;
    let newBadges: BadgeCondition[] = [];

    try {
      // Calculer les points pour cette action
      const photoPoints = badgeService.getPointsForAction("photo_upload");
      const descriptionPoints = content
        ? badgeService.getPointsForAction("photo_with_description")
        : 0;
      pointsEarned = photoPoints + descriptionPoints;

      // Ajouter les points à l'utilisateur si il y en a
      if (pointsEarned > 0) {
        await badgeRepository.addPoints(reqWithFile.user.id, pointsEarned);
      }

      // Vérifier et attribuer de nouveaux badges
      newBadges = await badgeService.onPhotoAdded(reqWithFile.user.id);
    } catch (badgeError) {
      // En cas d'erreur avec les badges, on continue mais on log l'erreur
      console.error("Error processing badges:", badgeError);
    }

    // Réponse enrichie avec informations des badges
    res.status(201).json({
      insertId,
      pointsEarned,
      newBadges,
      message: "Photo created successfully",
    });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Fetch une photo spécifique basée sur l'ID fournie
    const photoid = Number(req.params.id);
    const photo = await photoRepository.delete(photoid);
    // Si la photo n'est pas trouvée, répondre avec une erreur 404
    // Sinon, répondre avec une photo en format JSON
    if (photo == null) {
      res.sendStatus(404);
    } else {
      res.json(photo);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add, destroy };
