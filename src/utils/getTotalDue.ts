import { TMember } from "@/redux/feature/members/memberType";

export const getTotalDue = (member: TMember): number => {
  if (!member.payments?.length) return 0; // or maybe: return monthsFromJoinedToNow * fee

  // Find the latest payment (based on year and month)
  const lastPayment = member.payments.reduce((latest, current) => {
    const latestDate = new Date(latest.year, latest.month - 1);
    const currentDate = new Date(current.year, current.month - 1);
    return currentDate > latestDate ? current : latest;
  });

  const lastPaidDate = new Date(lastPayment.year, lastPayment.month - 1); // 1-based to 0-based
  const today = new Date();

  const dueMonths =
    (today.getFullYear() - lastPaidDate.getFullYear()) * 12 +
    (today.getMonth() - lastPaidDate.getMonth());

  return Math.max(0, dueMonths) * member.fee;
};
