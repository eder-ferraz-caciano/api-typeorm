import { Request, Response } from 'express';
import * as jwt from "jsonwebtoken";
import { getRepository } from 'typeorm';
import { validate } from "validate.js";
import { User } from '../../entity/User';

export class LoginController {

  private ValidarUsuario = {
    email: { presence: true, email: true },
    senha: { presence: true, type: 'string' }
  }

  private userRepository = getRepository(User);

  public login = async (req: Request, res: Response) => {
    try {
      const err = validate(req.body, this.ValidarUsuario)
      if (err) return res.send(err);

      const user: any = await this.userRepository.findOne({
        email: req.body.email,
        senha: req.body.senha,
        deletedAt: null
      })
      if (!user) throw new Error("Usuário ou senha inválidos");

      const token: any = jwt.sign({
        data: {
          name: user.nome,
          email: user.email
        }
      }, process.env.APP_KEY, { expiresIn: '90h' });

      return res.json({
        token,
        payload: {
          name: user.nome,
          email: user.email
        }
      })
    } catch (error) {
      return res.json({ erro: error.message });
    }
  }
}
