import z, { treeifyError } from "zod";

const _env = z.object({
  PORT: z.coerce.number().min(1, ".env is invalid: PORT not defined"),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.url(".env is invalid: DATABASE_URL not defined"),
  JWT_SECRET: z.string().min(1, ".env is invalid: JWT_SECRET not defined"),
});

function validateEnv() {
  const _parsed = _env.safeParse(process.env);
  if (!_parsed.success) {
    console.error(
      "Invalid environment variables",
      treeifyError(_parsed.error).properties
    );
    throw new Error("Invalid environment variables");
  }
  return _parsed.data;
}
export const env = validateEnv();
