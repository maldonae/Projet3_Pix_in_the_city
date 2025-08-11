import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Import de Toastify
import "react-toastify/dist/ReactToastify.css"; // Import du CSS de Toastify
import Trash from "../../assets/images/trash-bin.png";
import EditUserForm from "../../components/EditUserForm";
import { useUser } from "../../hooks/useUser";

function ModifProfil() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  if (!user) return null; // on attend que le user soit chargé

  return (
    <>
      <ToastContainer
        position="bottom-left"
        aria-label="Notifications de modification de profil"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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
              credentials: "include",
              body: JSON.stringify(userData), // Envoi des données mises à jour au serveur
            }).then((response) => {
              if (response.status === 204) {
                setUser({ ...user, ...userData });
                toast.success("Profil mis à jour avec succès !", {
                  position: "top-center",
                  autoClose: 3000,
                });
                setTimeout(() => navigate("/profil"), 1500);
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
