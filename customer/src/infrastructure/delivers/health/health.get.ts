import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export class HealthGetDeliver {
  constructor() {}

  async get(req: FastifyRequest, res: FastifyReply): Promise<void> {
   
    res.status(200).send({ status: "ok", message: "Health check passed" });
  }

  public async registerRoutes(server: FastifyInstance): Promise<void> {
    server.get('/health', this.get.bind(this));
  }
}
