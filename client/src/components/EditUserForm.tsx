// TypeScript utilise ReactNode pour répresenter le contenu que React peut rendre dans le DOM, on l'utilise ici pour accepter des enfants ( children ) dans un composant
import type { ReactNode } from "react";
import "./EditUserForm.css";

// Définition du type User pour structurer les données utilisateur
type User = {
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  zip_code?: string; // optionnel
  city?: string; // optionnel
};

// Interface définissant les props du formulaire de modification d'utilisateur
interface UserFormProps {
  children: ReactNode;
  extraButton?: ReactNode;
  defaultValue: User; // valeurs initiales des champs du formulaire (prerémpli)
  onSubmit: (user: User) => void;
}

// fonction du composant permettant la modification du profil
function EditUserForm({
  children,
  defaultValue,
  extraButton,
  onSubmit,
}: UserFormProps) {
  return (
    <section className="update-profil-container">
      <h1>MODIFIER MON PROFIL</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault(); // empechement de rechargement de la page
          const formData = new FormData(event.currentTarget); // récuperation des donnés du formulaire
          onSubmit({
            // envoie les donn"es au composant parent
            firstname: formData.get("firstname") as string,
            lastname: formData.get("lastname") as string,
            pseudo: formData.get("pseudo") as string,
            email: formData.get("email") as string,
            zip_code: formData.get("zip_code")?.toString(),
            city: formData.get("city")?.toString(),
          });
        }}
      >
        <label className="updateForm-fields">
          Prenom:
          <input
            type="text"
            name="firstname"
            defaultValue={defaultValue.firstname}
            required
          />
        </label>
        <label className="updateForm-fields">
          Nom de famille:
          <input
            type="text"
            name="lastname"
            defaultValue={defaultValue.lastname}
            required
          />
        </label>
        <label className="updateForm-fields">
          Pseudo:
          <input
            type="text"
            name="pseudo"
            defaultValue={defaultValue.pseudo}
            required
          />
        </label>
        <label className="updateForm-fields">
          Email:
          <input
            type="email"
            name="email"
            defaultValue={defaultValue.email}
            required
          />
        </label>
        <label className="updateForm-fields">
          Code postal:
          <input
            type="text"
            name="zip_code"
            defaultValue={defaultValue.zip_code || ""}
          />
        </label>
        <label className="updateForm-fields">
          Ville:
          <input
            type="text"
            name="city"
            defaultValue={defaultValue.city || ""}
          />
        </label>

        <button type="submit" className="update-profil-button">
          {children}
        </button>
        {/* Appel au bouton déclaré dans la page parent "ModifProfil" */}
        {extraButton && <p className="delete_button">{extraButton}</p>}
      </form>
    </section>
  );
}
export default EditUserForm;