import fastify, { FastifyInstance } from "fastify";
import { Environment } from "./enviroments";
import { Route } from "../../domain/objects/Route";
import { responseMiddleware } from "../common/middlewarer/response";
import { errorHandlerMiddleware } from "../common/middlewarer/error";

export class Server {
  private _server: FastifyInstance;

  constructor() {
    this._server = fastify({
      logger: true,
      ajv: {
        customOptions: {
          removeAdditional: false,
          useDefaults: true,
          coerceTypes: true,
          allErrors: true,
        }
      }
    });
  }

  public getServer(): FastifyInstance {
    return this._server;
  }

  public async registerMiddlewares(): Promise<void> {
    try{
      console.log('⏳ Registrando middlewares...');
      responseMiddleware(this._server);
      this._server.addHook('onRequest', (request, reply, done) => {
        console.log('🎯 Nueva petición recibida');
        done();
      });
      errorHandlerMiddleware(this._server);
      console.log('✅ Middlewares registrados correctamente');
    } catch (error) {
      console.error('🔥 Error al registrar middlewares:', error);
      throw error;
    }
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
