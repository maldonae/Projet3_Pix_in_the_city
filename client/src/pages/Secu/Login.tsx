import { Link, useNavigate } from "react-router-dom";
import "../../components/CSS/Login.css";
import { type FormEventHandler, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/images/logo.png";
import { useUser } from "../../hooks/useUser";

function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const [password, setPassword] = useState<string>("");
  const { setIsAuthenticated, isAuthenticated } = useUser(); // Utilisation d'une valeur par défaut (vide) si UserContext est undefined
  const navigate = useNavigate();

  const handleSubmit: FormEventHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: emailRef.current?.value, // Sécurise l'accès à emailRef
            password: password,
          }),
          credentials: "include",
        },
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        navigate("/profil");
        toast.success("Connexion réussie, commence à chasser !", {
          position: "top-center",
          autoClose: 3003,
        });
        window.location.reload(); // Rafraîchir la page pour recharger l'état
      } else {
        toast.error("Email ou mot de passe incorrect. Compte inexistant", {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  console.info(isAuthenticated);
  return (
    <>
      <ToastContainer position="bottom-left" />
      <section className="loginPage">
        <Link to="/">
          <img src={Logo} alt="Logo" id="logo_login" />
        </Link>
        <section className="labels_container">
          <div className="formulaire">
            <form onSubmit={handleSubmit}>
              <div className="email">
                <label htmlFor="identifiant">EMAIL</label>
                <br />
                <input
                  className="input_email"
                  type="email"
                  id="identifiant"
                  placeholder="email"
                  ref={emailRef}
                  required
                />
              </div>
              <div className="label2">
                <label htmlFor="mdp">MOT DE PASSE</label>
                <br />
                <input
                  className="input_password"
                  id="mdp"
                  placeholder="mot de passe"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login_button">
                CONNEXION
              </button>
            </form>
            <p className="text_visitor">OU</p>
            <Link to="/Creation_de_profil">
              <button type="button" className="signup_button">
                CRÉER MON COMPTE
              </button>
            </Link>
            <div className="text_login">
              <Link to="/">
                <p className="text_visitor">RESTER EN TANT QUE VISITEUR</p>
              </Link>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}

export default Login;
