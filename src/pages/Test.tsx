
import React from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TypingTest from '@/components/TypingTest';

const Test: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <motion.main 
        className="flex-1 flex flex-col p-4 md:p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.6,
          type: "spring",
          stiffness: 100,
          damping: 20
        }}
      >
        <motion.h1 
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: 0.2,
            duration: 0.5
          }}
        >
          <motion.span
            className="relative inline-block"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.3,
              type: "spring",
              stiffness: 200
            }}
          >
            Lekho
            <motion.span
              className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            />
          </motion.span>
          <motion.span
            className="ml-2 text-muted-foreground text-xl font-normal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            Typing Test
          </motion.span>
        </motion.h1>
        <TypingTest />
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Test;
