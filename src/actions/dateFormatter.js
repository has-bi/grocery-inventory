export const formatDate = (dateString) => {
  if (!dateString) return "-";

  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("id-ID", { month: "short" });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};
