import type { Response } from 'express'
import { createResponse } from '../../shared/utils/response.js'
import type { AuthService } from './auth.service.js'
import type { AuthenticatedRequest } from '../../shared/middlewares/auth.js'

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  register = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.authService.register(req.body)
    res.status(201).json(createResponse(result, 'Usuario registrado'))
  }

  login = async (req: AuthenticatedRequest, res: Response) => {
    const result = await this.authService.login(req.body)
    res.json(createResponse(result, 'Inicio de sesión exitoso'))
  }

  me = async (req: AuthenticatedRequest, res: Response) => {
    res.json(createResponse(req.user, 'Perfil del usuario'))
  }
}
