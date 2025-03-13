import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./DeleteProfil.css";
import { useUser } from "../../hooks/useUser";

function DeleteProfil() {
  const navigate = useNavigate();
  const { id } = useParams(); // récupération de l'ID utilisateur depuis l'URL (paramètre dynamique comme profil/:id)
  const { setIsAuthenticated, setUserId } = useUser();
  const handleDelete = async () => {
    if (!id) return; // vérifie si un ID est présent sinon annule l'exécution du delete

    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.",
    );
    if (!confirmDelete) return;

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
    <section className="delete-account-container">
      <h1 id="delete_profile_title">SUPPRIMER MON PROFIL</h1>
      <p>Êtes-vous sûr·e de supprimer votre profil ? </p>
      <button onClick={handleDelete} className="delete-button" type="button">
        Oui, supprimer mon compte
      </button>
    </section>
  );
}

export default DeleteProfil;
