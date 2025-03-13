import fs from "node:fs";
import type { RequestHandler } from "express";
import { validateMIMEType } from "validate-image-type";
import photoRepository from "./photoRepository";

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

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  
  try {
    // Vérifie si un fichier est présent
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const validation = await validateMIMEType(req.file.path, {
      allowMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    if (!validation.ok) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({ error: "Invalid image type" });
      return;
    }

    // Vérifier si l'utilisateur est authentifié
    if (!req.user || !req.user.id) {
     
      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return;
    }


    // Extrait des photos du request body
    const { title, content, artist, date} = req.body;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

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
      latitude: newLatitude, // Toujours utiliser les coordonnées par défaut
      longitude: newLongitude,
      picture: req.file?.filename || null, // Nom du fichier si présent
      user_id: req.user.id, // Utilisation de l'ID de l'utilisateur authentifié
    };
    
    // Create the photo
    const insertId = await photoRepository.create(newPhoto);
    
    // Répond avec une 201 (Created) et l'ID de la nouvelle photo inserrée
    res.status(201).json({ insertId });
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
