import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SubmitPhotoForm from "../Photos/SubmitPhotoForm";

// Interface définissant les données d'une photo à soumettre
interface PhotoData {
  title: string;
  artist: string;
  content: string;
  dateoftheday: string;
  picture: File | null;
}

function UploadPhoto() {
  const navigate = useNavigate();
  // États pour stocker la position géographique
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  // Gestion des erreurs
  const [geoError, setGeoError] = useState<string | null>(null);

  // Objet contenant les valeurs initiales du formulaire
  const newPhoto: PhotoData = {
    title: "",
    artist: "",
    content: "",
    dateoftheday: "",
    picture: null,
  };

  // Effet permettant de récupérer la position GPS de l'utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setGeoError("Permission denied. Using default coordinates.");
          }
        },
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
    }
  }, []); // Exécuté une seule fois au montage du composant

  // Fonction déclenchée lors de la soumission du formulaire
  const handleSubmit = (photoData: FormData) => {
    // Format de la date au format DD-MM-YYYY
    const formattedDate = new Date().toLocaleDateString("fr-FR");

    // Ajout des coordonnées GPS si disponibles
    if (latitude && longitude) {
      photoData.append("latitude", latitude.toString());
      photoData.append("longitude", longitude.toString());
    }
    // Ajout de la date du jour au FormData
    photoData.append("dateoftheday", formattedDate); // Ajouter la date formatée au FormData

    // Envoi des données à l'API via une requête POST (add BREAD)
    fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
      method: "POST",
      headers: {
        // Pas besoin de définir Content-Type ici, il est géré par FormData
      },
      body: photoData,
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error submitting photo:", error);
      });
  };

  return (
    <div>
      {/* Affichage d'un message d'erreur si la géolocalisation échoue */}
      {geoError && <p>{geoError}</p>}
      {/* Formulaire de soumission de la photo, appellé en tant que composant */}
      <SubmitPhotoForm defaultValue={newPhoto} onSubmit={handleSubmit} />
    </div>
  );
}

export default UploadPhoto;
