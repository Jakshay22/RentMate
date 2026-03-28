import dayjs from "dayjs";

export const formatMonthYear = (month, year) => {
  const d = dayjs(`${year}-${month}-01`);
  return d.format("MMM YYYY");
};
