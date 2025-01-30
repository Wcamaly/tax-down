import { FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyReply {
    sendResponse(payload: unknown): FastifyReply;
  }
} 