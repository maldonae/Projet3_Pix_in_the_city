import type { RequestHandler } from "express";
import userRepository from "./userRepository";

// Import access to data
// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch tous les users
    const users = await userRepository.readAll();
    // Répond avec les users au format JSON
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetche un user particulier avec son id
    const userId = Number.parseInt(req.params.id);
    const user = await userRepository.read(userId);
    // Si l'utilisateur n'est pas trouvé, répondre avec une erreur 404
    // Sinon, répondre avec l'user au format json
    if (user == null) {
      res.sendStatus(404);
    } else {
      const { hashed_password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.params.id);
    
    // Vérifie si l'ID est valide
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    // SÉCURITÉ - Construire seulement les champs fournis
    const userData: any = { id: userId };

    // Champs autorisés pour modification
    const allowedFields = ['firstname', 'lastname', 'pseudo', 'city', 'zip_code'];

    // Ajouter seulement les champs qui sont fournis dans la requête
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        userData[field] = req.body[field];
      }
    }

    // SÉCURITÉ - Empêcher l'escalade de privilèges
    if (req.body.is_admin !== undefined) {
      res.status(403).json({ error: "Cannot modify admin status" });
      return;
    }
    if (req.body.email !== undefined) {
      res.status(403).json({ error: "Cannot modify email via this route" });
      return;
    }

    // Vérifier qu'il y a au moins un champ à modifier
    if (Object.keys(userData).length <= 1) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    const affectedRows = await userRepository.update(userData);
    if (affectedRows === 0) {
      res.sendStatus(404);
      return;
    }

    // CORRECTION - Renvoie status 204 comme attendu par le frontend
    res.sendStatus(204);

  } catch (err) {
    console.error("❌ Error in userActions.edit:", err);
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // Datas de user depuis la requet body
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      pseudo: req.body.pseudo,
      email: req.body.email,
      zip_code: req.body.zip_code || null,
      city: req.body.city || null,
      hashed_password: req.body.hashed_password,
      is_gcu_accepted: req.body.is_gcu_accepted,
      is_admin: req.body.is_admin,
    };
    const insertId = await userRepository.create(newUser);
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Récupère l'ID de l'utilisateur à supprimer
    const id = Number(req.params.id);
    // Supprime l'utilisateur dans la base de données
    const deleteResult = await userRepository.delete(id);
    // Vérifie si l'utilisateur existait bien avant suppression
    if (!deleteResult || deleteResult === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    // Suppression réussie → Efface le cookie d'authentification
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "User deleted and logged out" });
    return;
  } catch (err) {
    // Passe les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

export default { browse, read, edit, add, destroy };
