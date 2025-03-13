import type { RequestHandler } from "express";

const verifyformdata: RequestHandler = (req, res, next) => {
  const {
    firstname,
    lastname,
    email,
    zip_code,
    password,
    passwordConfirm,
    is_gcu_accepted,
  } = req.body;

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
  // Vérifie si le mot de passe fait minimum 12 caractères
  const passwordRegex = /^.{12,}$/;
  if (!password || !passwordRegex.test(password)) {
    res
      .status(403)
      .send({ error: "Le mot de passe doit faire plus de 12 caractères." });
    return;
  }
  // Vérifie si le mot de passe est égale au mot de passe de confimration
  if (password !== passwordConfirm) {
    res
      .status(403)
      .send({ error: "Les mots de passe saisis doivent être identiques." });
    return;
  }
  // Vérifie si le mot de passe est égale au mot de passe de confimration
  const passwordVerifRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).+$/;
  if (!passwordVerifRegex.test(password)) {
    res
      .status(403)
      .send({
        error:
          "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial.",
      });
    return;
  }

  // Vérifie si la case CGU est cochée
  if (!is_gcu_accepted) {
    res
      .status(403)
      .send({ error: "Vous devez accepter les CGU pour continuer." });
    return;
  }
  next();
};

export default { verifyformdata };
