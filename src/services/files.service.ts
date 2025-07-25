import { prisma } from "../utils/lib/prisma";
import fs from "fs";
import { promisify } from "util";

const statAsync = promisify(fs.stat);

export class FilesService {
  
  async createFile(fileData: {
    fil_name: string;
    fil_relation_id: string;
    fil_path: string;
    fil_type: string;
    fil_size: number;
    fil_created_by: string;
  }) {
    return await prisma.files.create({
      data: fileData
    });
  }

  async getFileById(fileId: string) {
    return await prisma.files.findFirst({
      where: {
        fil_id: fileId,
        fil_active: true
      }
    });
  }

  async deleteFile(fileId: string, deletedBy: string) {
    const updatedFile = await prisma.files.update({
      where: {
        fil_id: fileId
      },
      data: {
        fil_active: false,
        fil_created_by: deletedBy 
      }
    });

    return updatedFile;
  }

  async fileExists(filePath: string) {
    try {
      await statAsync(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async getFileStats(filePath: string) {
    try {
      return await statAsync(filePath);
    } catch (error) {
      return null;
    }
  }
}

export const filesService = new FilesService();
