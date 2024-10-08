import { Router } from "express";
import { 
    addSongToAlbum,
    createAlbum, 
    deleteAlbumById,  
    deleteSongAlbum,  
    getAlbumById,  
    getAlbumSongsById, 
    getAlbums, 
    getAlbumsByArtist,
    updateAlbumImagenById,
    updateAlbumInfoById,
    upload
} from "../controllers/album.controller.js";

const router = Router();

router.post("/album/crear", upload.single('imagen'), createAlbum);
router.post("/album/add/song", addSongToAlbum);
router.get("/album/listar", getAlbums);
router.get("/album/ver/album/:id", getAlbumById);
router.get("/album/ver/:id", getAlbumsByArtist);
router.get("/album/ver/canciones/:id", getAlbumSongsById);
router.patch("/album/modificar/info/:id", updateAlbumInfoById);
router.patch("/album/modificar/imagen/:id", upload.single('imagen'), updateAlbumImagenById);
router.delete("/album/eliminar", deleteAlbumById);
router.delete("/album/eliminar/song", deleteSongAlbum);

export default router;