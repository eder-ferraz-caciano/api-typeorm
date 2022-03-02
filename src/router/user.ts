import express from "express";
import { UserController } from './../controller/UserController';

export class UserRouter {
  constructor(app: express.Express) {
    const user = new UserController();

    app.get("/users", user.all);
    app.get("/users/:id", user.one);
    app.put("/users/:id", user.update);
    app.post("/users", user.save);
    app.delete("/users/:id", user.remove);
  }
}
