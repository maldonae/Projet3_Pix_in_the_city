import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type User = {
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
  //   // The C of CRUD - Create operation

  async create(user: Omit<User, "id">): Promise<number> {
    // Execute le query SQL INSERT pour ajouter un nouvel user à la table
    const [result] = await databaseClient.query<Result>(
      "insert into user (firstname, lastname, pseudo, email, zip_code, city, hashed_password, is_gcu_accepted, is_admin) values (?, ?, ?, ?, ?, ?, ?, ?, ?)",
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
      ],
    );

    // Retourne l'ID du nouvel user inserré
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute la query SQL Select pour récupérer un user spécifique grâce à son ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where id = ?",
      [id],
    );

    // Retourne la première row du résultat, qui représente l'user
    return rows[0] as User;
  }

  async readAll() {
    // Exécute la query SELECT de SQL SELECT pour récupérer tous les users de la table user
    const [rows] = await databaseClient.query<Rows>("select * from user");

    // Retourne un tableau
    return rows as User[];
  }

  async readByEmailWithPassword(email: string) {
    // Exécute la query SQL SELECT pour récupérer un user spécifique avec son email
    const [rows] = await databaseClient.query<Rows>(
      "select * from user where email = ?",
      [email],
    );

    // Retourne la première row du résultat, c'est-à-dire l'user
    return rows[0] as User;
  }
  // The U of CRUD - Update operation

  async update(user: User) {
    const { firstname, lastname, pseudo, email, zip_code, city, id } =
      user;

    const query =
      "UPDATE user SET firstname = ?, lastname = ?, pseudo = ?, email = ?, zip_code = ?, city = ? WHERE id = ?";
    const values = [
      firstname,
      lastname,
      pseudo,
      email,
      zip_code,
      city,
      id,
    ];

    const [result] = await databaseClient.query<Result>(query, values);
    return result.affectedRows;
  }

  async delete(id: number) {
    // Exécute la query SQL DELETE pour supprimer un user existant depuis la table
    const [result] = await databaseClient.query<Result>(
      "delete from user where id = ?",
      [id],
    );

    // Retourne combien de rows ont été affectés
    return result.affectedRows;
  }
}

export default new UserRepository();