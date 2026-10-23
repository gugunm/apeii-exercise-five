import { OpenAIClient } from "@anvia/openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) throw new Error("Set OPENAI_API_KEY.");

// The gateway puts `usage` on every streamed chunk; @anvia/openai turns each into a
// "final" event and throws "invalid tool call". Keep usage only on the usage-only chunk.
const gatewayFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
    const res = await gatewayFetch(input, init);
    if (!res.body || !res.headers.get("content-type")?.includes("text/event-stream")) return res;
    let buf = "";
    const enc = new TextEncoder();
    const fix = (line: string) => {
        if (!line.startsWith("data: {")) return line;
        try {
            const chunk = JSON.parse(line.slice(6));
            if (chunk.choices?.length) delete chunk.usage;
            return `data: ${JSON.stringify(chunk)}`;
        } catch {
            return line;
        }
    };
    const body = res.body.pipeThrough(new TextDecoderStream()).pipeThrough(
        new TransformStream<string, Uint8Array>({
            transform(text, ctl) {
                const lines = (buf + text).split("\n");
                buf = lines.pop() ?? "";
                ctl.enqueue(enc.encode(lines.map(fix).join("\n") + "\n"));
            },
            flush(ctl) {
                if (buf) ctl.enqueue(enc.encode(fix(buf)));
            },
        }),
    );
    return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
};

const client = new OpenAIClient({
    apiKey,
    baseUrl: process.env.OPENAI_BASE_URL,
});

export function getModel(modelId: string) {
    return client.completionModel({ modelId, api: "chat" });
}
