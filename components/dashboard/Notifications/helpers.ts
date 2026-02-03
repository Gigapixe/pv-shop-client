export const stripHtml = (html: string) => {
  if (typeof window === "undefined") return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

export const truncateText = (text: string, maxLength = 100) => {
  const cleanText = stripHtml(text);
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength) + "...";
};
