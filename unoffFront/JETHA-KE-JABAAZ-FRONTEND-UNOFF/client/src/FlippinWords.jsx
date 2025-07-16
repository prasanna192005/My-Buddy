import React from "react";
import { FlipWords } from "./pages/Flipwords";

export function FlipWordsDemo() {
    const words = [
        "connection",
        "training",
        "resources",
        "success",
        "collaboration",
        "expertise",
        "mentorship",
        "affordability",
        "growth",
        "support",
        "guidance",
        "skills",
        "preparation",
        "community",
        "achievement",
      ];
      
      

  return (
    (<div className="h-[40rem] flex justify-center items-center px-4">
     <div className="text-4xl mx-auto font-normal text-neutral-600 dark:text-neutral-400">
  Empowering
  <FlipWords words={words} /> <br />
  aspiring doctors and engineers with MyBuddy
</div>

    </div>)
  );
}
