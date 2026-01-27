export const getApiUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    // 'https://national-games-backend.onrender.com/api';
    "http://localhost:5000/api"
  );
};

export const getImageUrl = (path: string) => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;
  const apiUrl = getApiUrl().replace("/api", "/uploads");
  return `${apiUrl}${path}`;
};
