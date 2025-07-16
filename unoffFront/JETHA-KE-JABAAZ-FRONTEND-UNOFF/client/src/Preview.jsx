"use client"; 
import React from "react"; 
import { Link } from "react-router-dom"; 
import { SparklesCore } from "./pages/Stars"; 
import { TextGenerateEffectDemo } from "./GayabWords"; 

export function SparklesPreview() { 
  return ( 
    <div className="h-[40rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md"> 
      <div className="w-full absolute inset-0 h-screen"> 
        <SparklesCore 
          id="tsparticlesfullpage" 
          background="transparent" 
          minSize={0.6} 
          maxSize={1.4} 
          particleDensity={50} 
          className="w-full h-full" 
          particleColor="#FFFFFF" 
        /> 
      </div> 
      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20"> 
        MyBuddy 
      </h1> 
      <TextGenerateEffectDemo /> 
      <div className='flex gap-6 mt-10'> 
        <Link to="/login"> 
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"> 
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" /> 
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-10 py-5 text-md font-medium text-white backdrop-blur-3xl"> 
              Login 
            </span> 
          </button> 
        </Link> 
        <Link to="/register"> 
          <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"> 
            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" /> 
            <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-5 text-md font-bold text-white backdrop-blur-3xl"> 
              Register 
            </span> 
          </button> 
        </Link> 
      </div> 
    </div> 
  ); 
}  
