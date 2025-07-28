import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

export type User = {
  role: string;
  id: number;
  firstname: string;
  lastname: string;
  pseudo: string;
  email: string;
  zip_code?: number;
  city?: string;
  hashed_password: string;
  is_gcu_accepted: boolean;
  is_admin: boolean;
};

class UserRepository {
  // The C of CRUD - Create operation
  async create(user: Omit<User, "id">): Promise<number> {
    // ✅ CORRECTION: Ajout de la colonne role dans l'INSERT
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, pseudo, email, zip_code, city, hashed_password, is_gcu_accepted, is_admin, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.lastname,
        user.pseudo,
        user.email,
        user.zip_code ?? null,
        user.city ?? null,
        user.hashed_password,
        user.is_gcu_accepted,
        user.is_admin,
        user.role || (user.is_admin ? "admin" : "user"), // ✅ Définir role basé sur is_admin
      ],
    );
    return result.insertId;
  }

  // The Rs of CRUD - Read operations
  async read(id: number): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );

    if (!rows[0]) return null;

    const user = rows[0] as User;
    // ✅ CORRECTION: S'assurer que role est défini si manquant en BDD
    if (!user.role) {
      user.role = user.is_admin ? "admin" : "user";
    }

    return user;
  }

  async readAll(): Promise<User[]> {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    const users = rows as User[];

    // ✅ CORRECTION: S'assurer que tous les users ont un role
    return users.map((user) => ({
      ...user,
      role: user.role || (user.is_admin ? "admin" : "user"),
    }));
  }

  async readByEmailWithPassword(email: string): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );

    if (!rows[0]) return null;

    const user = rows[0] as User;
    // ✅ CORRECTION: S'assurer que role est défini pour l'authentification
    if (!user.role) {
      user.role = user.is_admin ? "admin" : "user";
    }

    return user;
  }

  // ✅ CORRECTION: Méthode update avec types stricts et logique simplifiée
  async update(
    userData: { id: number } & Partial<Omit<User, "id">>,
  ): Promise<number> {
    const { id, ...fieldsToUpdate } = userData;

    // Supprimer les champs undefined et construire les arrays
    const entries = Object.entries(fieldsToUpdate).filter(
      ([_, value]) => value !== undefined,
    );

    if (entries.length === 0) {
      throw new Error("No fields to update");
    }

    // ✅ CORRECTION: Synchroniser is_admin avec role si role est modifié
    const updateData: Record<string, unknown> = {};

    for (const [key, value] of entries) {
      updateData[key] = value;
    }

    // Si role est modifié, synchroniser is_admin
    if ("role" in updateData && typeof updateData.role === "string") {
      updateData.is_admin = updateData.role === "admin";
    }

    const finalEntries = Object.entries(updateData);
    const fields = finalEntries.map(([key]) => key);
    const values = finalEntries.map(([_, value]) => value);

    const setClause = fields.map((field) => `${field} = ?`).join(", ");
    const query = `UPDATE user SET ${setClause} WHERE id = ?`;

    values.push(id);

    const [result] = await databaseClient.query<Result>(query, values);
    return result.affectedRows;
  }

  async delete(id: number): Promise<number> {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM user WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  // ✅ NOUVELLE MÉTHODE: Mettre à jour le rôle spécifiquement
  async updateRole(id: number, role: "user" | "admin"): Promise<number> {
    const isAdmin = role === "admin";

    const [result] = await databaseClient.query<Result>(
      "UPDATE user SET role = ?, is_admin = ? WHERE id = ?",
      [role, isAdmin, id],
    );

    return result.affectedRows;
  }
}

export default new UserRepository();
