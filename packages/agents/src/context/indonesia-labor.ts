import type { Document } from "@anvia/core";

// Mock summaries of common Indonesian labor rules. Verify against the official text before real use.
export const indonesiaLaborDocuments: Document[] = [
  {
    id: "id-working-hours",
    text: `Working hours (UU 13/2003 Pasal 77, as amended by UU 6/2023):
Standard: 7 hours per day and 40 hours per week for a 6-day week, or 8 hours per day and 40 hours per week for a 5-day week.
Overtime: maximum 4 hours per day and 18 hours per week. Overtime must be paid at the rates set by the regulation.`,
    additionalProps: { source: "UU 13/2003", topic: "working-hours" },
  },
  {
    id: "id-annual-leave",
    text: `Annual leave (UU 13/2003 Pasal 79):
Employees with 12 consecutive months of service get at least 12 working days of leave per year.
Leave may be scheduled by agreement between the employer and the employee.`,
    additionalProps: { source: "UU 13/2003", topic: "leave" },
  },
  {
    id: "id-maternity-leave",
    text: `Maternity leave (UU 4/2024, amending UU 13/2003 Pasal 82):
Female employees get a paid maternity leave period of about 3 months, with the total set by law (mock summary; verify the current duration in UU 4/2024).
Paternity leave and miscarriage leave are also regulated.`,
    additionalProps: { source: "UU 4/2024", topic: "leave" },
  },
  {
    id: "id-contract-types",
    text: `Employment contracts (PP 35/2021):
PKWT (fixed-term): for specific work, with a maximum total duration of 5 years including extensions.
PKWTT (permanent): no end date.
Probation (masa percobaan): maximum 3 months, and it must be written in the contract.`,
    additionalProps: { source: "PP 35/2021", topic: "contracts" },
  },
  {
    id: "id-minimum-wage",
    text: `Minimum wage (PP 36/2021 and related regional decrees):
Each province and regency/city sets its own UMP or UMK each year. Employers must pay at least the applicable minimum for the work location.
Use the current year's regional decree, as the amounts change annually.`,
    additionalProps: { source: "PP 36/2021", topic: "wages" },
  },
  {
    id: "id-thr",
    text: `Holiday bonus THR (Permenaker 6/2016):
Employees with at least 12 months of service get one month's wage.
Employees with 1-12 months of service get a prorated amount.
Payment is due no later than 7 days before the religious holiday.`,
    additionalProps: { source: "Permenaker 6/2016", topic: "bonus" },
  },
  {
    id: "id-bpjs-contributions",
    text: `BPJS contributions (mock summary; verify current rates):
JHT (Jaminan Hari Tua): employer 3.7%, employee 2%.
JKK (Jaminan Kecelakaan Kerja): employer 0.24%-1.74% depending on risk level.
JKM (Jaminan Kematian): employer 0.3%.
JP (Jaminan Pensiun): employer 2%, employee 1%, capped at the salary ceiling.
JKN/BPJS Kesehatan: employer 4%, employee 1%, capped at the salary ceiling.`,
    additionalProps: { source: "PP 45/2015 and related", topic: "benefits" },
  },
  {
    id: "id-termination",
    text: `Termination (UU 13/2003 Pasal 150-172, as amended by UU 6/2023):
Termination must follow the legal process and the required notice.
Severance (uang pesangon), service pay (uang penghargaan masa kerja), and compensation rights depend on the reason and length of service.
Disputes go through bipartit, then mediation, then the Industrial Relations Court (PHI).`,
    additionalProps: { source: "UU 13/2003 and UU 6/2023", topic: "termination" },
  },
];
