import { answerRelevancy, contains, gEval, runEvalCli } from "@anvia/core/evals";
import { DEFAULT_MODEL_ID, runAgent } from "../agent";
import { lens } from "../lens";
import { getModel } from "../models";

const judge = getModel(DEFAULT_MODEL_ID);

await runEvalCli({
  name: "hr-leave",
  cases: [
    {
      id: "leave-01",
      input: "Berapa hari cuti tahunan karyawan PT Maju Jaya Sakti?",
      expected: "12 hari kerja per tahun setelah 12 bulan masa kerja.",
      metadata: { pattern: "\\b12\\b", flags: "" },
    },
    {
      id: "leave-02",
      input: "Berapa lama cuti tahunan yang belum diambil masih berlaku?",
      expected: "Cuti yang belum diambil hangus setelah 12 bulan.",
      metadata: { pattern: "12\\s*(bulan|months?)", flags: "i" },
    },
    {
      id: "leave-03",
      input: "Berapa lama cuti melahirkan untuk karyawan perempuan?",
      expected: "Sekitar 3 bulan (mock, verifikasi UU 4/2024).",
      metadata: { pattern: "\\b3\\b\\s*(bulan|months?)", flags: "i" },
    },
    {
      id: "leave-04",
      input: "Apa yang dibutuhkan agar cuti sakit dibayar?",
      expected: "Surat dokter.",
      metadata: { pattern: "surat dokter|doctor'?s? note", flags: "i" },
    },
    {
      id: "leave-05",
      input: "Berapa hari cuti tahunan jika karyawan baru bekerja 6 bulan?",
      expected: "Belum berhak cuti tahunan, karena belum 12 bulan masa kerja.",
      metadata: { pattern: "(belum|not yet|tidak|not)", flags: "i" },
    },
  ],
  target: (input) => runAgent({ messages: [{ role: "user", content: input }] }).text,
  reporters: [lens.evalReporter({ includePayloads: true })],
  metrics: [
    gEval({
      name: "correctness",
      model: judge,
      evaluationParams: ["input", "actualOutput", "expectedOutput"],
      criteria: "Judge whether the actual output gives the same leave rules, day counts, and durations as the expected output for the question. Penalize invented leave policy or numbers that are not in the expected output.",
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
