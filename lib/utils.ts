export const getApiUrl = () => {
  return "http://95.130.227.114";
};

export const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  const apiUrl = getApiUrl().replace("/api", "/uploads");
  return `${apiUrl}${path}`;
};
