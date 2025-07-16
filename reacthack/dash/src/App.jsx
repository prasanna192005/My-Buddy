import { useState } from 'react'

import './App.css'
import { ThreeDCardDemo } from './test'
import { CoverDemo } from './textwithspark'
import { CardSpotlightDemo } from './spotlight'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <main className='text-4xl font-bold'>
      <div className='flex overflow-hidden gap-10 items-center justify-center'>
     <ThreeDCardDemo/>
     <ThreeDCardDemo/>
     
     
     </div>
     <div>
     <CoverDemo/>
     </div>
     <div>
      <CardSpotlightDemo/>
     </div>
    </main>
    </>
  )
}

export default App
