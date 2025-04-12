
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { BarChart2, CheckCircle, Clock, Download, RefreshCw, Home } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTypingContext } from '@/context/TypingContext';
import { formatTime, exportResultAsText } from '@/utils/typingUtils';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const Result: React.FC = () => {
  const navigate = useNavigate();
  const { lastResult } = useTypingContext();

  // Redirect if no result
  useEffect(() => {
    if (!lastResult) {
      navigate('/test');
    }
  }, [lastResult, navigate]);

  if (!lastResult) {
    return null;
  }

  const { wpm, accuracy, correctChars, incorrectChars, totalKeystrokes, timeElapsed, wpmHistory } = lastResult;

  // Handle export result as text
  const handleExportResult = () => {
    const resultText = exportResultAsText(lastResult);
    
    // Create a hidden element to trigger download
    const element = document.createElement('a');
    const file = new Blob([resultText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'lekho-typing-result.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover text-popover-foreground p-2 rounded-md shadow-sm text-sm">
          <p>{`Time: ${payload[0].payload.time}s`}</p>
          <p className="font-bold">{`WPM: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const countUpAnimation = (value: number) => {
    return (
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-4xl font-bold"
      >
        {value}
      </motion.span>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container max-w-4xl py-8 px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-center mb-8"
          variants={itemVariants}
        >
          Your Typing Results
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* WPM Card */}
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center justify-center p-4 glass">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">Words Per Minute</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-0">
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <BarChart2 className="mr-2 h-5 w-5 text-primary/70" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-4xl font-bold"
                    >
                      <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            delay: 0.5,
                            duration: 0.8,
                            ease: "easeOut"
                          }
                        }}
                      >
                        {wpm}
                      </motion.span>
                    </motion.span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">WPM</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accuracy Card */}
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center justify-center p-4 glass">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">Accuracy</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-0">
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.6,
                          duration: 0.8,
                          ease: "easeOut"
                        }
                      }}
                      className="text-4xl font-bold"
                    >
                      {accuracy}%
                    </motion.span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">Accuracy</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Time Card */}
          <motion.div variants={itemVariants}>
            <Card className="flex flex-col items-center justify-center p-4 glass">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-base font-medium text-muted-foreground">Time Elapsed</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center pt-0">
                <div className="text-center">
                  <motion.div
                    className="flex items-center justify-center"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Clock className="mr-2 h-5 w-5 text-primary/70" />
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        transition: {
                          delay: 0.7,
                          duration: 0.8,
                          ease: "easeOut"
                        }
                      }}
                      className="text-4xl font-bold"
                    >
                      {formatTime(timeElapsed)}
                    </motion.span>
                  </motion.div>
                  <p className="text-sm text-muted-foreground mt-1">Minutes:Seconds</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Keystrokes */}
        <motion.div variants={itemVariants}>
          <Card className="mb-6 glass">
            <CardHeader>
              <CardTitle className="text-xl">Keystrokes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-around">
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.8, duration: 0.5 }
                  }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-green-500"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      delay: 0.9,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {correctChars}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 0.9, duration: 0.5 }
                  }}
                >
                  <motion.p 
                    className="text-2xl font-bold text-red-500"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      delay: 1.0,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {incorrectChars}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </motion.div>
                
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: 1.0, duration: 0.5 }
                  }}
                >
                  <motion.p 
                    className="text-2xl font-bold"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ 
                      delay: 1.1,
                      duration: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {totalKeystrokes}
                  </motion.p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* WPM Chart */}
        <motion.div variants={itemVariants}>
          <Card className="mb-8 glass">
            <CardHeader>
              <CardTitle className="text-xl">WPM Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="w-full h-64"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.7 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={wpmHistory}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="time" 
                      label={{ 
                        value: 'Time (seconds)', 
                        position: 'insideBottomRight',
                        offset: -10
                      }} 
                    />
                    <YAxis 
                      label={{ 
                        value: 'WPM', 
                        angle: -90, 
                        position: 'insideLeft',
                      }} 
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5, strokeWidth: 1 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-wrap justify-center gap-4"
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="default" asChild>
              <Link to="/test">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Link>
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <UITooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" onClick={handleExportResult}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Results
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download your results as a text file</p>
              </TooltipContent>
            </UITooltip>
          </motion.div>
        </motion.div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Result;
