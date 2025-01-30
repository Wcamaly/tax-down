import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { FastifyReply, FastifyRequest } from "fastify";

export class Validate {
    static validateDto<T>(
    dtoClass: new () => T) {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        const instance = plainToInstance(dtoClass, request.body);
    
        const errors: ValidationError[] = await validate(instance as object);
        if (errors.length > 0) {
          reply.status(400).send({
            success: false,
            message: "Validation failed",
            errors: errors.map((error) => ({
              property: error.property,
              constraints: error.constraints,
            })),
          });
          return;
        }
    
        // ✅ Si pasa la validación, guardamos la instancia validada en `request`
        request.body = instance;
      };
    }
}
