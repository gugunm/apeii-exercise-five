import type { Document } from "@anvia/core";

export const companyDocument: Document = {
  id: "company-profile",
  text: `PT Maju Jaya Sakti (mock data)
Industry: general services.
Employees: about 250.
Working hours: Monday to Friday, 08:00-17:00, with a 1-hour lunch break. Five-day week, 40 hours.
Probation: 3 months for new employees, extendable once only where the law allows.
Annual leave: 12 working days per year after 12 consecutive months of service. Unused leave expires after 12 months.
Sick leave: with a doctor's note, paid per Indonesian regulation.
Overtime: requires written approval from the direct manager. Paid per Kepmenaker 102/2004.
Benefits: BPJS Ketenagakerjaan and BPJS Kesehatan for all employees. Health allowance Rp500.000 per month (mock).
Payroll: paid on the 25th of each month by bank transfer.
THR: paid 7 days before Lebaran per Permenaker 6/2016.
HR contact: hr@majujayasakti.example (mock).`,
  additionalProps: { source: "company-mock", version: "2026-01" },
};
