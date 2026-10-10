/** Маскує номер картки для UI: **** **** **** 1234 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 4) return "**** **** **** ****";
  const last4 = digits.slice(-4);
  return `**** **** **** ${last4}`;
}
