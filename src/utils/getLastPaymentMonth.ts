import { TMember } from "@/redux/feature/members/memberType";

export const getLastPaymentMonth = (member: TMember): string | null => {
  const lastPayment = member.payments.reduce((latest, payment) => {
    const current = new Date(payment.year, payment.month - 1);
    return current > latest ? current : latest;
  }, new Date(0));

  return lastPayment.toLocaleString("en-US", {
    month: "short",
    year: "numeric",
  }); // e.g., "Jun 2024"
};
