// import React from 'react'
// import { useState } from 'react';
import './css/global.css'
import './components/Button.tsx'
import Button from './components/Button.tsx'

function App()
{
  return (
      <div className='flex items-center justify-center w-full h-full'>
        <Button text='hey' type='full' className='px-10'/>
      </div>
  )
}

export default App