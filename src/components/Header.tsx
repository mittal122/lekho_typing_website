
import React from 'react';
import { Link } from 'react-router-dom';
import { Keyboard } from 'lucide-react';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import SoundToggle from './SoundToggle';
import { useTypingContext } from '@/context/TypingContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Header = () => {
  const { fontFamily, setFontFamily } = useTypingContext();

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <Link 
        to="/" 
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
      >
        <motion.div
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <Keyboard className="w-6 h-6" />
        </motion.div>
        <motion.span 
          className="font-bold text-xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          Lekho
        </motion.span>
      </Link>
      
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jetbrains">JetBrains</SelectItem>
              <SelectItem value="fira">Fira Code</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <SoundToggle />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
