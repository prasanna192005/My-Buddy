"use client";

import React from "react";
import { InfiniteMovingCards } from "./pages/InfiniteMoving";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[40rem] rounded-md flex flex-col antialiased bg-white dark:bg-black dark:bg-grid-white/[0.05]  items-center justify-center relative overflow-hidden">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow"  />
    </div>
  );
}

const testimonials = [
    {
      quote:
        "MyBuddy connected me with an amazing mentor who helped me understand difficult concepts for NEET! I felt more confident and prepared.",
      name: "Riya Singh",
      title: "Aspiring Doctor",
    },
    {
      quote:
        "The support I received through MyBuddy was incredible! I got the guidance I needed for JEE preparation and improved my scores significantly.",
      name: "Karan Mehta",
      title: "Engineering Aspirant",
    },
    {
      quote:
        "I was struggling with CET topics, but thanks to MyBuddy, I found a perfect tutor who made learning enjoyable. Highly recommend it!",
      name: "Anita Verma",
      title: "CET Candidate",
    },
    {
      quote:
        "MyBuddy is a lifesaver! The audio analysis feature helped me improve my conversation skills with my mentor. I feel much more prepared now.",
      name: "Vikash Kumar",
      title: "Future Engineer",
    },
    {
      quote:
        "The app helped me connect with a college student who had just taken the NEET. Their tips were invaluable! My study sessions are now more effective.",
      name: "Sneha Patil",
      title: "NEET Aspirant",
    },
];

  
