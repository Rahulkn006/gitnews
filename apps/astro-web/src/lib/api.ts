export const getApiUrl = () => import.meta.env.PUBLIC_API_URL || "http://localhost:3001";

export const fetcher = async (url: string) => {
  const apiUrl = getApiUrl();
  console.log("Fetcher API URL:", apiUrl, "Fetching:", `${apiUrl}${url}`);
  const res = await fetch(`${apiUrl}${url}`);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    console.error("Fetcher error:", error);
    throw error;
  }
  return res.json();
};
