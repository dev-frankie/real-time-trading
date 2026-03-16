function fallbackOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1_000_000);
  return `order-${timestamp}-${random}`;
}

export function createOrderId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return fallbackOrderId();
}
