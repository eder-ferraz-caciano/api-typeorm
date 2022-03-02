import { Request } from 'express';
import * as jwt from "jsonwebtoken";

export default function obterUser (req: Request) {
  const token = String(req.headers["authorization"]);
  const payload = jwt.verify(token.replace("Bearer ", ""), process.env.APP_KEY);

  return payload?.data?.email;
}
