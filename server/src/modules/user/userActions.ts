import type { RequestHandler } from "express";
import userRepository from "./userRepository";

// ✅ CORRECTION: Import du type User depuis le repository
type User = {
  role: string;
  id: number;
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  zip_code?: number;
  city?: string;
  hashed_password: string;
  is_gcu_accepted: boolean;
  is_admin: boolean;
};

// Import access to data
// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (_req, res, next) => {
  try {
    // Fetch tous les users
    const users = await userRepository.readAll();

    // ✅ CORRECTION: Supprimer les mots de passe des réponses
    const usersWithoutPasswords = users.map((user) => {
      const { hashed_password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // Répond avec les users au format JSON
    res.json(usersWithoutPasswords);
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

    // ✅ CORRECTION: Vérifier que l'ID est valide
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await userRepository.read(userId);
    // Si l'utilisateur n'est pas trouvé, répondre avec une erreur 404
    // Sinon, répondre avec l'user au format json
    if (user == null) {
      res.sendStatus(404);
    } else {
      const { hashed_password: _, ...userWithoutPassword } = user;
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

    // ✅ CORRECTION: Type compatible avec le repository
    const userData: { id: number } & Partial<Omit<User, "id">> = { id: userId };

    // Champs autorisés pour modification
    const allowedFields = [
      "firstname",
      "lastname",
      "pseudo",
      "city",
      "zip_code",
    ] as const;

    // ✅ CORRECTION: Assignation typée sans any
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (field === "firstname") userData.firstname = req.body[field];
        else if (field === "lastname") userData.lastname = req.body[field];
        else if (field === "pseudo") userData.pseudo = req.body[field];
        else if (field === "city") userData.city = req.body[field];
        else if (field === "zip_code") userData.zip_code = req.body[field];
      }
    }

    // ✅ CORRECTION: Sécurité renforcée - Empêcher la modification de champs sensibles
    const forbiddenFields = ["is_admin", "email", "role", "hashed_password"];
    for (const field of forbiddenFields) {
      if (req.body[field] !== undefined) {
        res
          .status(403)
          .json({ error: `Cannot modify ${field} via this route` });
        return;
      }
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
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
const add: RequestHandler = async (req, res, next) => {
  try {
    // ✅ CORRECTION: Validation des champs requis
    const requiredFields = [
      "firstname",
      "lastname",
      "pseudo",
      "email",
      "hashed_password",
    ];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        res.status(400).json({ error: `${field} is required` });
        return;
      }
    }

    // ✅ CORRECTION: Ajouter le rôle par défaut
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      pseudo: req.body.pseudo,
      email: req.body.email,
      zip_code: req.body.zip_code || null,
      city: req.body.city || null,
      hashed_password: req.body.hashed_password,
      is_gcu_accepted: req.body.is_gcu_accepted || false,
      is_admin: req.body.is_admin || false,
      role: req.body.is_admin ? "admin" : "user", // ✅ Définir le rôle basé sur is_admin
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

    // ✅ CORRECTION: Vérifier que l'ID est valide
    if (Number.isNaN(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

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
  } catch (err) {
    // Passe les erreurs au middleware de gestion des erreurs
    next(err);
  }
};

// ✅ NOUVELLE FONCTION: Mettre à jour le rôle (admin seulement)
const updateRole: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number.parseInt(req.params.id);
    const { role } = req.body;

    if (Number.isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    if (!role || !["user", "admin"].includes(role)) {
      res.status(400).json({ error: "Role must be 'user' or 'admin'" });
      return;
    }

    // ✅ CORRECTION: Type compatible avec le repository
    const userData: { id: number } & Partial<Omit<User, "id">> = {
      id: userId,
      role,
      is_admin: role === "admin",
    };

    const affectedRows = await userRepository.update(userData);
    if (affectedRows === 0) {
      res.sendStatus(404);
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, read, edit, add, destroy, updateRole };
