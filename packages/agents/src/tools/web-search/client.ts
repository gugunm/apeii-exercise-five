import { tavily } from "@tavily/core";

export const client = tavily({ apiKey: process.env.TAVILY_API_KEY });
