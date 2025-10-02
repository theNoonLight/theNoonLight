import crypto from "crypto";

export function normalizeAnswer(s: string) {
  return s.normalize("NFKC").trim().toLowerCase().replace(/\s+/g, " ");
}

export function hashAnswer(s: string) {
  return crypto.createHash("sha256").update(normalizeAnswer(s)).digest("hex");
}
