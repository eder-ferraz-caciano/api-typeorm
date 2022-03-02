import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import obterUser from "../hook/GetUserToken";
import validate = require("validate.js");

export class UserController {

  private ValidarUsuario = {
    nome: { presence: true, type: 'string' },
    email: { presence: true, email: true },
    senha: { presence: true, type: 'string' },
    ativo: { presence: true, numericality: true }
  }
  private ValidarUsuarioEdicao = {
    nome: { presence: true, numericality: true },
    ...this.ValidarUsuario
  }

  private userRepository = getRepository(User);

  public all = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userRepository.find();

      return res.send(users);
    } catch (error) {
      return res.send({ erro: error.message });
    }
  }

  public one = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userRepository.findOne({ id: req.params.id });
      if (!user) throw new Error("Usuário não encontrado!");

      return res.send(user);
    } catch (error) {
      return res.send({ erro: error.message });
    }
  }

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = validate(req.body, this.ValidarUsuarioEdicao)
      if (err) return res.send(err);

      const user = { ...req.body };

      const encontrarUser = await this.userRepository.findOne({ id: req.params.id })
      if (!encontrarUser) throw new Error("Usuário não encontrado");

      user.updatedBy = obterUser(req);

      const resp = await this.userRepository.update(encontrarUser.id, user);
      return res.send({ message: `${resp.affected} registro(s) alterado(s) com sucesso!` });
    } catch (error) {
      return res.send({ erro: error.message });
    }
  }

  public save = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = validate(req.body, this.ValidarUsuario)
      if (err) return res.send(err)

      const user = { ...req.body };

      const verificaSeTem = await this.userRepository.findOne({
        email: user.email
      })
      if (verificaSeTem) throw new Error("Usuário já cadastrado com esse email");

      console.log(obterUser(req))

      user.createdBy = obterUser(req);

      const resp = await this.userRepository.save(user);
      return res.send({ message: "Registro inserido com sucesso!", registroId: resp.id });
    } catch (error) {
      return res.send({ erro: error.message });
    }
  }

  public remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let userToRemove = await this.userRepository.findOne(req.params.id);
      if (!userToRemove) throw new Error("Usuário não encontrado");

      let userSoftred = await this.userRepository.softRemove(userToRemove);
      userSoftred.deletedBy = obterUser(req);

      const resp = await this.userRepository.save(userSoftred);
      return res.send({ message: "Registro deletado com sucesso!" });
    } catch (error) {
      return res.send({ erro: error.message });
    }
  }

}
