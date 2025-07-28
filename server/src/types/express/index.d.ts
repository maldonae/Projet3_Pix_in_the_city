// to make the file a module and avoid the TypeScript error
export type {};

interface AuthUser {
  id: number;
  email: string;
  pseudo: string;
  role: string;
}

declare global {
  namespace Express {
    export interface Request {
      /* ************************************************************************* */
      // ✅ CORRECTION: Mettre à jour avec votre interface AuthUser complète
      user?: AuthUser;
      /* ************************************************************************* */
    }
  }
}
