
import { changePasswordByUserId, loginAuthService, logoutAuthService } from "./auth.service"
import {Request as ExpressRequest, Response} from 'express';
import {Request} from '../../utils/interface'
const login = async (req: ExpressRequest, res: Response) => {
    await loginAuthService(req.body, res)
}

const logout = async (req: Request, res: Response) => {

    const authorization = req.headers.authorization
    if(!authorization) {
        return res.status(400).json({
            status: false,
            message: 'Authorization header not found'
        })
    }
    const token = authorization.split(' ')[1]
    return await logoutAuthService(token, res)
}

const changePassword = async (req: Request, res: Response) => {

    const {user} = req
    if(!user) {
        return res.status(400).json({
            status: false,
            message: 'User not found'
        })
    }

    await changePasswordByUserId({
        userId: user.id,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword
    }, res)
}

export {
    login,
    logout,
    changePassword
}