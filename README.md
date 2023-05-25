# Node TS Template (Prisma, SQLite and Fastify)

## How it was setted up

### TypeScript

Install all TypeScript dependencies:

```bash
npm i typescript @types/node tsx -D
```

After installing TS dependencies, it is required to run the following command:

```bash
npx tsc --init
```

This command run the binary `tsc` file inside your `/node_modules`, which generates the `tsconfig.json` file.

The only thing that I changed at `tsconfig.json` was the `target` value to `"es2020"`, like the example below:

```json
{
  //...

  "target": "es2020"

  //...
}
```

After that, I changed my `package.json` with the folowing `script`:

```json
{
  //...

  "scripts": {
    "dev": "tsx watch src/server.ts"
  }

  //..
}
```

Be sure to have the exact same file at your project's directory with any TS content, like:

```ts
const hello: string = "Hello World";

console.log(hello);
```

Now, everytime you need to run my application use:

```bash
npm run dev
```

### Prisma

First, we need to be sure to already have [Typescript](#typescript) setted up, so we can proceed to the Prisma installation:

```bash
# install prisma as a devDependency
npm i prisma -D

# install @prisma/client as dependency
npm i @prisma/client
```

And then the initialization:

```bash
npx prisma init --datasource-provider sqlite
```

This will generate the
`prisma/schema.prisma` file.

Inside it, you may see the content as:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

For convenience purposes, change `.env` file as below:

```
DATABASE_URL="file:./dev.db"
```

This will configure your SQLite to run via a file inside `/prisma` folder.

Next, run the command to initialize database client:

```bash
npx prisma migrate dev --name init
```

You may see know that more files appeared at `/prisma` folder.

There's a way to undo all manual changes:

```bash
npx prisma migrate reset
```

If you wish, you can add both commands as scripts at `package.json`:

```json
{
  //...

  "scripts": {
    "dev": "tsx watch src/server.ts",
    "db:migrate": "prisma migrate dev",
    "db:reset": "prisma migrate reset"
  }

  //...
}
```

The `--name` parameter was removed from `migrate` command, so it can be re-used more times.
The only diference is that you'll need to supply a name after each `npm run db:migrate`.

### Fastify

To install Fastify with its solution to CORS, run:

```bash
# @fastify/cors is opitional
npm i fastify @fastify/cors
```

Change the content of your `src/server.ts` file:

```ts
import fastify from "fastify";
import cors from "@fastify/cors";

const app = fastify();

app.register(cors, {
  origin: true, // All URLs can access the API
});

app
  .listen({
    port: 3333,
    host: "0.0.0.0", // To Run on Android Mobile Apps
  })
  .then(() => {
    console.log("👏 HTTP server running on http://localhost:3333");
  });
```

Now, to create an HTTP route, start with creating `route/hello.route.ts`.

```ts
import { FastifyInstance } from "fastify";

export async function helloRoutes(app: FastifyInstance) {
  app.get("/hello", async (request, result) => {
    result.send("Hello World");
  });
}
```

Now import it to `src/server.ts`:

```ts
import { helloRoutes } from "./routes/hello.route";
// Imports...

// CORS registry...

// Routes
app.register(helloRoutes);

// App listen...
```

Lastly, lets create a way to easily use the Prisma Client. Create `src\lib\prisma.ts` and add its content:

```ts
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  //log: ["query"], // Comment so it doesn't log while querying
});
```
