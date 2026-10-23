import type { Document } from "@anvia/core";
import { companyDocument } from "./company";
import { indonesiaLaborDocuments } from "./indonesia-labor";

export const staticContext: Document[] = [companyDocument, ...indonesiaLaborDocuments];
