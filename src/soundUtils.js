export const playSound = (filePath, volume = 0.5) => {
  const audio = new Audio(filePath);
  audio.volume = volume;
  audio.play();
};
