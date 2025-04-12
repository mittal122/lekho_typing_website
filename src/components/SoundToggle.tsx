
import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { Button } from '@/components/ui/button';

const SoundToggle = () => {
  const { soundEnabled, toggleSound } = useSound();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleSound}
      aria-label={`${soundEnabled ? 'Disable' : 'Enable'} sound effects`}
    >
      {soundEnabled ? (
        <Volume2 className="h-5 w-5" />
      ) : (
        <VolumeX className="h-5 w-5" />
      )}
    </Button>
  );
};

export default SoundToggle;
