import { NotFoundError } from "../middleware/error/error"
import { ERROR_CATALOG } from "../utils/error-catalog"
import { prisma } from "../utils/lib/prisma"

const {
    LNG072
} = ERROR_CATALOG.businessLogic

const getStatusByTableAndName = async (table: string, statusName: string) => {
    const status = await prisma.status.findFirst({
        where: {
            stu_name: statusName,
            stu_table: table
        },
        select: {
            stu_id: true
        }
    })

    if (!status) {
        throw new NotFoundError(LNG072)
    }

    return status
}

export const statusService = {
    getStatusByTableAndName
}