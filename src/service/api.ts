import {Router} from "express";
import * as authController from "../module/auth/auth.controller";
import * as bookController from "../module/book/book.controller";
import authenticateJWT from "../middleware/jwt.middleware";

const router = Router();
router.post('/auth/login', authController.login)
router.post('/auth/logout', authenticateJWT, authController.logout)
router.post('/auth/change-password', authenticateJWT, authController.changePassword)


router.get('/books', authenticateJWT, bookController.list)
router.post('/books', authenticateJWT, bookController.create)
router.put('/books/:id', authenticateJWT, bookController.update)
router.delete('/books/:id', authenticateJWT, bookController.remove)
router.get('/books/:id', authenticateJWT, bookController.detail)
export default router; 