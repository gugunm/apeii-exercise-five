import { answerRelevancy, contains, gEval, runEvalCli } from "@anvia/core/evals";
import { DEFAULT_MODEL_ID, runAgent } from "../agent";
import { lens } from "../lens";
import { getModel } from "../models";

const judge = getModel(DEFAULT_MODEL_ID);

await runEvalCli({
  name: "hr-payroll",
  cases: [
    {
      id: "payroll-01",
      input: "Tanggal berapa gaji dibayarkan setiap bulan?",
      expected: "Tanggal 25 setiap bulan.",
      metadata: { pattern: "\\b25\\b", flags: "" },
    },
    {
      id: "payroll-02",
      input: "Kapan THR dibayarkan sebelum Lebaran?",
      expected: "Paling lambat 7 hari sebelum Lebaran.",
      metadata: { pattern: "\\b7\\b\\s*(hari|days?)", flags: "i" },
    },
    {
      id: "payroll-03",
      input: "Berapa THR untuk karyawan yang sudah bekerja 12 bulan atau lebih?",
      expected: "Satu bulan upah.",
      metadata: { pattern: "(1|satu|one)\\s*(bulan|month)", flags: "i" },
    },
    {
      id: "payroll-04",
      input: "Berapa tunjangan kesehatan per bulan?",
      expected: "Rp500.000 per bulan.",
      metadata: { pattern: "500[.,]?000", flags: "" },
    },
    {
      id: "payroll-05",
      input: "Berapa batas lembur per hari dan per minggu?",
      expected: "Maksimal 4 jam per hari dan 18 jam per minggu.",
      metadata: { pattern: "4\\s*jam[\\s\\S]*18|18[\\s\\S]*4\\s*jam|4\\s*hours?[\\s\\S]*18", flags: "i" },
    },
  ],
  target: (input) => runAgent({ messages: [{ role: "user", content: input }] }).text,
  reporters: [lens.evalReporter({ includePayloads: true })],
  metrics: [
    gEval({
      name: "correctness",
      model: judge,
      evaluationParams: ["input", "actualOutput", "expectedOutput"],
      criteria: "Judge whether the actual output gives the same pay dates, THR rules, allowance amounts, and overtime limits as the expected output for the question. Penalize invented amounts, dates, or limits that are not in the expected output.",
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
