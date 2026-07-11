export const fetcher = async (url: string) => {
  const apiUrl = import.meta.env.PUBLIC_API_URL || "https://naturals-suppliers-socks-careers.trycloudflare.com";
  const res = await fetch(`${apiUrl}${url}`);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    (error as any).info = await res.json().catch(() => ({}));
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
};
