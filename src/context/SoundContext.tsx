
import React, { createContext, useState, useContext, useEffect } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playKeypress: () => void;
  playSuccess: () => void;
  playError: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [keypressAudio, setKeypressAudio] = useState<HTMLAudioElement | null>(null);
  const [successAudio, setSuccessAudio] = useState<HTMLAudioElement | null>(null);
  const [errorAudio, setErrorAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio objects after component mounts to avoid SSR issues
    setKeypressAudio(new Audio('/keypress.mp3'));
    setSuccessAudio(new Audio('/success.mp3'));
    setErrorAudio(new Audio('/error.mp3'));

    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  const playKeypress = () => {
    if (soundEnabled && keypressAudio) {
      const sound = keypressAudio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.2;
      sound.play().catch(() => {
        // Ignore autoplay errors when user hasn't interacted with the page
      });
    }
  };

  const playSuccess = () => {
    if (soundEnabled && successAudio) {
      const sound = successAudio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.3;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  const playError = () => {
    if (soundEnabled && errorAudio) {
      const sound = errorAudio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.3;
      sound.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  };

  return (
    <SoundContext.Provider value={{ 
      soundEnabled, 
      toggleSound, 
      playKeypress, 
      playSuccess, 
      playError 
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
