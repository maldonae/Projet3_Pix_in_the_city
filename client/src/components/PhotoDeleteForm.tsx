import type { ReactNode } from "react"; // gère les enfants du composants
import { useNavigate } from "react-router-dom";

type PhotoDeleteFormProps = {
  id: number;
  children?: ReactNode; // contenu du bouton (ici du texte supprimer lorsqu'il sera appelé)
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}; // exécutée lors de la soumission du formulaire

function PhotoDeleteForm({ id, children }: PhotoDeleteFormProps) {
  const navigate = useNavigate();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault(); //empêche le rechargement de la page lors de la soumission du formulaire

        fetch(`${import.meta.env.VITE_API_URL}/api/photos/${id}`, {
          method: "delete",
        }).then((response) => {
          if (response.status === 204) {
            navigate("/photos"); // Redirection vers la page des photos après suppression réussie
          }
        });
      }}
    >
      <button type="submit">{children}</button>
    </form>
  );
}

export default PhotoDeleteForm;
