import { useNavigate } from "react-router-dom";
import NewUserForm from "../../components/NewUserForm";

function CreaProfil() {
  const navigate = useNavigate();

  // Objet contenant les valeurs par défaut du formulaire d'inscription
  const newUser = {
    firstname: "",
    lastname: "",
    pseudo: "",
    email: "",
    zip_code: "",
    city: "",
    password: "",
    passwordConfirm: "",
    is_gcu_accepted: false, // Acceptation des conditions d'utilisation (false par défaut)
    is_admin: false, // Statut administrateur (false par défaut)
  };

  return (
    //insertion du composant enfant qui gère le formulaire d'inscription
    <NewUserForm
      defaultValue={newUser}
      onSubmit={(userData) => {
        // Envoi des données du formulaire à l'API pour créer un nouvel utilisateur
        fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: 'include',
          body: JSON.stringify(userData),
        })
          .then((response) => {
            if (response.status === 403) {
              alert("Vérifiez les informations saisies !");
            } else {
              return response.json();
            }
          })
          // si l'utilisateur rempli bien le formulaire il / elle, sera renvoyé à la page de son profil
          .then(() => {
            navigate("/login");
          });
      }}
    />
  );
}

export default CreaProfil;
