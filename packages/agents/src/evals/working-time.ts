import {
    answerRelevancy,
    contains,
    gEval,
    runEvalCli,
} from "@anvia/core/evals";
import { DEFAULT_MODEL_ID, runAgent } from "../agent";
import { lens } from "../lens";
import { getModel } from "../models";

const judge = getModel(DEFAULT_MODEL_ID);

await runEvalCli({
    name: "hr-contracts",
    cases: [
        {
            id: "contracts-01",
            input: "Berapa lama masa percobaan karyawan baru?",
            expected: "Maksimal 3 bulan.",
            metadata: { pattern: "\\b3\\b\\s*(bulan|months?)", flags: "i" },
        },
        {
            id: "contracts-02",
            input: "Berapa lama maksimal kontrak PKWT termasuk perpanjangan?",
            expected: "Maksimal 5 tahun.",
            metadata: { pattern: "\\b5\\b\\s*(tahun|years?)", flags: "i" },
        },
        {
            id: "contracts-03",
            input: "Apa jenis kontrak tanpa batas waktu?",
            expected: "PKWTT.",
            metadata: { pattern: "PKWTT", flags: "" },
        },
        {
            id: "contracts-04",
            input: "Jam kerja standar di PT Maju Jaya Sakti mulai dan selesai jam berapa?",
            expected:
                "08:00 sampai 17:00, Senin sampai Jumat, dengan istirahat 1 jam.",
            metadata: { pattern: "08:00[\\s\\S]*17:00", flags: "" },
        },
        {
            id: "contracts-05",
            input: "Siapa nama CEO PT Maju Jaya Sakti?",
            expected:
                "Tidak ada informasi di konteks, sarankan bertanya ke HR.",
            metadata: {
                pattern:
                    "(tidak|tidak ada|not|no)\\s*(ada|available|informasi|information)|HR",
                flags: "i",
            },
        },
    ],
    target: (input) =>
        runAgent({ messages: [{ role: "user", content: input }] }).text,
    reporters: [lens.evalReporter({ includePayloads: true })],
    metrics: [
        gEval({
            name: "correctness",
            model: judge,
            evaluationParams: ["input", "actualOutput", "expectedOutput"],
            criteria:
                "Judge whether the actual output gives the same contract types, probation length, working hours, and procedures as the expected output for the question. For questions the context cannot answer, the output must say the information is unavailable and must not invent an answer.",
            threshold: 0.7,
            rubric: [
                {
                    scoreRange: [0, 3],
                    expectedOutcome:
                        "Wrong, contradicts the expected answer, or invents policy.",
                },
                {
                    scoreRange: [4, 7],
                    expectedOutcome:
                        "Partly correct: right idea but missing or vague key facts or numbers.",
                },
                {
                    scoreRange: [8, 10],
                    expectedOutcome:
                        "Correct: matches the expected answer's facts and numbers.",
                },
            ],
        }),
        answerRelevancy({ model: judge, threshold: 0.7 }),
        contains({
            name: "numbers",
            expected: ({ case: testCase }) => {
                const { pattern, flags } = testCase.metadata as {
                    pattern: string;
                    flags: string;
                };
                return new RegExp(pattern, flags);
            },
        }),
    ],
});

await lens.close();
