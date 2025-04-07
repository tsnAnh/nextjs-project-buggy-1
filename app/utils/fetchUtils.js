export const fetchJson = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });
      
      const data = await response.json();
      
      return data;
    } catch (error) {
      console.error("Fetch error:", error);
      
      throw new Error("Failed to fetch data");
    }
  };