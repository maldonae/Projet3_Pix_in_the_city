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
import CreaProfil from "./pages/Profil/CreaProfil";
import DeleteProfil from "./pages/Profil/DeleteProfil";
import ModifProfil from "./pages/Profil/ModifProfil";
import Profil from "./pages/Profil/Profil";
import Login from "./pages/Secu/Login";
import CGU from "./pages/static/CGU";
import Contact from "./pages/static/Contact";
import Regles from "./pages/static/Regles";

// Import additional components for new routes
// Try creating these components in the "pages" folder

// import About from "./pages/About";
// import Contact from "./pages/Contact";

/* ************************************************************************* */

// Create router configuration with routes
// You can add more routes as you build out your app!
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Le composant principal qui englobe les autres pages
    children: [
      {
        path: "/",
        element: <Carte />, // La page principale (Carte)
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

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById("root");
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    {/* Envelopper l'application avec UserProvider */}
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
);

/**
 * Helpful Notes:
 *
 * 1. Adding More Routes:
 *    To add more pages to your app, first create a new component (e.g., About.tsx).
 *    Then, import that component above like this:
 *
 *    import About from "./pages/About";
 *
 *    Add a new route to the router:
 *
 *      {
 *        path: "/about",
 *        element: <About />,  // Renders the About component
 *      }
 *
 * 2. Try Nested Routes:
 *    For more complex applications, you can nest routes. This lets you have sub-pages within a main page.
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#nested-routes
 *
 * 3. Experiment with Dynamic Routes:
 *    You can create routes that take parameters (e.g., /users/:id).
 *    Documentation: https://reactrouter.com/en/main/start/tutorial#url-params-in-loaders
 */
