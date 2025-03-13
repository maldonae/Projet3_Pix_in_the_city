import type { RequestHandler } from "express";

const verifyformdata: RequestHandler = (req, res, next) => {
  const { firstname, lastname, email, zip_code, is_gcu_accepted } = req.body;

  if (!firstname || firstname.length < 2) {
    res
      .status(403)
      .send({ error: "Le prénom doit contenir au moins 2 caractères." });
    return;
  }

  if (!lastname || lastname.length < 2) {
    res
      .status(403)
      .send({ error: "Le nom doit contenir au moins 2 caractères." });
    return;
  }

  // Vérifie l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    res.status(403).send({ error: "L'email n'est pas valide." });
    return;
  }
  // vérifie code postal
  const zipCodeRegex = /^\d{5}$/; // Vérifie exactement 5 chiffres
  if (zip_code && !zipCodeRegex.test(zip_code)) {
    res.status(403).send({ error: "Le code postal n'est pas valide." });
    return;
  }

  if (!is_gcu_accepted) {
    res
      .status(403)
      .send({ error: "Vous devez accepter les CGU pour continuer." });
    return;
  }
  next();
};

export default { verifyformdata };
