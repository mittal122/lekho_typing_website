
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Keyboard, Clock, BarChart2, Layers, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HowToUse: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 container max-w-4xl py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-center mb-8">How to Use Type Master</h1>
        
        <div className="grid gap-8">
          {/* Getting Started */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChevronRight className="h-5 w-5" />
                Getting Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Type Master is a free typing test that helps you improve your typing speed and accuracy.
                No account or login needed - just start typing!
              </p>
              
              <div className="flex justify-center my-4">
                <img 
                  src="https://i.imgur.com/eHnOu7n.png" 
                  alt="Typing test example" 
                  className="rounded-lg border shadow-sm max-h-56 object-cover" 
                />
              </div>
              
              <p>
                Click on <strong>Start Typing</strong> on the homepage to begin a new typing test.
                Once you click into the typing area, the test will automatically begin when you
                start typing.
              </p>
            </CardContent>
          </Card>
          
          {/* Test Modes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Test Modes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Type Master offers two different test modes:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    Time-based
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Type as many words as possible within a time limit.
                    Available durations: 15s, 30s, 60s, or 120s.
                  </p>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-medium flex items-center gap-2 mb-2">
                    <Layers className="h-4 w-4" />
                    Word-based
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Type a specific number of words as quickly as possible.
                    Available word counts: 10, 25, 50, or 100 words.
                  </p>
                </div>
              </div>
              
              <p>
                You can switch between modes using the dropdown selector at the top of the test page.
              </p>
            </CardContent>
          </Card>
          
          {/* Typing Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Typing Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p>Follow these tips to improve your typing speed and accuracy:</p>
                
                <ol className="list-decimal list-inside space-y-2">
                  <li className="pl-2">
                    <strong>Use proper finger placement</strong> - Keep your fingers on the home row
                    (ASDF JKL;) and reach for other keys from there.
                  </li>
                  <li className="pl-2">
                    <strong>Look at the screen, not your keyboard</strong> - Train yourself to type without
                    looking at your hands.
                  </li>
                  <li className="pl-2">
                    <strong>Start with accuracy, then speed</strong> - Focus on typing correctly first,
                    then gradually increase your speed.
                  </li>
                  <li className="pl-2">
                    <strong>Practice consistently</strong> - Regular practice, even for just a few minutes
                    each day, will help build muscle memory.
                  </li>
                  <li className="pl-2">
                    <strong>Track your progress</strong> - Use the results page to monitor your
                    improvement over time.
                  </li>
                </ol>
              </div>
            </CardContent>
          </Card>
          
          {/* Understanding Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Understanding Your Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                After completing a test, you'll see detailed statistics about your performance:
              </p>
              
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-20">WPM:</span>
                  <span>Words Per Minute - measures your typing speed.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-20">Accuracy:</span>
                  <span>Percentage of keystrokes that were correct.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-20">Keystrokes:</span>
                  <span>Total number of keys pressed, broken down into correct and incorrect.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold min-w-20">WPM Graph:</span>
                  <span>Shows how your typing speed changed throughout the test.</span>
                </li>
              </ul>
              
              <p>
                You can export your results as a text file to save or share them.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center mt-8">
          <Button size="lg" asChild>
            <Link to="/test">
              Ready to Start Typing
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default HowToUse;
