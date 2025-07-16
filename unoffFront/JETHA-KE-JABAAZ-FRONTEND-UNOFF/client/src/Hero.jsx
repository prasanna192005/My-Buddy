import React from 'react'

import { SparklesPreview } from './Preview'
import { CanvasRevealEffectDemo } from './ChamkilaCards'
import { InfiniteMovingCardsDemo } from './ReviesMoving'
import { FloatingNavDemo } from './Navbar'
import { FlipWordsDemo } from './FlippinWords'
import { LayoutGridDemo } from './GridFinal'
import { TypewriterEffectSmooth } from './pages/TypingEffect'
import { TypewriterEffectSmoothDemo } from './Typing'
import { FooterWithSocialLinks } from './pages/Footer'

const Hero = () => {
  return (
    <main className='bg-black w-screen h-screen overflow-x-hidden'>
      <FloatingNavDemo />
      <div className='bg-black items-center justify-center'>
        <SparklesPreview />
      </div>
      <div className='w-screen h-screen bg-black mt-32 items-center justify-center'>
        <h1 className='text-purple-600 text-3xl font-bold ml-20'>Navigate Your Future with Confidence 🚀</h1>
        <CanvasRevealEffectDemo />
      </div>
      <div >
      <center><h1 className='text-white font-bold ml-20 text-5xl'>"Your Path To Smart Learning" </h1></center>
        <LayoutGridDemo/>
        <center><h1 className='text-white font-bold ml-20 text-5xl'>Customer Reviews </h1></center>
        <InfiniteMovingCardsDemo  />
        <TypewriterEffectSmoothDemo/>
        {/* <FlipWordsDemo /> */}
      </div>
      <div>
        <FooterWithSocialLinks/>
      </div>
    </main>
  )
}

export default Hero;
