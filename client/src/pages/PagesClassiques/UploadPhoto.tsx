import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useUser } from "../../hooks/useUser";
import SubmitPhotoForm from "../Photos/SubmitPhotoForm";

interface PhotoData {
  title: string;
  artist: string;
  content: string;
  dateoftheday: string;
  picture: File | null;
}

function UploadPhoto() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const newPhoto: PhotoData = {
    title: "",
    artist: "",
    content: "",
    dateoftheday: "",
    picture: null,
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setGeoError(
              "Permission refusée. Coordonnées par défaut utilisées.",
            );
          }
        },
      );
    } else {
      setGeoError(
        "La géolocalisation n'est pas prise en charge par votre navigateur.",
      );
    }
  }, []);

  // ✅ CORRECTION - Fonction async qui lance des erreurs
  const handleSubmit = async (photoData: FormData): Promise<void> => {
    if (!user) {
      throw new Error("Vous devez être connecté pour ajouter une photo.");
    }
    
    if (!photoData.get("picture")) {
      throw new Error("Veuillez sélectionner une image.");
    }

    const formattedDate = new Date().toLocaleDateString("fr-FR");
    photoData.append("dateoftheday", formattedDate);
    photoData.append("user_id", user.id.toString());
    
    if (latitude && longitude) {
      photoData.append("latitude", latitude.toString());
      photoData.append("longitude", longitude.toString());
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
        method: "POST",
        body: photoData,
        credentials: "include",
      });

      if (!response.ok) {
        // ✅ GESTION D'ERREUR SPÉCIFIQUE SELON LE STATUS
        if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur de validation");
        } else {
          throw new Error("Erreur lors de l'envoi de la photo");
        }
      }

      const result = await response.json();
      
      // ✅ SUCCÈS - Redirection après délai
      setTimeout(() => navigate("/"), 1000);
      
    } catch (error: any) {
      console.error("Error submitting photo:", error);
      
      // ✅ Relancer l'erreur pour que SubmitPhotoForm la gère
      throw error;
    }
  };

  return (
    <div>
      <ToastContainer position="bottom-left" />
      {geoError && <p>{geoError}</p>}
      {apiError && <p>{apiError}</p>}
      <SubmitPhotoForm defaultValue={newPhoto} onSubmit={handleSubmit} />
    </div>
  );
}

export default UploadPhoto;
