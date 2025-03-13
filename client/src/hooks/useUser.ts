import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";

// Hook personnalisé pour accéder au UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};
