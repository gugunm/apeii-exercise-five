import { createTool } from "@anvia/core";
import { z } from "zod";
import { client } from "./client";

export const searchWeb = createTool({
  name: "search_web",
  description: "Search the web for current information. Returns titles, URLs, and content snippets.",
  inputSchema: z.object({
    query: z.string().min(1),
    maxResults: z.number().int().min(1).max(10).default(5),
  }),
  execute: async ({ query, maxResults }) => {
    const response = await client.search(query, { maxResults });
    return response.results.map(({ title, url, content }) => ({ title, url, content }));
  },
});
