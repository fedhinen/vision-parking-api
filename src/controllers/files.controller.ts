import { Request, Response } from "express";
import { prisma } from "../utils/lib/prisma";
import fs from "fs";
import { filesService } from "../services/files.service";

export const uploadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "No se proporcionó ningún archivo"
      });
      return;
    }

    const { fil_relation_id } = req.body;

    if (!fil_relation_id) {
      fs.unlinkSync(req.file.path);
      res.status(400).json({
        success: false,
        message: "fil_relation_id es requerido"
      });
      return;
    }

    if (!req.user?.usr_id) {
      fs.unlinkSync(req.file.path);
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    // Guardar información del archivo en la base de datos
    const fileRecord = await prisma.files.create({
      data: {
        fil_name: req.file.originalname,
        fil_relation_id: fil_relation_id,
        fil_path: req.file.path,
        fil_type: req.file.mimetype,
        fil_size: req.file.size,
        fil_created_by: req.user.usr_id,
      }
    });

    res.status(201).json({
      success: true,
      message: "Archivo subido correctamente",
      data: {
        fil_id: fileRecord.fil_id,
        fil_name: fileRecord.fil_name,
        fil_type: fileRecord.fil_type,
        fil_size: fileRecord.fil_size,
        fil_date: fileRecord.fil_date
      }
    });

  } catch (error) {
    // Eliminar el archivo si ocurrió un error
    if (req.file?.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error("Error al eliminar archivo:", unlinkError);
      }
    }

    console.error("Error al subir archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al subir el archivo"
    });
  }
};

export const downloadFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID del archivo es requerido"
      });
      return;
    }

    const fileRecord = await prisma.files.findFirst({
      where: {
        fil_id: id,
        fil_active: true
      }
    });

    if (!fileRecord) {
      res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
      return;
    }

    if (!fs.existsSync(fileRecord.fil_path)) {
      res.status(404).json({
        success: false,
        message: "El archivo físico no existe en el servidor"
      });
      return;
    }

    const stat = fs.statSync(fileRecord.fil_path);

    res.setHeader('Content-Type', fileRecord.fil_type);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Disposition', `attachment; filename="${fileRecord.fil_name}"`);

    const readStream = fs.createReadStream(fileRecord.fil_path);

    readStream.on('error', (error) => {
      console.error("Error al leer el archivo:", error);
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: "Error al leer el archivo"
        });
      }
    });

    readStream.pipe(res);

  } catch (error) {
    console.error("Error al descargar archivo:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Error interno del servidor al descargar el archivo"
      });
    }
  }
};

export const getFileInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fil_relation_id } = req.params;

    if (!fil_relation_id) {
      res.status(400).json({
        success: false,
        message: "ID del archivo es requerido"
      });
      return;
    }

    const fileRecord = await prisma.files.findFirst({
      where: {
        fil_relation_id: fil_relation_id,
        fil_active: true
      },
      select: {
        fil_id: true,
        fil_name: true,
        fil_relation_id: true,
        fil_type: true,
        fil_size: true,
        fil_date: true,
        fil_created_by: true
      }
    });

    if (!fileRecord) {
      res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: fileRecord
    });

  } catch (error) {
    console.error("Error al obtener información del archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
};

export const deleteFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        message: "ID del archivo es requerido"
      });
      return;
    }

    if (!req.user?.usr_id) {
      res.status(401).json({
        success: false,
        message: "Usuario no autenticado"
      });
      return;
    }

    const fileRecord = await prisma.files.findFirst({
      where: {
        fil_id: id,
        fil_active: true
      }
    });

    if (!fileRecord) {
      res.status(404).json({
        success: false,
        message: "Archivo no encontrado"
      });
      return;
    }

    // Unicamente soft delete
    await filesService.deleteFile(id, req.user.usr_id);

    res.status(200).json({
      success: true,
      message: "Archivo eliminado correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar archivo:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor al eliminar el archivo"
    });
  }
};
