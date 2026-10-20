// Accepts "98765 43210", "+91 98765-43210", "09876543210" ... and returns
// "+919876543210", or null if it is not a valid Indian mobile number.
export function normalizeIndianMobile(input) {
  if (typeof input !== "string") return null;
  const cleaned = input.replace(/[\s\-()]/g, "");
  const match = cleaned.match(/^(?:\+91|91|0)?([6-9]\d{9})$/);
  return match ? `+91${match[1]}` : null;
}