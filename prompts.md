```bash
setup me basic pnpm workspace.
I need:

* apps/api - hono + zod + zValidator
* apps/web - react + vite + tailwindcss + tanstack router (filebase)
* packages/agents - do nothing.
```

```bash
next, in packages/agents add src/index.ts. and it has to be pnpmp package
```

```bash
okey next on the agents, we need :

* src/agent.ts - install anvia/core and create me runAgent(options).
* src/models.ts - install anvia/openai and create me getModel(modelId).
* src/instructions.ts - base prompt
* src/tools/web-search - install tavily
* src/context/document.ts create me basic static context - document from anvia/core.
```

```bash
please read anvia.dev/lens

and create me

infra/lens and then create me the .env and run the lens docker.

use lens version 0.16, that is the latest
```

```bash
okey next in @src/agent.ts we need :

* runAgent(options), this options has to accept messages not prompt.

* runAgent has to retur agent.stream()
```

```bash
for web-search we need 2:

- search-web
- read-webpage
```

```bash
for this agent :

- instruction.ts should be about HR Agent for Company: PT Maju Jaya Sakti
- context/ you need to have like mock data for Indonesia common rules
```

```bash
next we need agents/src/evals/*.ts

create 20 cases base on context we have and split into 4 files.
And then for the metrics we will need to have 3 things :

- correctness use gEvals() with rubric
- answerRelevancy
- contains() use regex and focus on numbers. eg: /word/i
```

```bash
its too complex. please do this instead :

each file have runEvalCli() write the cases directly inside the evalCli. And the metrics should be on each file. meaning we don't need the run.ts

No additional generic types pls.
```

```bash
next lets create script to run the evals :
expectation :

pnpm run evals:1
pnpm run evals:2
pnpm run evals (for all cases)

For .env create one in the root.
and use nodejs native env read flag.
```

```bash
next please install anvia/lens to agents
create lens.ts and register to the runAgent()

I have the .env ANVIA_LENS_* for the credentials.
I need you to do live test to call the lens.

please add lens also for reporter of our runEvalCli()
```
