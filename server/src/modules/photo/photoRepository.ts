import type { Result, Rows } from "../../../database/client";
import databaseClient from "../../../database/client";

type Photo = {
  id: number;
  title: string;
  content: string;
  artist: string;
  dateoftheday: string;
  latitude: number;
  longitude: number;
  picture?: string | null;
  user_id: number;
};

class PhotoRepository {
  async create(photo: Omit<Photo, "id">) {
    const defaultLatitude = 45.7455; // Latitude par défaut (centre de Lyon)
    const defaultLongitude = 4.8278; // Longitude par défaut (centre de Lyon)

    const latitude = photo.latitude ?? defaultLatitude; // Valeur ou défaut
    const longitude = photo.longitude ?? defaultLongitude; // Valeur ou défaut
    // Exécute l'insertion SQL query pour ajouter une nouvelle photo à la photo table
    const [result] = await databaseClient.query<Result>(
      "insert into photo (title, content, artist, dateoftheday, latitude, longitude, picture, user_id) values (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        photo.title,
        photo.content,
        photo.artist,
        photo.dateoftheday,
        latitude,
        longitude,
        photo.picture,
        photo.user_id,
      ],
    );

    // Retourne l'ID de la nouvelle photo inserrée
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(photoId: number) {
    // Exécute le SQL select pour rendre une photo spécifique grâce à son ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from photo where id = ?",
      [photoId],
    );

    // retourne la première row du résultat qui représente une photo
    return rows[0] as Photo;
  }

  async readAll() {
    // // Exécute le SQL select pour rendre toutes les photos de la table
    const [rows] = await databaseClient.query<Rows>("select * from photo");

    // Return un tableau de photos
    return rows as Photo[];
  }

  async delete(id: number) {
    // Execute la query DELETE de SQL pour supprimer une photo identifiée par son ID
    const [result] = await databaseClient.query<Result>(
      "delete from photo where id = ?",
      [id],
    );

    // retourne combien de rows ont été affectés
    return result.affectedRows;
  }
}

export default new PhotoRepository();
