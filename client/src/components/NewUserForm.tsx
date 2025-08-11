import { type ReactNode, useState } from "react";

import { ToastContainer, toast } from "react-toastify"; // Import de toastify
import "react-toastify/dist/ReactToastify.css"; // Import des styles de Toastify

import "./NewUserForm.css";
import { Link } from "react-router-dom";

// Définition du type de données pour un profil utilisateur
export type ProfilType = {
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  zip_code?: string | null; // optionnel
  city?: string | null; // optionnel
  password: string;
  passwordConfirm: string;
  is_gcu_accepted: boolean;
  is_admin: boolean;
};

// Définition des props pour le composant NewUserForm
interface CreaProfilType {
  children?: ReactNode;
  defaultValue: ProfilType;
  onSubmit: (photo: ProfilType) => void;
}

// Fonction pour faire défiler la page vers le haut de manière fluide
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

function NewUserForm({ children, defaultValue, onSubmit }: CreaProfilType) {
  // État pour suivre si l'utilisateur a accepté les CGU
  const [isGCUAccepted, setIsGCUAccepted] = useState(
    defaultValue.is_gcu_accepted,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <section className="create-profil-container">
      <h1>CRÉER MON PROFIL</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget); // Récupère les valeurs des champs du formulaire

          // Extraction des valeurs du formulaire
          const firstname = formData.get("firstname") as string;
          const lastname = formData.get("lastname") as string;
          const pseudo = formData.get("pseudo") as string;
          const email = formData.get("email") as string;
          const zip_code = (formData.get("zip_code") as string)?.trim() || null;
          const city = (formData.get("city") as string)?.trim() || null;
          const password = formData.get("password") as string;
          const passwordConfirm = formData.get("passwordConfirm") as string;
          const is_admin = formData.get("is_admin") === "0";

          // vérifie si les CGU sont acceptés
          if (!isGCUAccepted) {
            toast.error("Vous devez accepter les CGU avant de soumettre.");
            return;
          }
          // Vérifie si le mot de passe est égale au mot de passe de confimration
          if (password !== passwordConfirm) {
            toast.error("Les mots de passe saisis doivent être identiques.");
            return;
          }
          // Vérifie si le mot de passe est égale au mot de passe de confimration
          if (password !== passwordConfirm) {
            toast.error("Les mots de passe saisis doivent être identiques.");
            return;
          }
          // Vérifie si le mot de passe fait minimum 12 caractères
          if (password.length < 12) {
            toast.error("Le mot de passe doit faire 12 caractères minimum.");
            return;
          }
          const passwordRegex =
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
          if (!passwordRegex.test(password)) {
            toast.error(
              "Le mot de passe doit contenir au moins une lettre majuscule, un chiffre et un caractère spécial.",
            );
            return;
          }

          // Vérifie que tous les champs obligatoires sont remplis
          if (
            !firstname ||
            !lastname ||
            !pseudo ||
            !email ||
            !password ||
            !passwordConfirm
          ) {
            toast.error("Veuillez remplir tous les champs obligatoires.");
            return;
          }
          // Afficher le succès et soumettre après un court délai
          toast.success("Profil créé avec succès !", {
            autoClose: 1000,
            position: "bottom-center",
          });

          setTimeout(() => {
            onSubmit({
              firstname,
              lastname,
              pseudo,
              email,
              zip_code,
              city,
              password,
              passwordConfirm,
              is_gcu_accepted: isGCUAccepted,
              is_admin,
            });
          }, 1500);
        }}
      >
        <label className="form-fields" htmlFor="firstname">
          Prénom *
        </label>
        <input
          className="form-fields"
          id="firstname"
          type="text"
          name="firstname"
          placeholder="Entrez votre prénom"
          defaultValue={defaultValue.firstname}
        />
        <label className="form-fields" htmlFor="lastname">
          Nom *
        </label>
        <input
          className="form-fields"
          id="lastname"
          type="text"
          name="lastname"
          placeholder="Entrez votre nom"
          defaultValue={defaultValue.lastname}
        />

        <label className="form-fields" htmlFor="pseudo">
          Pseudo *
        </label>
        <input
          className="form-fields"
          id="pseudo"
          type="text"
          name="pseudo"
          placeholder="Choisissez un pseudo"
          defaultValue={defaultValue.pseudo}
        />

        <label className="form-fields" htmlFor="email">
          Email *
        </label>
        <input
          className="form-fields"
          id="email"
          type="email"
          name="email"
          placeholder="Entrez votre email"
          defaultValue={defaultValue.email}
        />

        <label className="form-fields" htmlFor="zip_code">
          Code postal (optionnel)
        </label>
        <input
          id="zip_code"
          type="text"
          name="zip_code"
          placeholder="69000"
          defaultValue={defaultValue.zip_code ?? ""}
        />

        <label className="form-fields" htmlFor="city">
          Ville (optionnel)
        </label>
        <input
          className="form-fields"
          id="city"
          type="text"
          name="city"
          placeholder="Entrez votre ville"
          defaultValue={defaultValue.city ?? ""}
        />

        <label className="form-fields" htmlFor="password">
          Mot de passe *{" "}
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "🙈" : "👁"}
          </button>
        </label>

        <input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          defaultValue={defaultValue.password}
        />

        <label className="form-fields" htmlFor="passwordConfirm">
          Confirmer le mot de passe *{" "}
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
          >
            {showPasswordConfirm ? "🙈" : "👁"}
          </button>
        </label>

        <input
          id="passwordConfirm"
          type={showPasswordConfirm ? "text" : "password"}
          name="passwordConfirm"
          defaultValue={defaultValue.passwordConfirm}
        />

        <label className="form-fields gcu-label" htmlFor="is_gcu_accepted">
          <Link
            to="/cgu"
            className="gcu-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            J'accepte les conditions générales d'utilisation*
          </Link>
          <input
            className="is_gcu_accepted"
            id="is_gcu_accepted"
            type="checkbox"
            name="is_gcu_accepted"
            checked={isGCUAccepted}
            onChange={(e) => setIsGCUAccepted(e.target.checked)}
          />
        </label>
        <p className="obligatory-fields">
          <br />
          Tous les champs avec une * sont obligatoires
        </p>

        <button type="submit" className="create-profil-button">
          {children}CRÉER MON PROFIL
        </button>
        <div className="button_center">
          <button
            className="button-up-profil-form"
            type="button"
            id="button_up"
            onClick={scrollToTop} // Ajout du gestionnaire d'événement
          >
            <img
              src={"/src/assets/images/arrow_up.png"}
              alt="Retour_vers_le_haut"
              id="arrow_up"
            />
            <p>RETOUR VERS LE HAUT</p>
          </button>
        </div>
        <ToastContainer
          position="bottom-center"
          aria-label="Notifications de création de profil"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </form>
    </section>
  );
}

export default NewUserForm;
