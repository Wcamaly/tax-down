import { FastifyInstance } from "fastify";

export async function errorHandlerMiddleware(fastify: FastifyInstance) {
  fastify.setErrorHandler(async (error, request, reply) => {
    console.error("🔥 Error detectado:", error);

    let statusCode = error.statusCode || 500;
    let message = error.message || "Internal Server Error";

    // Manejo de errores específicos
    if (error.validation) {
      statusCode = 400;
      message = "Validation Error";
    }

    reply.status(statusCode).send({
      success: false,
      statusCode,
      message,
      error: error.name || "ServerError",
      stack: error.stack || undefined,
    });
  });
}