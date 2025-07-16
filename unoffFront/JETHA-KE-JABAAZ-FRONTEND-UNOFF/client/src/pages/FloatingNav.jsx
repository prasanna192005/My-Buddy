import React from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

export const FloatingNav = ({ navItems, className }) => {
  return (
    <motion.div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-lg z-[5000] pr-4 pl-6 py-4 items-center justify-center space-x-6 mt-2", 
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <a
          key={`link=${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-2 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-base">{navItem.name}</span> {/* Increased font size */}
        </a>
      ))}
      <button className="border text-base font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-6 py-3 rounded-full"> {/* Increased padding */}
        <span>JKJ</span>
        <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-purple-600 to-transparent h-px" />
      </button>
    </motion.div>
  );
};
