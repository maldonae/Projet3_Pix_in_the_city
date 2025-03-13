import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import { useUser } from "../../hooks/useUser"; // Import du hook personnalisé
import "../../styles (anciennement CSS)/common/Header.css";

function Header() {
  const { user, userId, setUserId, isAuthenticated, setIsAuthenticated } =
    useUser();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/Creation_de_profil");
  };

  const handleLogout = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/logout`, {
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) setIsAuthenticated(false);
      navigate("/"); // Redirige vers la page d'accueil
      setUserId(null); // Déconnecte l'utilisateur en réinitialisant le contexte
    });
  };

  const goToProfile = () => {
    if (userId) {
      navigate("/profil/");
    }
  };

  const goToEditProfile = () => {
    if (userId) {
      navigate(`/modifier_mon_profil/${userId}`);
    }
  };

  return (
    <header className="header">
      {/* Logo à gauche */}
      <Link to="/">
        <img src={Logo} alt="Logo" id="logo" />
      </Link>

      {/* Boutons à droite */}
      <nav className="buttons">
        {isAuthenticated === true ? (
          <>
            <div className="center-container">
              <span className="welcome_username">
                <p id="welcome">Bienvenue</p>
                <p id="header_username">{user?.pseudo}</p>
              </span>
            </div>
            <button
              type="button"
              className="button_header"
              onClick={goToProfile}
            >
              VOIR MON PROFIL
            </button>
            <button
              type="button"
              className="button_header"
              onClick={goToEditProfile}
            >
              MODIFIER PROFIL
            </button>
            <button
              type="button"
              className="button_header"
              onClick={handleLogout}
            >
              DÉCONNEXION
            </button>
          </>
        ) : (
          <>
            <button type="button" id="login_button" onClick={handleLogin}>
              CONNEXION
            </button>
            <button type="button" id="signup_button" onClick={handleSignup}>
              CRÉER MON COMPTE
            </button>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;
