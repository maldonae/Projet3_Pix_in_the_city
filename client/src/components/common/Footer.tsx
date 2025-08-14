import "../../styles (anciennement CSS)/common/Footer.css";
import { Link } from "react-router-dom";
import IconAdd from "../../assets/images/footer_icons/icon_add.png";
import IconArtwork from "../../assets/images/footer_icons/icon_artwork.png";
import IconContact from "../../assets/images/footer_icons/icon_contact.png";
import IconMarker from "../../assets/images/footer_icons/icon_marker.png";
import IconRules from "../../assets/images/footer_icons/icon_rules.png";
import { useUser } from "../../hooks/useUser"; // Import du hook pour récupérer l'état de l'utilisateur

function Footer() {
  const { isAuthenticated } = useUser(); // Récupérer l'état d'authentification de l'utilisateur
  // Fonction pour gérer la publication d'une œuvre
  const handlePostArtwork = (event: { preventDefault: () => void }) => {
    if (!isAuthenticated) {
      event.preventDefault(); // Annule la navigation du <Link>
      alert("Vous devez être connecté pour publier une œuvre !"); // Affiche l'alerte
    }
  };
  return (
    <footer>
      <Link to="/">
        <button type="button" className="button_footer">
          <img src={IconMarker} alt="marker" className="icon_footer" />
          <p>CARTE</p>
        </button>
      </Link>
      <Link to="/oeuvres">
        <button type="button" className="button_footer">
          <img src={IconArtwork} alt="ranking" className="icon_footer" />
          <p>ŒUVRES</p>
        </button>
      </Link>
      <Link to="/post_a_photo">
        <button
          type="button"
          className="button_camera"
          onClick={handlePostArtwork}
        >
          <img src={IconAdd} alt="camera" className="icon_camera" />
        </button>
      </Link>
      <Link to="/regles">
        <button type="button" className="button_footer">
          <img src={IconRules} alt="rules" className="icon_footer" />
          <p>RÈGLES</p>
        </button>
      </Link>
      <Link to="/contact">
        <button type="button" className="button_footer">
          <img src={IconContact} alt="contact" className="icon_footer" />
          <p>CONTACTS</p>
        </button>
      </Link>
    </footer>
  );
}
export default Footer;
