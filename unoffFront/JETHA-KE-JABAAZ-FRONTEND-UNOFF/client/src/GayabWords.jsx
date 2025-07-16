"use client";
import { TextGenerateEffect } from "./pages/TextGenerate";

const words = `Affordable Training for Tomorrow's Achievers`;

export function TextGenerateEffectDemo() {
  return (
    <div className="text-purple-600"> 
      <TextGenerateEffect words={words} />
    </div>
  );
}
