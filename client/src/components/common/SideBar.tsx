import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import IconMarker from "../../assets/images/footer_icons/icon_marker.png";
import IconArtwork from "../../assets/images/footer_icons/icon_artwork.png";
import IconRules from "../../assets/images/footer_icons/icon_rules.png";
import IconContact from "../../assets/images/footer_icons/icon_contact.png";
import IconAdd from "../../assets/images/footer_icons/icon_add.png";
import { useUser } from "../../hooks/useUser"; // Import du hook personnalisé
import "../../styles (anciennement CSS)/common/SideBar.css";

function SideBar() {
  const { user, userId, setUserId, isAuthenticated, setIsAuthenticated } =
    useUser();
  const navigate = useNavigate(); // Utiliser le hook useNavigate pour la redirection

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        setIsAuthenticated(false);
        setUserId(null); // Déconnecte l'utilisateur en réinitialisant le contexte
        navigate("/"); // Redirige vers la page d'accueil
      }
    });
  };

  const goToProfile = () => {
    if (userId) {
      navigate("/profil/"); // Redirection vers le profil de l'utilisateur
      window.location.reload(); // Rafraîchir la page pour recharger l'état
    }
  };

  const goToEditProfile = () => {
    if (userId) {
      navigate(`/modifier_mon_profil/${userId}`); // Redirection vers la modification du profil
    }
  };

  const handlePostArtwork = (event: { preventDefault: () => void }) => {
    if (!isAuthenticated) {
      event.preventDefault(); // Annule la navigation du <Link>
      alert("Vous devez être connecté pour publier une œuvre !");
    }
  };

  return (
    <section className="sidebar">
      <section id="sidebar-header">
        <div className="sidebar-logo">
          <Link to="/">
            <img src={Logo} alt="Logo" className="logo-sidebar" />
          </Link>
        </div>
        {isAuthenticated ? (
          <div className="sidebar-welcome">
            <span className="welcome_username">
              <p id="welcome">Bienvenue</p>
              <p id="header_username">{user?.pseudo}</p>
            </span>
            <button
              type="button"
              className="sidebar-button-logged"
              onClick={goToProfile}
            >
              Voir mon profil
            </button>
            <button
              type="button"
              className="sidebar-button-logged"
              onClick={goToEditProfile}
            >
              Modifier mon profil
            </button>
            <button
              id="logout_btn"
              type="button"
              className="sidebar-button-logged"
              onClick={handleLogout}
            >
              Déconnexion
            </button>
          </div>
        ) : (
          <div className="sidebar-buttons">
            <Link to="/login">
              <button type="button" className="sidebar-button">
                Connexion
              </button>
            </Link>
            <Link to="/Creation_de_profil">
              <button type="button" className="sidebar-button">
                Créer mon compte
              </button>
            </Link>
          </div>
        )}
      </section>

      <section id="sidebar-footer">
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/">
                <button type="button" className="sidebar-button_footer">
                  <img
                    src={IconMarker}
                    alt="marker"
                    className="sidebar-icon_footer"
                  />
                  <p>CARTE</p>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/oeuvres">
                <button type="button" className="sidebar-button_footer">
                  <img
                    src={IconArtwork}
                    alt="ranking"
                    className="sidebar-icon_footer"
                  />
                  <p>ŒUVRES</p>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/regles">
                <button type="button" className="sidebar-button_footer">
                  <img
                    src={IconRules}
                    alt="rules"
                    className="sidebar-icon_footer"
                  />
                  <p>RÈGLES</p>
                </button>
              </Link>
            </li>
            <li>
              <Link to="/contact">
                <button type="button" className="sidebar-button_footer">
                  <img
                    src={IconContact}
                    alt="contact"
                    className="sidebar-icon_footer"
                  />
                  <p>CONTACTS</p>
                </button>
              </Link>
            </li>
          </ul>
        </nav>

        <Link to="/post_a_photo">
          <button type="button" className="button_camera" onClick={handlePostArtwork}>
            <img
              src={IconAdd}
              alt="camera"
              className="icon_camera"
            />
          </button>
          <p id="add-artwork">AJOUTER UNE ŒUVRE</p>
        </Link>
      </section>
    </section>
  );
}

export default SideBar;
