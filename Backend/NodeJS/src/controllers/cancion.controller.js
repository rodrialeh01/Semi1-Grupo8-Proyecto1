import { pool } from "../db.js";
import multer from 'multer';
import { saveObj, deleteObj } from '../config/objectHandler.js';
import { tipoObjeto } from '../config/constants.js';
import { comparePassword } from "../config/objectHandler.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const uploadImageSong = async (req, res) => {

    try {
        const { buffer, originalname } = req.file;
        const fileExtension = originalname.split('.').pop();
    
        const { Key: id_imagen, Location: path_imagen } = await saveObj(buffer, fileExtension, tipoObjeto.IMG);
    
        res.status(200).json( { id_imagen, path_imagen } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const uploadSong = async (req, res) => {

    try {
        const { buffer, originalname } = req.file;
        const fileExtension = originalname.split('.').pop();
    
        const { Key: id_cancion, Location: path_cancion } = await saveObj(buffer, fileExtension, tipoObjeto.SONG);
    
        res.status(200).json( { id_cancion, path_cancion } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
    
}

export const createSong = async (req, res) => {

    try {
        const { nombre, duracion, id_imagen, path_imagen, id_cancion, path_cancion, id_artista } = req.body;
        let status = false;
    
        try{
            const query = await pool.query("INSERT INTO cancion (nombre, duracion, id_imagen, path_imagen, id_obj_cancion, path_cancion, id_artista) VALUES (?,?,?,?,?,?,?)", [nombre, duracion, id_imagen, path_imagen, id_cancion, path_cancion, id_artista]);
            status = query[0].affectedRows > 0;
        } catch (error) {
            console.log(error);
            status = false;
        }
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getSongs = async (req, res) => {

    try {
        const query = await pool.query("SELECT c.*, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM cancion c, artista a WHERE c.id_artista=a.id_artista");
    
        const songs = query[0];
    
        res.status(200).send(songs);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getSongById = async (req, res) => {
    
    try{
        const { id } = req.params;
        
        const query = await pool.query("SELECT c.*, CONCAT(a.nombres, ' ', COALESCE(a.apellidos, '')) AS nombre_artista FROM cancion c, artista a WHERE c.id_artista=a.id_artista AND c.id_cancion=?", [id]);

        const song = query[0][0];

        return res.status(200).json(song);
    } catch (error) {
        console.log(error);
        return res.status(200).json({});
        
    }
}

export const getSongsWithAlbum = async (req, res) => {

    try {
        const query = await pool.query("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion");
        const songs = query[0];
    
        res.status(200).send(songs);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getSongAlbumById = async (req, res) => {

    try {
        const { id } = req.params;
        // const query = await pool.query("SELECT * FROM cancion WHERE id_cancion = ?", [id]);
        const query = await pool.query("SELECT cancion.*, cancion_album.id_album FROM cancion LEFT JOIN cancion_album ON cancion.id_cancion = cancion_album.id_cancion WHERE cancion.id_cancion = ?", [id]);
        const song = query[0][0];
    
        res.status(200).send(song);

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }
}

export const updateSongInfoById = async (req, res) => {
        
    let status = false;
    try {
        const id = req.params.id;
    
        const { nombre, duracion, id_artista } = req.body;

        const query = await pool.query("UPDATE cancion SET nombre = ?, duracion = ?, id_artista = ? WHERE id_cancion = ?", [nombre, duracion, id_artista, id]); 
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );
    } catch (error) {
        console.log(error);
        status = false;
        res.status(200).json( { status } );
    }
}

export const updateSongImageById = async (req, res) => {

    try {
        const id = req.params.id;
    
        const { id_imagen, path_imagen } = req.body;
        let status = false;
    
        const query = await pool.query("UPDATE cancion SET id_imagen = ?, path_imagen = ? WHERE id_cancion = ?", [id_imagen, path_imagen, id]);
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const updateSongById = async (req, res) => {

    try {
        const id = req.params.id;
    
        const { id_cancion, path_cancion } = req.body;
        let status = false;
    
        const query = await pool.query("UPDATE cancion SET id_obj_cancion = ?, path_cancion = ? WHERE id_cancion = ?", [id_cancion, path_cancion, id]);
        status = query[0].affectedRows > 0;
    
        res.status(200).json( { status } );

    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const deleteSongById = async (req, res) => {

    try {

        const { idUser, idSong, password } = req.body;
    
        const query = await pool.query("SELECT * FROM usuario WHERE id_usuario = ?", [idUser]);
    
        if(query[0].length > 0)
        {
    
            if(query[0][0].rol != 1)
            {
                console.log(query[0].rol);
                return res.status(200).json( { status: false } );
            }
    
            const { password: passwordCifrado } = query[0][0];
            const isPasswordCorrect = await comparePassword(password, passwordCifrado);
    
            if(isPasswordCorrect)
            {
                const query2 = await pool.query("SELECT * FROM cancion WHERE id_cancion = ?", [idSong]);
    
                if(query2[0].length > 0)
                {
                    try {
                        const { id_imagen, id_obj_cancion } = query2[0][0];
                        await deleteObj(id_imagen);
                        await deleteObj(id_obj_cancion);
                        const delete4 = await pool.query("DELETE FROM cancion WHERE id_cancion = ?", [idSong]);
                        const status = delete4[0].affectedRows > 0;
                        res.status(200).json( { status } );
                    } catch (error) {
                        console.log(error);
                        res.status(500).json( { status: false } );
                    }
                }
                else
                {
                    res.status(200).json( { status: false } );
                }
            }
            else{
                res.status(200).json( { status: false } );
            }
        }
        else{
            res.status(200).json( { status: false } );
        }
    } catch (error) {
        console.log(error);
        res.status(500).json( { status: false } );
    }

}

export const getSongAlbumNullByArtist = async (req, res) => {
    
    try{
        const { id } = req.params;
        const query = await pool.query("SELECT * FROM cancion WHERE id_artista = ? AND id_cancion NOT IN (SELECT id_cancion FROM cancion_album)", [id]);

        const songs = query[0];

        res.status(200).send(songs);
    } catch (error) {
        console.log(error);
        res.status(500).send([]);
    }
}