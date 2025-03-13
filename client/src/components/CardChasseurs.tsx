import { useEffect, useRef, useState } from "react";
import "../styles (anciennement CSS)/pages/CardChasseurs.css";
import PhotoDeleteForm from "./PhotoDeleteForm";
import { useUser } from "../hooks/useUser";
type PhotoType = {
  id: number;
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  latitude: number;
  longitude: number;
  picture?: string | null;
};
interface PhotoModalProps {
  selectedPhoto: PhotoType;
  onClose: () => void;
}
const PhotoModal: React.FC<PhotoModalProps> = ({ selectedPhoto, onClose }) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.showModal(); // Ouvre le modal
    }
  }, []);
  return (
    <dialog ref={modalRef} className="modal-overlay" onClose={onClose}>
      <div className="modal-content">
        <button
          type="button"
          className="close-button"
          onClick={onClose}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              onClose();
            }
          }}
          aria-label="Fermer le modal"
        >
          X
        </button>
        <img
          className="modal-image"
          src={`${import.meta.env.VITE_API_URL}/photos/${selectedPhoto.picture ?? "default-picture.jpg"}`}
          alt={selectedPhoto.title}
        />
        <p className="modal-title">{selectedPhoto.title}</p>
      </div>
    </dialog>
  );
};
function CardChasseurs() {
  const { user, isAuthenticated } = useUser();
  const [photos, setPhotos] = useState<PhotoType[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoType | null>(null);
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/photos`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des photos.");
        const data = await response.json();
        setPhotos(data);
      } catch (error) {
        console.error("Erreur de chargement des photos :", error);
      }
    };
    fetchPhotos();
  }, []);
  const handleDelete = async (photoId: number) => {
    const isConfirmed = window.confirm("Êtes-vous sûr·e de vouloir supprimer cette photo ?");
    if (!isConfirmed) return;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/photos/${photoId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Échec de la suppression");
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== photoId));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  return (
    <section className="carte-photo">
      <h1 className="liste-streetArt">LES ŒUVRES STREET ART</h1>
      <div className="cards_grid">
        {photos.map((photo) => (
          <section className="streetArtPhotos" key={photo.id}>
            <h2 className="titre-photo">{photo.title}</h2>
            <button
              type="button"
              className="image-container"
              onClick={() => setSelectedPhoto(photo)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  setSelectedPhoto(photo);
                }
              }}
              tabIndex={0}
              aria-label={`Voir l'image de ${photo.title}`}
            >
              <img
                src={`${import.meta.env.VITE_API_URL}/photos/${photo.picture ?? "default-picture.jpg"}`}
                alt={photo.title}
              />
            </button>
            <p className="artist_content">{photo.artist}</p>
            <p className="photo_content">{photo.content}</p>
            <div className="delete_photo_content">
              <p className="date_content">{formatDate(photo.dateoftheday)}</p>
              {isAuthenticated && user?.is_admin && (
                <PhotoDeleteForm onSubmit={(e) => e.preventDefault()} id={photo.id}>
                  <button
                    type="button"
                    className="delete-photo-button"
                    onClick={() => handleDelete(photo.id)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        handleDelete(photo.id);
                      }
                    }}
                    aria-label={`Supprimer la photo ${photo.title}`}
                  >
                    Supprimer
                  </button>
                </PhotoDeleteForm>
              )}
            </div>
          </section>
        ))}
      </div>
      {selectedPhoto && <PhotoModal selectedPhoto={selectedPhoto} onClose={() => setSelectedPhoto(null)} />}
    </section>
  );
}
export default CardChasseurs;