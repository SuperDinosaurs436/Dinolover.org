import React, { createContext, useState, useContext } from "react";

const SoundContext = createContext();

export const useSound = () => useContext(SoundContext);

export default function SoundProvider({ children }) {
  const [volume, setVolume] = useState(0.5); // default volume 50%

  const playSound = (audioFile) => {
    const audio = new Audio(audioFile);
    audio.volume = volume;
    audio.play();
  };

  return (
    <SoundContext.Provider value={{ playSound, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}
