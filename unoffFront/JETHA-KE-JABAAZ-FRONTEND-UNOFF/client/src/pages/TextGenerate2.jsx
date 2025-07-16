"use client";
import { TextGenerateEffect } from "./pages/TextGenerate";

const words = `{reply}`;

export function TextGenerateEffectDemo2() {
  return (
    <div className="text-purple-600"> 
      <TextGenerateEffect words={words} />
    </div>
  );
}
