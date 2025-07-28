import argon2 from "argon2";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import userRepository from "../user/userRepository";

// Interface pour le type user étendu avec le rôle
interface AuthUser {
  id: number;
  email: string;
  pseudo: string;
  role: string;
}

const login: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.email) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await userRepository.readByEmailWithPassword(req.body.email);

    // ✅ CORRECTION: Vérifier si l'utilisateur existe
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const verified = await argon2.verify(
      user.hashed_password,
      req.body.password,
    );

    if (verified) {
      // ✅ CORRECTION: Inclure email et role dans le payload JWT
      const myPayload = {
        id: user.id.toString(),
        email: user.email,
        pseudo: user.pseudo,
        role: user.role || (user.is_admin ? "admin" : "user"), // ✅ S'assurer que role est défini
      };

      const token = await jwt.sign(
        myPayload,
        process.env.APP_SECRET as string,
        {
          expiresIn: "1h",
        },
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });

      res.sendStatus(200);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    const hashedPassword = await argon2.hash(password, hashingOptions);
    req.body.hashed_password = hashedPassword;
    req.body.password = undefined;
    next();
  } catch (err) {
    next(err);
  }
};

const verifyToken: RequestHandler = (req, res, next) => {
  const { authToken } = req.cookies;

  try {
    if (authToken) {
      // ✅ CORRECTION: Vérifier ET décoder le token correctement
      const verified = jwt.verify(
        authToken,
        process.env.APP_SECRET as string,
      ) as AuthUser;

      if (verified) {
        // Retourner les infos décodées (sans le mot de passe)
        const { id, email, pseudo, role } = verified;
        res.status(200).json({ id, email, pseudo, role });
      } else {
        res.clearCookie("authToken");
        res.status(401).json({ message: "Invalid token" });
      }
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    // Token invalide ou expiré
    res.clearCookie("authToken");
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

const verifyAuth: RequestHandler = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const user = jwt.verify(
      token,
      process.env.APP_SECRET as string,
    ) as AuthUser;

    // ✅ CORRECTION: S'assurer que user.id est un nombre
    req.user = {
      ...user,
      id: typeof user.id === "string" ? Number.parseInt(user.id) : user.id,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};

const requireRole = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({ error: "Insufficient permissions" });
      return;
    }

    next();
  };
};

const requireAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({ error: "Admin access required" });
    return;
  }

  next();
};

const requireSelfOrAdmin: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const user = req.user;
  const targetUserId = req.params.id;

  if (!user) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  if (Number(user.id) !== Number(targetUserId) && user.role !== "admin") {
    res
      .status(403)
      .json({ error: "Can only access your own profile or be admin" });
    return;
  }

  next();
};

const logout: RequestHandler = async (req, res, next) => {
  try {
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Deconnected" });
  } catch (err) {
    next(err);
  }
};

export default {
  login,
  hashPassword,
  verifyToken,
  logout,
  verifyAuth,
  requireRole,
  requireAdmin,
  requireSelfOrAdmin,
};
