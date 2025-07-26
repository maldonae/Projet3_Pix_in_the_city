// Import necessary modules from React and React Router
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
/* ************************************************************************* */
// Import the main app component
import App from "./App";
import CardChasseurs from "./components/CardChasseurs";
import { UserProvider } from "./contexts/UserContext";
import Carte from "./pages/PagesClassiques/Carte";
import UploadPhoto from "./pages/PagesClassiques/UploadPhoto";
import Classement from "./components/Leaderboard/classement";
import CreaProfil from "./pages/Profil/CreaProfil";
import DeleteProfil from "./pages/Profil/DeleteProfil";
import ModifProfil from "./pages/Profil/ModifProfil";
import Profil from "./pages/Profil/Profil";
import Login from "./pages/Secu/Login";
import CGU from "./pages/static/CGU";
import Contact from "./pages/static/Contact";
import Regles from "./pages/static/Regles";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Carte />,
      },
      {
        path: "regles",
        element: <Regles />,
      },
      {
        path: "Contact",
        element: <Contact />,
      },
      {
        path: "post_a_photo",
        element: <UploadPhoto />,
      },
      {
        path: "oeuvres",
        element: <CardChasseurs />,
      },
      {
        path: "classement",
        element: <Classement />,
      },
      {
        path: "creation_de_profil",
        element: <CreaProfil />,
      },
      {
        path: "modifier_mon_profil/:id",
        element: <ModifProfil />,
      },
      {
        path: "supprimer_mon_profil/:id",
        element: <DeleteProfil />,
      },
      {
        path: "profil",
        element: <Profil />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "cgu",
        element: <CGU />,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

createRoot(rootElement).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);
