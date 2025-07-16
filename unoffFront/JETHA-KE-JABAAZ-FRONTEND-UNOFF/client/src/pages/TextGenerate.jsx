"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "./utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}) => {
  const [scope, animate] = useAnimate(); // This manages animations for the words
  let wordsArray = words.split(" ");

  // Start animation once the component mounts
  useEffect(() => {
    if (scope.current) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none", // Control blur based on prop
        },
        {
          duration: duration, // Default animation duration
          delay: stagger(0.2), // Stagger the appearance of each word
        }
      );
    }
  }, [scope.current]); // Make sure `scope` is correctly monitored here

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="dark:text-purple-500 text-black opacity-0 text-3xl" // Start with invisible words
              style={{
                filter: filter ? "blur(10px)" : "none", // Apply initial blur if needed
              }}
            >
              {word}{" "} {/* Add space between words */}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("font-bold", className)}>
      <div className="mt-4">
        <div className="dark:text-white text-black text-2xl leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};
