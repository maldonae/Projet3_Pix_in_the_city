import type { ReactNode } from "react";
import "./SubmitPhotoForm.css";

type PhotoType = {
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  picture: File | null;
};

interface SubmitPhotoType {
  children?: ReactNode; // contenu optionnel qui peut être passé à l'intérieur du composant (pour le bouton dynamique)
  defaultValue: PhotoType; // valeurs par défaut du formulaire
  onSubmit: (photo: FormData) => void; // appelée lors de la soumission d'une photo
}

function SubmitPhotoForm({
  children,
  defaultValue,
  onSubmit,
}: SubmitPhotoType) {
  // obtention de la date actuelle au format aaaa-mm-dd
  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date().toLocaleDateString("fr-FR"); // Format de la date au format DD-MM-YYYY

  return (
    <section className="post-photo-container">
      <h1 id="subm_photo">SOUMETTRE UNE ŒUVRE</h1>
      <form
        className="formphoto"
        onSubmit={(event) => {
          event.preventDefault(); // empêche le rechargement de la page lors de la soumission
          const formData = new FormData(event.currentTarget);
          formData.append("date", today);
          formData.append("dateoftheday", formattedDate); // Ajouter la date formatée
          onSubmit(formData);
        }}
      >
        <label htmlFor="title">TITRE DE L'ŒUVRE</label>
        <input
          className="form-photo-fields"
          placeholder="TITRE DE L'ŒUVRE (optionnel)"
          type="text"
          name="title"
          defaultValue={defaultValue.title}
        />
        <label htmlFor="artist">NOM DE L'ARTISTE</label>
        <input
          className="form-photo-fields"
          placeholder="NOM DE L'ARTISTE (optionnel)"
          type="text"
          name="artist"
          defaultValue={defaultValue.artist}
        />
        <label htmlFor="content">DESCRIPTION</label>
        <textarea
          className="form-photo-fields"
          rows={5}
          cols={50}
          placeholder="DESCRIPTION (optionnel)"
          name="content"
          defaultValue={defaultValue.content}
        />

        <label htmlFor="date">AJOUTER PHOTO*</label>
        <input type="file" name="picture" />

        <p className="auth-gcu">
          <span className="star">*</span> Conformément aux CGU acceptées lors de
          mon inscription, j'autorise le site à utiliser la ou les photos que je
          soumets.
        </p>
        <button className="post-photo-button" type="submit">
          {children}PROPOSER UNE ŒUVRE
        </button>
      </form>
    </section>
  );
}

export default SubmitPhotoForm;
