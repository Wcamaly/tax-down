import fastify, { FastifyInstance } from "fastify";
import { Environment } from "./enviroments";
import { Route } from "../../domain/objects/Route";

export class Server {
  private _server: FastifyInstance;

  constructor() {
    this._server = fastify({
      logger: true,
    });
  }

  public getServer(): FastifyInstance {
    return this._server;
  }

  public async registerRoutes(routes: Route[]): Promise<void> {
    routes.forEach((route) => {
      switch (route.method) {
        case "GET":
          this._server.get(route.path, route.handler);
          break;
        case "POST":
          this._server.post(route.path, route.handler);
          break;
        case "PUT":
          this._server.put(route.path, route.handler);
          break;
        case "DELETE":
          this._server.delete(route.path, route.handler);
          break;
        case "PATCH":
          this._server.patch(route.path, route.handler);
          break;
        case "OPTIONS":
          this._server.options(route.path, route.handler);
          break;
        default:
          this._server.all(route.path, route.handler);
      }
    });
  }


  public async start(): Promise<void> {
    try {
      await this._server.listen({port: Environment.PORT})
      const address = this._server.server.address()
      const port = typeof address === 'string' ? address : address?.port
  
    } catch (err) {
      this._server.log.error(err)
      process.exit(1)
    }
  }
}
