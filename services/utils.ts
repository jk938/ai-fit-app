export const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Remove data url prefix (e.g., "data:image/png;base64,")
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to base64", error);
    throw new Error("Failed to process image.");
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
