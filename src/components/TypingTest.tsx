
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSound } from '@/context/SoundContext';
import { useTypingContext, TestResult } from '@/context/TypingContext';
import { generateRandomText, calculateWPM, calculateAccuracy, formatTime } from '@/utils/typingUtils';
import { Repeat, Timer, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

const TypingTest: React.FC = () => {
  const navigate = useNavigate();
  const { playKeypress, playSuccess, playError } = useSound();
  const { 
    testMode, setTestMode, 
    timeOption, setTimeOption, 
    wordOption, setWordOption,
    fontFamily, 
    setLastResult
  } = useTypingContext();
  
  const [text, setText] = useState('');
  const [textArray, setTextArray] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [typedHistory, setTypedHistory] = useState<{word: string, correct: boolean}[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [currentWPM, setCurrentWPM] = useState(0);
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number }[]>([]);
  const [displayedWPM, setDisplayedWPM] = useState(0);
  const [displayedAccuracy, setDisplayedAccuracy] = useState(100);
  
  const inputRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const wpmIntervalRef = useRef<number | null>(null);
  const wpmAnimationRef = useRef<number | null>(null);
  const accuracyAnimationRef = useRef<number | null>(null);

  // Generate text for the test and split into word array
  useEffect(() => {
    const generatedText = testMode === 'time' 
      ? generateRandomText(100) 
      : generateRandomText(wordOption);
    
    setText(generatedText);
    setTextArray(generatedText.split(' '));
    setCurrentWordIndex(0);
    setUserInput('');
    setTypedHistory([]);
  }, [testMode, wordOption]);

  // Set up timer and WPM calculations
  useEffect(() => {
    if (isActive) {
      // Main timer for tracking test progress
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => {
          // For time-based tests, check if time is up
          if (testMode === 'time' && prev + 1 >= timeOption) {
            finishTest();
          }
          return prev + 1;
        });
      }, 1000);

      // Separate interval for updating WPM more frequently
      wpmIntervalRef.current = window.setInterval(() => {
        if (timeElapsed > 0) {
          const wpm = calculateWPM(correctChars, timeElapsed);
          setCurrentWPM(wpm);
          
          // Record WPM for history graph
          setWpmHistory(prev => [
            ...prev,
            { time: timeElapsed, wpm }
          ]);
        }
      }, 2000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
      if (wpmAnimationRef.current) cancelAnimationFrame(wpmAnimationRef.current);
      if (accuracyAnimationRef.current) cancelAnimationFrame(accuracyAnimationRef.current);
    };
  }, [isActive, timeElapsed, correctChars, testMode, timeOption]);

  // Animate WPM counter
  useEffect(() => {
    const animateCounter = (
      current: number,
      target: number,
      setter: React.Dispatch<React.SetStateAction<number>>,
      ref: React.MutableRefObject<number | null>
    ) => {
      const step = Math.max(1, Math.abs(target - current) / 10);
      
      if (Math.abs(target - current) < step) {
        setter(target);
        return;
      }
      
      const newValue = current + (target > current ? step : -step);
      setter(Math.round(newValue));
      
      ref.current = requestAnimationFrame(() => animateCounter(newValue, target, setter, ref));
    };

    if (currentWPM !== displayedWPM) {
      if (wpmAnimationRef.current) cancelAnimationFrame(wpmAnimationRef.current);
      wpmAnimationRef.current = requestAnimationFrame(() => 
        animateCounter(displayedWPM, currentWPM, setDisplayedWPM, wpmAnimationRef)
      );
    }

    const currentAccuracy = incorrectChars + correctChars > 0 
      ? calculateAccuracy(correctChars, correctChars + incorrectChars)
      : 100;
    
    if (currentAccuracy !== displayedAccuracy) {
      if (accuracyAnimationRef.current) cancelAnimationFrame(accuracyAnimationRef.current);
      accuracyAnimationRef.current = requestAnimationFrame(() => 
        animateCounter(displayedAccuracy, currentAccuracy, setDisplayedAccuracy, accuracyAnimationRef)
      );
    }

    return () => {
      if (wpmAnimationRef.current) cancelAnimationFrame(wpmAnimationRef.current);
      if (accuracyAnimationRef.current) cancelAnimationFrame(accuracyAnimationRef.current);
    };
  }, [currentWPM, displayedWPM, correctChars, incorrectChars, displayedAccuracy]);

  // Handle test completion
  const finishTest = useCallback(() => {
    setIsActive(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
    if (wpmAnimationRef.current) cancelAnimationFrame(wpmAnimationRef.current);
    if (accuracyAnimationRef.current) cancelAnimationFrame(accuracyAnimationRef.current);
    
    // Calculate final stats
    const finalWPM = calculateWPM(correctChars, timeElapsed || 1);
    const finalAccuracy = calculateAccuracy(correctChars, correctChars + incorrectChars);
    
    const result: TestResult = {
      wpm: finalWPM,
      accuracy: finalAccuracy,
      correctChars,
      incorrectChars,
      totalKeystrokes: correctChars + incorrectChars,
      timeElapsed,
      wpmHistory: [...wpmHistory, { time: timeElapsed, wpm: finalWPM }]
    };
    
    // Store result and navigate to results page
    setLastResult(result);
    navigate('/result');
    playSuccess();
  }, [correctChars, incorrectChars, navigate, playSuccess, timeElapsed, wpmHistory]);

  // Check if current word is complete
  const checkWordComplete = useCallback((input: string, word: string) => {
    // Word is considered complete if the user has typed the whole word plus a space
    // or if the end of test is reached
    if (input === word + ' ' || 
        (input === word && currentWordIndex === textArray.length - 1)) {
      // Record the typed word
      setTypedHistory(prev => [...prev, { 
        word, 
        correct: input.trim() === word 
      }]);

      // Move to the next word
      if (currentWordIndex < textArray.length - 1) {
        setCurrentWordIndex(currentWordIndex + 1);
        setUserInput('');
      } else if (testMode === 'words') {
        // If we've reached the end of the word list in words mode, finish the test
        finishTest();
      }
      return true;
    }
    return false;
  }, [currentWordIndex, finishTest, testMode, textArray.length]);

  // Handle key presses
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Ignore modifier keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      return;
    }
    
    // Start timer on first keypress
    if (!isActive) {
      setIsActive(true);
    }
    
    const currentWord = textArray[currentWordIndex] || '';

    if (e.key === 'Backspace') {
      // Handle backspace
      setUserInput(prev => prev.slice(0, -1));
      return;
    }
    
    if (e.key === ' ') {
      // Handle space - check if current word is complete
      const isComplete = checkWordComplete(userInput + ' ', currentWord);
      if (!isComplete) {
        // If the word is not complete, add a character only if we're at the end
        if (userInput.length === currentWord.length) {
          setUserInput(prev => prev + ' ');
          setIncorrectChars(prev => prev + 1);
          playError();
        }
      } else {
        playKeypress();
      }
      return;
    }
    
    if (e.key.length === 1) {
      // Handle regular character input
      const newUserInput = userInput + e.key;
      setUserInput(newUserInput);
      
      // Check if the character is correct for the current position
      const isCorrect = currentWord.charAt(userInput.length) === e.key;
      
      if (isCorrect) {
        setCorrectChars(prev => prev + 1);
        playKeypress();

        // If we've completed the word with this character
        if (newUserInput === currentWord && currentWordIndex === textArray.length - 1 && testMode === 'words') {
          finishTest();
        }
      } else {
        setIncorrectChars(prev => prev + 1);
        playError();
      }
    }
  }, [checkWordComplete, currentWordIndex, finishTest, isActive, playError, playKeypress, testMode, textArray, userInput]);

  // Reset the test
  const resetTest = () => {
    setUserInput('');
    setIsActive(false);
    setTimeElapsed(0);
    setCorrectChars(0);
    setIncorrectChars(0);
    setCurrentWPM(0);
    setDisplayedWPM(0);
    setDisplayedAccuracy(100);
    setWpmHistory([]);
    setTypedHistory([]);
    setCurrentWordIndex(0);
    
    // Generate new text
    const newText = testMode === 'time' 
      ? generateRandomText(100) 
      : generateRandomText(wordOption);
    
    setText(newText);
    setTextArray(newText.split(' '));
    
    // Focus the input element
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Render a single character with appropriate styling and animations
  const renderCharacter = (char: string, index: number, isCurrentWord: boolean) => {
    const position = index;
    const isActive = isCurrentWord && position === userInput.length;
    let status = 'untyped'; // Default status
    
    if (isCurrentWord) {
      if (position < userInput.length) {
        // Character has been typed
        status = userInput[position] === char ? 'correct' : 'incorrect';
      }
    }
    
    return (
      <motion.span
        key={`${char}-${index}`}
        className={`letter-${status} ${isActive ? 'relative z-10' : ''}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          scale: isActive ? 1.1 : 1,
          color: status === 'correct' ? '#4ade80' : 
                status === 'incorrect' ? '#ef4444' : 
                '#9ca3af'
        }}
        transition={{ 
          duration: 0.2,
          type: 'spring',
          stiffness: 300,
          damping: 20
        }}
        {...(status === 'incorrect' && {
          animate: {
            x: [0, -3, 3, -2, 2, 0],
            color: '#ef4444',
            opacity: 1,
            y: 0
          },
          transition: {
            x: { duration: 0.3, repeat: 0 },
            color: { duration: 0.2 }
          }
        })}
      >
        {isActive && (
          <motion.span 
            className="absolute bottom-0 left-0 h-5 w-0.5 bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            style={{ 
              boxShadow: '0 0 8px 2px rgba(155, 135, 245, 0.4)'
            }}
          />
        )}
        {char}
      </motion.span>
    );
  };

  // Render the text with animated highlighting and word transitions
  const renderText = () => {
    return (
      <div className={`typing-text font-${fontFamily} relative overflow-hidden`}>
        <AnimatePresence mode="popLayout">
          {textArray.slice(Math.max(0, currentWordIndex - 1), currentWordIndex + 8).map((word, wordIndex) => {
            const adjustedIndex = wordIndex + Math.max(0, currentWordIndex - 1);
            const isCurrentWord = adjustedIndex === currentWordIndex;
            
            return (
              <motion.span
                key={`word-${adjustedIndex}`}
                className={`inline-block mr-2 ${isCurrentWord ? 'current-word' : ''}`}
                initial={{ 
                  x: adjustedIndex >= currentWordIndex ? 30 : -30, 
                  opacity: 0
                }}
                animate={{ 
                  x: 0, 
                  opacity: 1,
                  scale: isCurrentWord ? 1.05 : 1
                }}
                exit={{ 
                  x: -30, 
                  opacity: 0,
                  transition: { duration: 0.2 }
                }}
                transition={{ 
                  duration: 0.3, 
                  type: 'spring',
                  stiffness: 200,
                  damping: 20
                }}
              >
                {word.split('').map((char, charIndex) => 
                  renderCharacter(char, charIndex, isCurrentWord)
                )}
              </motion.span>
            );
          })}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div 
      className="flex flex-col space-y-6 w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
    >
      {/* Test controls */}
      <motion.div 
        className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/50 p-4 rounded-lg backdrop-blur-sm"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          {/* Test mode selector */}
          <Select value={testMode} onValueChange={(value) => setTestMode(value as 'time' | 'words')}>
            <SelectTrigger className="w-[110px]">
              <SelectValue placeholder="Test Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="time">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  <span>Time</span>
                </div>
              </SelectItem>
              <SelectItem value="words">
                <div className="flex items-center gap-2">
                  <Type className="h-4 w-4" />
                  <span>Words</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Time options */}
          {testMode === 'time' && (
            <Select 
              value={timeOption.toString()} 
              onValueChange={(value) => setTimeOption(parseInt(value) as 15 | 30 | 60 | 120)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 sec</SelectItem>
                <SelectItem value="30">30 sec</SelectItem>
                <SelectItem value="60">60 sec</SelectItem>
                <SelectItem value="120">120 sec</SelectItem>
              </SelectContent>
            </Select>
          )}

          {/* Word count options */}
          {testMode === 'words' && (
            <Select 
              value={wordOption.toString()} 
              onValueChange={(value) => setWordOption(parseInt(value) as 10 | 25 | 50 | 100)}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Words" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 words</SelectItem>
                <SelectItem value="25">25 words</SelectItem>
                <SelectItem value="50">50 words</SelectItem>
                <SelectItem value="100">100 words</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        
        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <motion.div 
            className="flex flex-col items-center"
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-xl font-bold"
              key={`wpm-${displayedWPM}`}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayedWPM}
            </motion.span>
            <span className="text-xs text-muted-foreground">WPM</span>
          </motion.div>
          
          <motion.div 
            className="flex flex-col items-center"
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.span 
              className="text-xl font-bold"
              key={`accuracy-${displayedAccuracy}`}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {displayedAccuracy}%
            </motion.span>
            <span className="text-xs text-muted-foreground">Accuracy</span>
          </motion.div>
          
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold">{formatTime(timeElapsed)}</span>
            <span className="text-xs text-muted-foreground">Time</span>
          </div>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetTest} 
            title="Restart"
            className="ml-2 relative overflow-hidden group"
          >
            <motion.span
              className="absolute inset-0 bg-primary/10 rounded-md"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <Repeat className="h-4 w-4 relative z-10 group-hover:rotate-180 transition-transform duration-300" />
          </Button>
        </div>
      </motion.div>

      {/* Typing area */}
      <motion.div 
        ref={inputRef}
        className="typing-container outline-none relative rounded-lg overflow-hidden"
        onKeyDown={handleKeyDown}
        tabIndex={0}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          delay: 0.4, 
          duration: 0.5,
          type: "spring",
          stiffness: 100
        }}
        whileFocus={{ boxShadow: "0 0 0 2px rgba(155, 135, 245, 0.3)" }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="relative z-10">
          {renderText()}
          
          {!isActive && userInput.length === 0 && (
            <motion.p 
              className="text-muted-foreground text-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              Click here and start typing to begin the test
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TypingTest;
