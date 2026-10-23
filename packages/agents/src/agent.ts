import { Agent, type AgentStream, type Message } from "@anvia/core";
// import type { KnownOpenAICompletionModelId } from "@anvia/openai";
import { staticContext } from "./context/document";
import { BASE_INSTRUCTIONS } from "./instructions";
import { lens } from "./lens";
import { getModel } from "./models";
import { readWebpage, searchWeb } from "./tools/web-search";

// const DEFAULT_MODEL_ID: string = "gpt-5.6-luna";
export const DEFAULT_MODEL_ID: string = "deepseek-ai/DeepSeek-V4.1-Flash";

export type RunAgentOptions = {
    messages: readonly Message[];
    modelId?: string;
    instructions?: string;
    maxTurns?: number;
    abortSignal?: AbortSignal;
};

export function runAgent(options: RunAgentOptions): AgentStream<string> {
    const agent = new Agent({
        id: "assistant",
        model: getModel(options.modelId ?? DEFAULT_MODEL_ID),
        instructions: options.instructions ?? BASE_INSTRUCTIONS,
        context: staticContext,
        tools: [searchWeb, readWebpage],
        maxTurns: options.maxTurns ?? 25,
        observability: { observers: { lens: lens.observer() } },
    });

    return agent.stream({
        messages: options.messages,
        abortSignal: options.abortSignal,
    });
}
