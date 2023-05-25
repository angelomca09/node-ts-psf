import { FastifyInstance } from "fastify";

export async function helloRoutes(app: FastifyInstance) {
  app.get("/hello", async (request, result) => {
    result.send("Hello World")
  })
}