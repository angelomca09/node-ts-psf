import fastify from "fastify";
import cors from "@fastify/cors";
import { helloRoutes } from "./routes/hello.route";

const app = fastify();

app.register(cors, {
  origin: true, // All URLs can access the API
});

// Routes
app.register(helloRoutes)

app
  .listen({
    port: 3333,
    host: "0.0.0.0", // To Run on Android Mobile Apps
  })
  .then(() => {
    console.log("👏 HTTP server running on http://localhost:3333");
  });