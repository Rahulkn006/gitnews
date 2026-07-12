export const getApiUrl = () => {
  const url =
    (typeof import.meta !== "undefined" && import.meta.env ? import.meta.env.PUBLIC_API_URL : undefined) ||
    (typeof process !== "undefined" && process.env ? process.env.PUBLIC_API_URL : undefined) ||
    (typeof process !== "undefined" && process.env ? process.env.NEXT_PUBLIC_API_URL : undefined);

  if (!url) {
    console.warn("WARNING: No API URL defined in environment variables (PUBLIC_API_URL or NEXT_PUBLIC_API_URL). API requests may fail.");
    return "";
  }
  return url;
};

export const fetcher = async (url: string, options?: RequestInit) => {
  const apiUrl = getApiUrl();
  console.log("Fetcher API URL:", apiUrl, "Fetching:", `${apiUrl}${url}`);
  const res = await fetch(`${apiUrl}${url}`, options);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    console.error("Fetcher error:", error);
    throw error;
  }
  return res.json();
};
