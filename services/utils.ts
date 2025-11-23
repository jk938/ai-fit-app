export const urlToBase64 = async (url: string): Promise<string> => {
  // If it's already a data URL, just return it
  if (url.startsWith('data:')) {
    return url;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = () => reject(new Error("FileReader failed to read image blob"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64:", url, error);
    // Propagate the error so the UI can handle it (likely CORS)
    throw error;
  }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String); // Keep the prefix for display, strip for API
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const stripBase64Prefix = (base64WithPrefix: string): string => {
  if (base64WithPrefix.includes(',')) {
    return base64WithPrefix.split(',')[1];
  }
  return base64WithPrefix;
};