import { useNavigate } from "react-router-dom";
import Trash from "../assets/images/trash-bin.png";

// Définition des types des props du composant
// id: optionnel, représente l'identifiant de l'utilisateur à supprimer
type UserDeleteFormProps = {
  id?: number; // L'ID peut être undefined si mal récupéré
  onDelete?: () => void; // Fonction à exécuter après suppression
};

// Fonction pour gérer la suppression de l'utilisateur
function UserDeleteForm({ id, onDelete }: UserDeleteFormProps) {
  const navigate = useNavigate();

  const handleDelete = async (event: React.MouseEvent) => {
    event.preventDefault();
    // Vérifie si l'ID de l'utilisateur est bien défini
    if (!id) {
      alert("Erreur : impossible de récupérer votre ID utilisateur.");
      return;
    }
    // Demande de confirmation avant de supprimer le profil
    const confirmDelete = window.confirm(
      "Voulez-vous vraiment supprimer votre profil ?",
    );
    if (!confirmDelete) return;
    // Envoie une requête DELETE à l'API pour supprimer l'utilisateur
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (response.ok) {
        alert("Votre profil a été supprimé avec succès.");
        if (onDelete) onDelete(); // Exécuter l'action personnalisée après suppression
        navigate("/"); // Redirection vers l'accueil
      } else {
        throw new Error("Erreur lors de la suppression du profil.");
      }
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    }
  };

  return (
    <form className="delete-form" onSubmit={(event) => event.preventDefault()}>
      {/* Bouton pour supprimer le compte, déclenchant handleDelete */}
      <button
        type="button"
        className="delete-profil-button"
        onClick={handleDelete}
      >
        <img src={Trash} alt="poubelle-icon" />
        Supprimer mon compte
      </button>
    </form>
  );
}

export default UserDeleteForm;
