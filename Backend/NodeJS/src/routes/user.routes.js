import { Router } from "express";

import { 
    deleteUserById,
    getHistory,
    getTop5songs,
    getUserById,
    setHistory,
    top5Albumes,
    top3Artistas,
    updateUserImageById,
    updateUserInfoById,
    upload
} from "../controllers/user.controller.js";

const router = Router();

router.get("/usuario/ver/:id", getUserById);
router.get("/usuario/ver/top5/songs/:id", getTop5songs);
router.get("/usuario/ver/top3/artistas/:id", top3Artistas);
router.get("/usuario/ver/top5/albumes/:id", top5Albumes);
router.get("/usuario/ver/historico/:id", getHistory)
router.post("/usuario/add/history", setHistory);
router.patch("/usuario/modificar/info/:id", updateUserInfoById);
router.patch("/usuario/modificar/imagen", upload.single('imagen'), updateUserImageById);
router.delete("/usuario/eliminar/:id", deleteUserById);

export default router;