export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = reject;
  });
};

export const preloadImages = async (images) => {
  try {
    const promises = images.map(image => {
      if (typeof image === 'string') {
        return preloadImage(image);
      }
      return preloadImage(image.url);
    });
    return Promise.all(promises);
  } catch (error) {
    console.error('Error preloading images:', error);
    return [];
  }
}; 