import { randomBytes } from "crypto";

export const generateShareToken = (): string => {
  return randomBytes(16).toString("hex");
};

