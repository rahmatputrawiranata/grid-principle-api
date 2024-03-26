import { Response } from "express"
import { Request } from "../../utils/interface"
import { PrismaClient, Prisma } from "@internal/prisma-mongo/client"

const prisma = new PrismaClient()

const list = async (req: Request, res: Response) => {
    const query = req.query
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const offset = (page - 1) * limit
    
    const whereCondition: Prisma.BookWhereInput = {
        isDeleted: false
    }

    if(query.keyword) {
        whereCondition.title = {
            contains: query.keyword as string
        }
    }
    const data = await prisma.book.findMany({
        where: whereCondition,
        skip: offset,
        take: limit
    })

    const total = await prisma.book.count({
        where: whereCondition
    })

    res.json({
        status: true,
        message: "List of books",
        response: {
            data,
            total
        }
    })
}

const create = async (req: Request, res: Response) => {
    const body = req.body
    const data = await prisma.book.create({
        data: {
            title: body.title,
            author: body.author,
        }
    })

    res.json({
        status: true,
        message: "Book has been created",
        response: data
    })
}

const update = async (req: Request, res: Response) => {
    const id = req.params.id
    const body = req.body
    const isBookValid = await prisma.book.findFirst({
        where: {
            id: id
        }
    })

    if(!isBookValid) {
        res.status(404).json({
            status: false,
            message: "Book not found"
        })
    }

    const data = await prisma.book.update({
        where: {
            id: id
        },
        data: {
            title: body.title,
            author: body.author
        }
    })

    res.json({
        status: true,
        message: "Book has been updated",
        response: data
    })
}

const remove = async (req: Request, res: Response) => {
    const id = req.params.id as string

    if(!id) {
        res.status(400).json({
            status: false,
            message: "ID is required"
        })
    }
    const isBookValid = await prisma.book.findFirst({
        where: {
            id
        }
    })

    if(!isBookValid) {
        res.status(404).json({
            status: false,
            message: "Book not found"
        })
    }

    const data = await prisma.book.update({
        where: {
            id
        },
        data: {
            deletedAt: new Date(),
            isDeleted: true
        }
    })

    res.json({
        status: true,
        message: "Book has been deleted",
        response: data
    }) 
}

const detail = async (req: Request, res: Response) => {
    const id = req.params.id as string
    const data = await prisma.book.findFirst({
        where: {
            id
        }
    })

    if(!data) {
        res.status(404).json({
            status: false,
            message: "Book not found"
        })
    }

    res.json({
        status: true,
        message: "Book detail",
        response: data
    }) 
}

export  {
    list,
    create,
    update,
    remove,
    detail
}