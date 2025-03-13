import { useNavigate } from "react-router-dom";
import Trash from "../../assets/images/trash-bin.png";
import EditUserForm from "../../components/EditUserForm";
import { useUser } from "../../hooks/useUser";

function ModifProfil() {
  const navigate = useNavigate();
  const { user } = useUser();

  return (
    <>
      {user && (
        <EditUserForm
          defaultValue={user} // Passage des données actuelles au formulaire
          onSubmit={(userData) => {
            // Requête PUT pour mettre à jour l'utilisateur
            fetch(`${import.meta.env.VITE_API_URL}/api/users/${user.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData), // Envoi des données mises à jour au serveur
            }).then((response) => {
              if (response.status === 204) {
                navigate("/profil");
                window.location.reload();
              }
            });
          }}
          extraButton={
            // Bouton supplémentaire pour la suppression du compte
            <button
              onClick={() => navigate(`/supprimer_mon_profil/${user.id}`)}
              className="delete-profil-button"
              type="button"
            >
              <img className="poubelle" src={Trash} alt="poubelle-icon" />
              Supprimer mon compte
            </button>
          }
        >
          Modifier
        </EditUserForm>
      )}
    </>
  );
}

export default ModifProfil;
