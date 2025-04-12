
import React, { createContext, useContext, useState } from 'react';

export type TestMode = 'time' | 'words';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordOption = 10 | 25 | 50 | 100;

export interface TestResult {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  timeElapsed: number;
  wpmHistory: { time: number; wpm: number }[];
}

interface TypingContextType {
  testMode: TestMode;
  setTestMode: (mode: TestMode) => void;
  timeOption: TimeOption;
  setTimeOption: (option: TimeOption) => void;
  wordOption: WordOption;
  setWordOption: (option: WordOption) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  lastResult: TestResult | null;
  setLastResult: (result: TestResult | null) => void;
}

const defaultContext: TypingContextType = {
  testMode: 'time',
  setTestMode: () => {},
  timeOption: 30,
  setTimeOption: () => {},
  wordOption: 25,
  setWordOption: () => {},
  fontFamily: 'jetbrains',
  setFontFamily: () => {},
  lastResult: null,
  setLastResult: () => {},
};

const TypingContext = createContext<TypingContextType>(defaultContext);

export const TypingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [testMode, setTestMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordOption, setWordOption] = useState<WordOption>(25);
  const [fontFamily, setFontFamily] = useState<string>('jetbrains');
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  return (
    <TypingContext.Provider
      value={{
        testMode,
        setTestMode,
        timeOption,
        setTimeOption,
        wordOption,
        setWordOption,
        fontFamily,
        setFontFamily,
        lastResult,
        setLastResult,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export const useTypingContext = () => useContext(TypingContext);
