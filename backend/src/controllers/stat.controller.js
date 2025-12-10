import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments();
    // const totalAlbums = await Album.countDocuments();

    /*
    1. Promise.all() ejecuta múltiples promesas en paralelo

        Los resultados se asignan a las 4 variables mediante destructuring

    2. Las consultas que se ejecutan:

        Song.countDocuments() → Cuenta todos los documentos en la colección Song
        User.countDocuments() → Cuenta todos los documentos en la colección User
        Album.countDocuments() → Cuenta todos los documentos en la colección Album

    3. Explicación de la agregación:

      Paso 1: $unionWith

        Combina documentos de la colección Song con la colección albums
        Crea un conjunto temporal con documentos de ambas colecciones

      Paso 2: $group

        Agrupa los documentos por el campo artist
        El operador $group con _id: "$artist" agrupa todos los documentos que tengan el mismo artista
        Esto elimina duplicados por artista

      Paso 3: $count

        Cuenta cuántos grupos únicos se crearon (cada grupo = un artista único)
        Devuelve un objeto como: { count: 25 }

    4. Ventaja de usar Promise.all:

        En lugar de hacer 4 consultas secuenciales (que sumarían los tiempos de cada una), 
        se ejecutan las 4 en paralelo, reduciendo significativamente el tiempo total de respuesta.
    */

    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] =
      await Promise.all([
        Song.countDocuments(),
        User.countDocuments(),
        Album.countDocuments(),

        Song.aggregate([
          {
            $unionWith: {
              coll: "albums",
              pipeline: [],
            },
          },
          {
            $group: {
              _id: "$artist",
            },
          },
          {
            $count: "count",
          },
        ]),
      ]);

    res
      .status(200)
      .json({
        totalSongs,
        totalUsers,
        totalAlbums,
        totalArtists: uniqueArtists[0]?.count || 0,
      });
  } catch (error) {
    next(error);
  }
};
