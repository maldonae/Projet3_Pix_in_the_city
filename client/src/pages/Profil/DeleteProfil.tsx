import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteProfil.css";
import { useUser } from "../../hooks/useUser";

function DeleteProfil() {
  const navigate = useNavigate();
  const { id } = useParams(); // récupération de l'ID utilisateur depuis l'URL (paramètre dynamique comme profil/:id)
  const { setIsAuthenticated, setUserId } = useUser();
  
  const handleDelete = async () => {
    if (!id) return; // vérifie si un ID est présent sinon annule l'exécution du delete

    // Affichage du toast de confirmation
    toast.warn(
      <div>
        <p>
          Voulez-vous vraiment supprimer votre compte ? Cette action est
          irréversible
        </p>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            type="button"
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={confirmDelete}
          >
            Oui
          </button>
          <button
            type="button"
            style={{
              padding: "5px 10px",
              borderRadius: "5px",
              backgroundColor: "gray",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => toast.dismiss()}
          >
            Non
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false, // Ne se ferme pas automatiquement
        closeOnClick: false,
        draggable: false,
        closeButton: false, // Désactiver le bouton de fermeture par défaut
      },
    );
  };

  const confirmDelete = async () => {
    toast.dismiss(); // Fermer le toast de confirmation

    try {
      // requete pour supprimer le user identifié avec son ID de l'API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        },
      );
      // si la réponse est ok, le compte est supprimé, sinon envoi une erreur
      if (response.ok) {
        toast.success("Votre compte a été supprimé.");
        setUserId(null);
        setIsAuthenticated(false);
        navigate("/", { state: { deleted: true } });
        // redirection vers l'accueil avec un état
        window.location.reload(); // Rafraîchir la page pour recharger l'état
      } else {
        throw new Error("Erreur lors de la suppression du compte.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Une erreur est survenue.",
      );
    }
  };

  return (
    <>
      <ToastContainer 
        position="top-center"
        aria-label="Notifications de suppression de profil"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <section className="delete-account-container">
        <h1 id="delete_profile_title">SUPPRIMER MON PROFIL</h1>
        <p>Êtes-vous sûr·e de supprimer votre profil ? </p>
        <button onClick={handleDelete} className="delete-button" type="button">
          Oui, supprimer mon compte
        </button>
      </section>
    </>
  );
}

export default DeleteProfil;