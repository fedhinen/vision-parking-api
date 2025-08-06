import { InternalServerError, NotFoundError } from "../middleware/error/error";
import { ERROR_CATALOG } from "../utils/error-catalog";
import { prisma } from "../utils/lib/prisma"

const {
    LNG019,
    LNG080,
    LNG081
} = ERROR_CATALOG.businessLogic

const createRFIDTag = async (body: any) => {
    const { rft_tag, cmp_id } = body

    try {
        const newRFIDTag = await prisma.rfid_tags.create({
            data: {
                rft_tag,
                cmp_id,
                rft_created_by: "system"
            }
        })

        return newRFIDTag;
    } catch (error) {
        throw new InternalServerError(LNG080)
    }
}

const getRFIDTagById = async (rfidTagId: string) => {
    try {
        const rfidTag = await prisma.rfid_tags.findUnique({
            where: {
                rft_id: rfidTagId
            }
        })

        if (!rfidTag) {
            throw new NotFoundError(LNG019)
        }

        return rfidTag;
    } catch (error) {
        throw error
    }
}

const getRFIDTagsByCompanyId = async (companyId: string) => {
    try {
        const rfigTags = await prisma.rfid_tags.findMany({
            where: {
                cmp_id: companyId,
            },
        })

        return rfigTags
    } catch (error) {
        throw new InternalServerError(LNG081)
    }
}

export const rfidTagService = {
    createRFIDTag,
    getRFIDTagById,
    getRFIDTagsByCompanyId
}