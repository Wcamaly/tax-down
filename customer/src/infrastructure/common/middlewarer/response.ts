import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export async function responseMiddleware(fastify: FastifyInstance) {

  fastify.addHook("onSend", (request: FastifyRequest, reply: FastifyReply, payload: unknown, done: (error?: Error | null, payload?: unknown) => void) => {
    console.log("🔄 Procesando respuesta en onSend");
    if (!payload) return payload;
    
    let parsedPayload = (payload as any).toJson ? (payload as any).toJson() : payload;
    if (typeof payload === "string") {
      try {
        parsedPayload = JSON.parse(payload);
      } catch (error) {
        return payload;
      }
    }

    const response = {
      success: reply ? reply?.statusCode >= 200 && reply?.statusCode < 300 : true,
      statusCode: reply ? reply?.statusCode || 200 : 200,
      message: reply?.status || "OK",
      data: parsedPayload
    };

    reply?.type('application/json');
    return done(null, JSON.stringify(response));
  });
}
