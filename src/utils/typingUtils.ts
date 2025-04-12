
// Common English words
const commonWords = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I", "it", "for",
  "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his",
  "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my",
  "one", "all", "would", "there", "their", "what", "so", "up", "out", "if",
  "about", "who", "get", "which", "go", "me", "when", "make", "can", "like",
  "time", "no", "just", "him", "know", "take", "people", "into", "year",
  "your", "good", "some", "could", "them", "see", "other", "than", "then",
  "now", "look", "only", "come", "its", "over", "think", "also", "back",
  "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
  "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "code", "data", "type", "react", "state", "props", "hook", "query", "class",
  "interface", "function", "method", "array", "string", "number", "boolean",
  "promise", "async", "await", "import", "export", "module", "component", 
  "app", "browser", "server", "client", "request", "response", "event",
  "listener", "callback", "render", "effect", "memo", "context", "reducer"
];

// Generate a random text for typing practice
export const generateRandomText = (wordCount: number): string => {
  const shuffledWords = [...commonWords].sort(() => 0.5 - Math.random());
  const selectedWords = shuffledWords.slice(0, wordCount);
  
  // If we need more words than in our array, repeat the process
  if (wordCount > commonWords.length) {
    const repetitions = Math.ceil(wordCount / commonWords.length);
    const moreWords = [];
    
    for (let i = 0; i < repetitions; i++) {
      moreWords.push(...commonWords.sort(() => 0.5 - Math.random()));
    }
    
    return moreWords.slice(0, wordCount).join(' ');
  }
  
  return selectedWords.join(' ');
};

// Calculate Words Per Minute (WPM)
export const calculateWPM = (charCount: number, timeElapsedInSeconds: number): number => {
  // Standard WPM calculation: (characters typed / 5) / minutes elapsed
  // where 5 is the average word length
  const minutes = timeElapsedInSeconds / 60;
  return Math.round((charCount / 5) / minutes);
};

// Calculate typing accuracy
export const calculateAccuracy = (correctChars: number, totalKeystrokes: number): number => {
  if (totalKeystrokes === 0) return 100;
  return Math.round((correctChars / totalKeystrokes) * 100);
};

// Format time from seconds to MM:SS
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${formattedMinutes}:${formattedSeconds}`;
};

// Export result as text
export const exportResultAsText = (result: {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalKeystrokes: number;
  timeElapsed: number;
}): string => {
  return `
Typing Test Results:
===================
WPM: ${result.wpm}
Accuracy: ${result.accuracy}%
Correct keystrokes: ${result.correctChars}
Incorrect keystrokes: ${result.incorrectChars}
Total keystrokes: ${result.totalKeystrokes}
Time elapsed: ${formatTime(result.timeElapsed)}
===================
Created with Lekho - Typing Test
  `.trim();
};
