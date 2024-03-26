import { PrismaClient } from "@internal/prisma-mysql/client";
import { LoginInterface } from "./auth.interface";
import { Response } from "express";
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import { Redis } from "ioredis";

const prisma = new PrismaClient()
const redis = new Redis()
const {
    JWT_SECRET 
} = process.env

export async function loginAuthService(request: LoginInterface, res: Response) {

    if(!JWT_SECRET) {
        return res.status(500).json({
            status: false,
            message: 'Server Internal Error'
        })
    }

    const {
        email,
        password
    } = request

    if(!email || !password) {
        return res.status(400).json({ 
            status: false,
            message: 'Invalid input',
            errors: [
                {
                    field: 'email',
                    message: 'Email is required'
                },
                {
                    field: 'password',
                    message: 'Password is required'
                }
            ]
         })
    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
    })

    if (!user) {
        return res.status(401).json({ 
            status: false,
            message: 'User not found',
            errors: [
                {
                    field: 'email',
                    message: 'Invalid email'
                }
            ]
         })
    }

    const isPasswordmatch = await bcrypt.compare(password, user.password)
    if(!isPasswordmatch) {
        return res.status(401).json({ 
            status: false,
            message: 'Invalid password',
            errors: [
                {
                    field: 'password',
                    message: 'Invalid password'
                }
            ]
         })
    }

    const token = jwt.sign({
        email: user.email,
        id: user.id
    }, JWT_SECRET, { expiresIn: '1h' })
    return res.status(200).json({ 
        status: true,
        message: 'Login successful',
        response: {
            token
        }
    })
}

export async function changePasswordByUserId({
    userId,
    oldPassword,
    newPassword
}: {
    userId: number,
    oldPassword: string,
    newPassword: string
}, res: Response) {
    if(!oldPassword) {
        return res.status(400).json({
            status: false,
            message: 'Invalid input',
            errors: [
                {
                    field: 'oldPassword',
                    message: 'Old password is required'
                }
            ]
        })
    }

    if(!newPassword) {
        return res.status(400).json({
            status: false,
            message: 'Invalid input',
            errors: [
                {
                    field: 'newPassword',
                    message: 'New password is required'
                }
            ]
        })
    }

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if (!user) {
        return res.status(401).json({
            status: false,
            message: 'User not found'
        })
    }

    const isPasswordmatch = await bcrypt.compare(oldPassword, user.password)
    if(!isPasswordmatch) {
        return res.status(400).json({
            status: false,
            message: 'Invalid password'
        })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            password: hashedPassword
        }
    })

    return res.status(200).json({
        status: true,
        message: 'Password updated'
    })

}

export async function logoutAuthService(token: string, res: Response) {
    await redis.set(token,  "invalid", 'EX', 60 * 60)

    return res.status(200).json({
        status: true,
        message: 'Logout success'
    })
}