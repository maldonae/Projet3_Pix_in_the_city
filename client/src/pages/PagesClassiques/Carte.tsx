import { useEffect, useState } from "react";
import Footer from "../../components/common/Footer";
import Header from "../../components/common/Header";
import SideBar from "../../components/common/SideBar"; // Import de la SideBar
import MapStretArt from "../../components/MapStreetArt";
import type PhotoType from "../../types/PhotoType";
import "./Carte.css";

function CartePage() {
  // Déclaration de l'état pour stocker les photos récupérées depuis l'API
  const [photos, setPhotos] = useState<PhotoType[] | []>([]);
  // // Déclaration de l'état pour détecter si l'affichage est en mode desktop (par rapport à la side barre)
  const [isDesktop, setIsDesktop] = useState<boolean>(false);

  // s'exécute au montage du composant
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/photos`, {
      credentials: "include",
    })
      .then((responseData) => {
        return responseData.json();
      })
      .then((datajson) => {
        setPhotos(datajson);
      })
      .catch((_error) => {});

    // Vérifier si la taille de l'écran est desktop
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // Définit "isDesktop" si la largeur de l'écran est supérieure à 1024px
    };

    window.addEventListener("resize", handleResize); // Ajoute un écouteur d'événement pour voir si l'utilisateur utilise un écran desktop. La sidebar s'affiche ou non en fonction
    handleResize(); // Appel initial pour vérifier la taille de l'écran

    return () => {
      window.removeEventListener("resize", handleResize); // nettoyage de l'écouteur d'évenement lors du montage du composant
    };
  }, []);

  return (
    <div className="container-carte">
      <header>
        <Header />
      </header>
      <main>
        {isDesktop && <SideBar />}{" "}
        {/* Afficher la sidebar uniquement si c'est un écran desktop */}
        <div className="carte-leaflet">
          {photos.length > 0 ? (
            <MapStretArt
              photos={photos}
              apiUrl={import.meta.env.VITE_API_URL}
            />
          ) : (
            <p>Chargement des photos...</p>
          )}
        </div>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default CartePage;
