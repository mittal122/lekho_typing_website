
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface InstructionsModalProps {
  children: React.ReactNode;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>How to Use Type Master</DialogTitle>
          <DialogDescription>
            Quick guide to get you started with the typing test
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 text-left py-2">
          <h3 className="font-medium text-primary">Getting Started</h3>
          <p>Click on "Start Typing" to begin a typing test.</p>
          
          <h3 className="font-medium text-primary">Test Modes</h3>
          <p>Choose between:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Time-based:</strong> Type as many words as possible within the time limit</li>
            <li><strong>Word-based:</strong> Type a specific number of words as quickly as possible</li>
          </ul>
          
          <h3 className="font-medium text-primary">Typing Tips</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Keep your fingers on the home row (ASDF JKL;)</li>
            <li>Focus on accuracy first, speed will follow</li>
            <li>Look at the screen, not your keyboard</li>
            <li>Practice regularly to build muscle memory</li>
          </ul>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button variant="outline" asChild>
            <Link to="/how-to-use">Full Guide</Link>
          </Button>
          <Button asChild>
            <Link to="/test">Start Typing</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsModal;
