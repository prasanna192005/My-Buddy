"use client"; // Keep this if you're using Vite with React and need client components

import { TypewriterEffectSmooth } from "./pages/TypingEffect"; // Ensure the path is correct for your project structure

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "#",
      className: "text-purple-500 dark:text-purple-500",
    },
    {
      text: "My",
    },
    {
      text: "Buddy",
    },
    {
      text: "Connect",
    },
    
  ];

  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
     
      <TypewriterEffectSmooth words={words} />
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4 mt-[500px]">
       
      </div>
    </div>
  );
}
