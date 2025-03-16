import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import de Toastify
import "react-toastify/dist/ReactToastify.css"; // Import du CSS de Toastify
import { useUser } from "../../hooks/useUser"; // Import du hook personnalisé
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
  const { user } = useUser(); // Récupérer l'utilisateur connecté

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

  const handleSubmit = (photoData: FormData) => {
    if (!user) {
      setApiError("Vous devez être connecté pour ajouter une photo.");
      return;
    }

    if (!photoData.get("picture")) {
      setApiError("Veuillez sélectionner une image.");
      return;
    }

    const formattedDate = new Date().toLocaleDateString("fr-FR");
    photoData.append("dateoftheday", formattedDate);
    photoData.append("user_id", user.id.toString()); // Ajout de l'ID utilisateur

    if (latitude && longitude) {
      photoData.append("latitude", latitude.toString());
      photoData.append("longitude", longitude.toString());
    }

    fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
      method: "POST",
      body: photoData,
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erreur lors de l'envoi de la photo");
        return response.json();
      })
      .then(() => {
        toast.success("Photo envoyée avec succès !", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate("/"), 1000);
      })
      .catch((error) => {
        console.error("Error submitting photo:", error);
        toast.error("Échec de l'envoi de la photo. Veuillez réessayer.", {
          position: "top-right",
          autoClose: 3000,
        });
        setApiError("Impossible d'envoyer la photo. Réessayez plus tard.");
      });
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
