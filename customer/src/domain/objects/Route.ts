import { FastifyReply, FastifyRequest } from "fastify";

import { FastifySchema } from "fastify";

export class Route {
  constructor(
    public readonly path: string,
    public readonly method: string,
    public readonly handler: (req: FastifyRequest, res: FastifyReply) => void
  ) {}
}