import { NextFunction, Response } from "express";
import * as jwt from 'jsonwebtoken'
import { Request } from "../utils/interface";
import { PrismaClient } from "@prisma/client";
import { Redis } from "ioredis";

const {
    JWT_SECRET
} = process.env
const redis = new Redis()
const authenticateJWT = async(req: Request, res: Response, next: NextFunction) => {

    if(!JWT_SECRET) {
        return res.status(500).json({
            status: false,
            message: 'Server Internal Error'
        })
    }

    const authHeader = req.headers.authorization
    
    if(authHeader) {
        const token = authHeader.split(' ')[1];
        const isBlackListed = await redis.get(token)
        if(isBlackListed) {
            return res.sendStatus(403);
        }
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if(err) {
                return res.sendStatus(403);
            }

            const userFromJWT = user as {id: number, email: string}

            req.user = userFromJWT
            next();
        });
    }else{
        res.sendStatus(401);
    }

}

export default authenticateJWT