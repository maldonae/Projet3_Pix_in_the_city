import { createContext, type ReactNode, useEffect, useState } from "react";

// Définir le type de l'utilisateur
interface User {
  id: number;
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  zip_code?: string; // optionnel
  city?: string; // optionnel
  is_gcu_accepted: boolean;
  is_admin: boolean;
  role?: string; // Nouveau : rôle utilisateur
}

// Créer un contexte avec un utilisateur par défaut
export interface UserContextType {
  userId: number | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setUserId: React.Dispatch<React.SetStateAction<number | null>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserContext = createContext<UserContextType | null>(null);

// Crée un provider pour fournir le contexte à l'application
const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/auth`, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (res.status === 200) {
          setIsAuthenticated(true);
          return res.json();
        }
        throw new Error("Not authenticated");
      })
      .then((data) => {
        setUserId(Number.parseInt(data.id));
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserId(null);
        setUser(null);
      });
  }, []);

  useEffect(() => {
    if (!userId || !isAuthenticated) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`, {
      credentials: "include", // Important : envoyer les cookies
    })
      .then((response) => {
        if (response.status === 401) {
          // Non autorisé - déconnecter l'utilisateur
          setIsAuthenticated(false);
          setUserId(null);
          setUser(null);
          return null;
        }
        if (response.status === 403) {
          return null;
        }
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          setUser(data);
        }
      })
      .catch((_error) => {
        // En cas d'erreur, on peut choisir de déconnecter ou non
        // setIsAuthenticated(false);
        // setUserId(null);
        // setUser(null);
      });
  }, [userId, isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        userId,
        setUserId,
        setUser,
        user,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
