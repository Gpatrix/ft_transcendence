// import React from 'react'
// import { useState } from 'react';
import './css/global.css'
import './components/Button.tsx'
import './components/Input.tsx'
import Button from './components/Button.tsx'
import Input from './components/Input.tsx'

function App()
{
  return (
      <div className='flex items-center justify-between w-1/2 ml-auto mr-auto align-center'>
        <Button type='full' className='px-10'>Test</Button>
        <Input>Entrez votre nom d'utilisateur</Input>
        <Input type='error'>Entrez votre nom d'utilisateur</Input>
      </div>
  )
}

export default App