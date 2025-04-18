// import React from 'react'
// import { useState } from 'react';
import './css/global.css'
import './components/Button.tsx'
import './components/Input.tsx'
import Button from './components/Button.tsx'
import Input from './components/Input.tsx'
import ProfilePic from './components/ProfilePic.tsx'
import BgShadow from './components/BgShadow.tsx'
import InputWithLabel from './components/InputWithLabel.tsx'
import MonTest from './components/MonTest.tsx'

function App()
{
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 align-center'>
        <Button type='full' className='px-10'>Test</Button>
        <Button type='stroke' className='px-10'>Test</Button>
        <Input>Entrez votre nom d'utilisateur</Input>
        <Input type='error'>Entrez votre nom d'utilisateur</Input>
      </div>
      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <ProfilePic status='online' profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
        <ProfilePic status='offline' profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
        <ProfilePic status='online' profileLink='https://www.google.com' />
        <ProfilePic status='offline' profileLink='https://www.google.com' className='opacity-30'/>
      </div>
      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
          <BgShadow className='flex flex-col'>
            <InputWithLabel label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur" ></InputWithLabel>
            <InputWithLabel label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur" ></InputWithLabel>
            <MonTest states="Victoire" users={['user1', 'user2']} ></MonTest>
          </BgShadow>'user2'
      </div>
    </div>
  
  )
}

export default App