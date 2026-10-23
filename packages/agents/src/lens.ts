import { LensClient } from "@anvia/lens";

export const lens = new LensClient({
  serviceName: process.env.ANVIA_LENS_SERVICE_NAME ?? "hr-agent",
  optional: true,
});
