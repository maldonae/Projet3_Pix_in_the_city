import argon2 from "argon2";
import type { RequestHandler } from "express";
import userRepository from "../user/userRepository";

import jwt from "jsonwebtoken";
// Importe l'access aux data

const login: RequestHandler = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.email) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }
    const user = await userRepository.readByEmailWithPassword(req.body.email);

    const verified = await argon2.verify(
      user.hashed_password,
      req.body.password,
    );
    if (verified) {
      // Répond avec un user au format json (sans hashed password)
      const { hashed_password, ...userWithoutHashedPassword } = user;
      const myPayload = {
        id: user.id.toString(),
        email: user.email,
        pseudo: user.pseudo,
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
        secure: process.env.NODE_ENV === "production", // Active HTTPS en prod
        sameSite: "strict",
        maxAge: 60 * 60 * 1000,
      });
      res.sendStatus(200);
    } else {
      res.sendStatus(422);
    }
  } catch (err) {
    next(err);
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10 /* 19 Mio en kio (19 * 1024 kio) */,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    // Extraction du mot de passe (mdp) de la requête
    const { password } = req.body;
    // Hachage du mdp avec les options spécifiées
    const hashedPassword = await argon2.hash(password, hashingOptions);
    // Remplacement du mdp non haché par le mot de passe haché dans la requête
    req.body.hashed_password = hashedPassword;
    // Oubli du mdp non haché de la requête : il restera un secret même pour notre code dans les autres actions
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
      const verified = jwt.verify(authToken, process.env.APP_SECRET as string);
      if (verified) {
        const decoded = jwt.decode(authToken);
        res.status(200).json(decoded);
      } else {
        res.clearCookie("authToken");
      }
    } else {
      res.status(401).json({ message: "No token provided" });
    }
  } catch (err) {
    next(err);
  }
};

const verifyAuth: RequestHandler = (req, res): void => {
  const token = req.cookies.authToken;

  if (!token) {
    res.status(401).json({ message: "Non authentifié" });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.APP_SECRET as string);
    res.json(user);
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
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

export default { login, hashPassword, verifyToken, logout, verifyAuth };
