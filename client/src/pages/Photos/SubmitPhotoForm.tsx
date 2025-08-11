import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import "./SubmitPhotoForm.css";

interface Badge {
  id: number;
  name: string;
  points: number;
  is_rare: boolean;
}

type PhotoType = {
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  picture: File | null;
};

interface SubmitPhotoType {
  children?: ReactNode;
  defaultValue: PhotoType;
  onSubmit: (photo: FormData) => Promise<void>; // ✅ Ajout Promise pour gestion async
}

function SubmitPhotoForm({
  children,
  defaultValue,
  onSubmit,
}: SubmitPhotoType) {
  const [uploading, setUploading] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const formattedDate = new Date().toLocaleDateString("fr-FR");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (uploading) return;

    setUploading(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.append("date", today);
      formData.append("dateoftheday", formattedDate);

      // ✅ CORRECTION - Attendre la réponse et gérer les erreurs
      await onSubmit(formData);

      // ✅ SUCCÈS - Toast et reset seulement si pas d'erreur
      toast.success("🎨 Photo ajoutée avec succès !", {
        position: "top-right",
        autoClose: 5000,
      });

      (event.target as HTMLFormElement).reset();

      // Vérifier les nouveaux badges après succès
      await checkForNewBadges();
    } catch (error: unknown) {
      let errorMessage = "❌ Erreur lors de l'upload de la photo";

      if (error instanceof Error && error.message) {
        errorMessage = `❌ ${error.message}`;
      } else if (typeof error === "string") {
        errorMessage = `❌ ${error}`;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 8000,
      });
      // ❌ NE PAS réinitialiser le formulaire en cas d'erreur
    } finally {
      setUploading(false);
    }
  };

  const checkForNewBadges = async () => {
    try {
      const userResponse = await fetch("/api/auth", { credentials: "include" });
      if (!userResponse.ok) return;

      const userData = await userResponse.json();
      const userId = userData.id || userData.user?.id;

      if (!userId) return;

      const badgeResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userId}/check-badges`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (badgeResponse.ok) {
        const result = await badgeResponse.json();

        if (result.newBadges && result.newBadges.length > 0) {
          result.newBadges.forEach((badge: Badge, index: number) => {
            setTimeout(() => {
              toast.success(
                `🏆 Nouveau badge obtenu ! "${badge.name}" (+${badge.points} XP)`,
                {
                  position: "top-right",
                  autoClose: 12000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  style: {
                    background: badge.is_rare
                      ? "linear-gradient(45deg, #FFD700, #FFA500)"
                      : "linear-gradient(45deg, #4CAF50, #45a049)",
                    color: badge.is_rare ? "black" : "white",
                    fontWeight: "bold",
                  },
                },
              );
            }, index * 2000);
          });
        }
      }
    } catch (_error) {}
  };

  return (
    <section className="post-photo-container">
      <h1 id="subm_photo">SOUMETTRE UNE ŒUVRE</h1>
      <form className="formphoto" onSubmit={handleSubmit}>
        <label htmlFor="title">TITRE DE L'ŒUVRE</label>
        <input
          className="form-photo-fields"
          placeholder="TITRE DE L'ŒUVRE (optionnel)"
          type="text"
          name="title"
          defaultValue={defaultValue.title}
          disabled={uploading}
        />
        <label htmlFor="artist">NOM DE L'ARTISTE</label>
        <input
          className="form-photo-fields"
          placeholder="NOM DE L'ARTISTE (optionnel)"
          type="text"
          name="artist"
          defaultValue={defaultValue.artist}
          disabled={uploading}
        />
        <label htmlFor="content">DESCRIPTION</label>
        <textarea
          className="form-photo-fields"
          rows={5}
          cols={50}
          placeholder="DESCRIPTION (optionnel)"
          name="content"
          defaultValue={defaultValue.content}
          disabled={uploading}
        />
        <label htmlFor="date">AJOUTER PHOTO* (max 5MB)</label>
        <input
          type="file"
          name="picture"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          required
          disabled={uploading}
        />
        <p className="auth-gcu">
          <span className="star">*</span> Conformément aux CGU acceptées lors de
          mon inscription, j'autorise le site à utiliser la ou les photos que je
          soumets. Taille maximum : 5MB.
        </p>
        <button
          className="post-photo-button"
          type="submit"
          disabled={uploading}
          style={{
            opacity: uploading ? 0.7 : 1,
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading
            ? "⏳ Upload en cours..."
            : `${children}🎨 PROPOSER UNE ŒUVRE`}
        </button>
      </form>
    </section>
  );
}

export default SubmitPhotoForm;
