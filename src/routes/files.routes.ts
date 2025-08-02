import { Router } from "express";
import { uploadFile, downloadFile, getFileInfo, deleteFile } from "../controllers/files.controller";
import { upload } from "../middleware/multer";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.post(
    "/files/upload",
    authenticate,
    upload.single("file"),
    uploadFile
);

router.get("/files/download/:id", authenticate, downloadFile);

router.get("/files/info/:fil_relation_id", authenticate, getFileInfo);

router.delete("/files/:id", authenticate, deleteFile);

export { router as filesRoutes };
