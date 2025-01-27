import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FastifyReply, FastifyRequest } from "fastify";

export class Validate {

  static async validateDto<T>(
    dtoClass: new () => T,
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<T | void> {
    const instance = plainToInstance(dtoClass, request.body);

    const errors = await validate(instance as unknown as object);
    if (errors.length > 0) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
    }

    return instance;
  }
}
