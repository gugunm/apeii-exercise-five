import { serve } from "@hono/node-server";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";

const app = new Hono();

app.get("/api/health", (c) => c.json({ ok: true }));

const helloSchema = z.object({
  name: z.string().min(1),
});

app.post("/api/hello", zValidator("json", helloSchema), (c) => {
  const { name } = c.req.valid("json");
  return c.json({ message: `Hello, ${name}!` });
});

serve({ fetch: app.fetch, port: 3000 }, (info) => {
  console.log(`API running on http://localhost:${info.port}`);
});
