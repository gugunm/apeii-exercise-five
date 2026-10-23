import { answerRelevancy, contains, gEval, runEvalCli } from "@anvia/core/evals";
import { DEFAULT_MODEL_ID, runAgent } from "../agent";
import { lens } from "../lens";
import { getModel } from "../models";

const judge = getModel(DEFAULT_MODEL_ID);

await runEvalCli({
  name: "hr-benefits",
  cases: [
    {
      id: "benefits-01",
      input: "Berapa iuran JHT yang ditanggung perusahaan?",
      expected: "3,7% dari gaji.",
      metadata: { pattern: "3[.,]7\\s*%", flags: "" },
    },
    {
      id: "benefits-02",
      input: "Berapa iuran JHT yang ditanggung karyawan?",
      expected: "2% dari gaji.",
      metadata: { pattern: "\\b2\\s*%", flags: "" },
    },
    {
      id: "benefits-03",
      input: "Berapa iuran BPJS Kesehatan yang ditanggung perusahaan dan karyawan?",
      expected: "Perusahaan 4% dan karyawan 1%.",
      metadata: { pattern: "4\\s*%[\\s\\S]*1\\s*%|1\\s*%[\\s\\S]*4\\s*%", flags: "" },
    },
    {
      id: "benefits-04",
      input: "Berapa iuran Jaminan Pensiun (JP) dari perusahaan?",
      expected: "2% dari gaji, karyawan 1%.",
      metadata: { pattern: "\\b2\\s*%", flags: "" },
    },
    {
      id: "benefits-05",
      input: "Berapa iuran Jaminan Kematian (JKM) yang ditanggung perusahaan?",
      expected: "0,3% dari gaji.",
      metadata: { pattern: "0[.,]3\\s*%", flags: "" },
    },
  ],
  target: (input) => runAgent({ messages: [{ role: "user", content: input }] }).text,
  reporters: [lens.evalReporter({ includePayloads: true })],
  metrics: [
    gEval({
      name: "correctness",
      model: judge,
      evaluationParams: ["input", "actualOutput", "expectedOutput"],
      criteria: "Judge whether the actual output gives the same BPJS contribution rates and the same employer or employee split as the expected output for the question. Penalize invented rates or a wrong payer.",
      threshold: 0.7,
      rubric: [
        { scoreRange: [0, 3], expectedOutcome: "Wrong, contradicts the expected answer, or invents policy." },
        { scoreRange: [4, 7], expectedOutcome: "Partly correct: right idea but missing or vague key facts or numbers." },
        { scoreRange: [8, 10], expectedOutcome: "Correct: matches the expected answer's facts and numbers." },
      ],
    }),
    answerRelevancy({ model: judge, threshold: 0.7 }),
    contains({
      name: "numbers",
      expected: ({ case: testCase }) => {
        const { pattern, flags } = testCase.metadata as { pattern: string; flags: string };
        return new RegExp(pattern, flags);
      },
    }),
  ],
});

await lens.close();
