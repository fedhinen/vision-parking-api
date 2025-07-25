import { Router } from "express";
import { uploadFile, downloadFile, getFileInfo, deleteFile } from "../controllers/files.controller";
import { upload } from "../middleware/multer";
import { authenticate } from "../middleware/authenticate";

const router = Router();

router.get("/", authenticate,)

router.post(
    "/upload",
    authenticate,
    upload.single("file"),
    uploadFile
);

router.get("/download/:id", downloadFile);

router.get("/info/:fil_relation_id", getFileInfo);

router.delete("/:id", authenticate, deleteFile);

export { router as filesRoutes };
