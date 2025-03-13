import { type ReactNode, createContext, useEffect, useState } from "react";

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
      })
      .then((data) => {
        setUserId(data.id);
      })
      .catch(() => {
        setIsAuthenticated(false);
        setUserId(null);
      });
    // }
  }, []);

  useEffect(() => {
    if (!userId) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => console.error("Error while fetching :", error));
  }, [userId]);

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
