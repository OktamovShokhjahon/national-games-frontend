export const getApiUrl = () => {
  return "http://95.130.227.114";
};

export const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  const apiUrl = getApiUrl();
  // Check if path already starts with /uploads to avoid double /uploads
  if (path.startsWith("/uploads")) {
    return `${apiUrl}${path}`;
  }
  return `${apiUrl}/uploads${path}`;
};
