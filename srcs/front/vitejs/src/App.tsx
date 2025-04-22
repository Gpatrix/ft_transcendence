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
import UserContact from './components/UserContact.tsx'
import ClickableIco from './components/ClickableIco.tsx'

function App()
{
  return (
    <div className='flex flex-col'>
      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 align-center'>
        <Button type='full' className='px-10'>Test</Button>
        <Button type='stroke' className='px-10'>Test</Button>
        <Input value="" placeholder="Entrez votre nom d'utilisateur"/>
        <Input value="" type='error' placeholder="Entrez votre nom d'utilisateur" />
      </div>
      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <ProfilePic status='online' profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
        <ProfilePic status='offline' profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
        <ProfilePic status='online' profileLink='https://www.google.com' />
        <ProfilePic status='offline' profileLink='https://www.google.com' className='opacity-30'/>
      </div>




      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <UserContact className='w-[50px]' status='offline' userName='Titi42' image='/test.jpeg' />
        <UserContact className='w-[50px]' status='online'  userName='Titi42' image='/test.jpeg' />
      </div>

      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <UserContact status='offline' userName='Titi42' image='/test.jpeg' notifs={1} />
        <UserContact status='online'  userName='Titi42' image='/test.jpeg' notifs={9}/>
      </div>

      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <UserContact status='offline' type='active' userName='Titi42' image='/test.jpeg' notifs={1} />
        <UserContact status='online'  type='active' userName='Titi42' image='/test.jpeg' notifs={9}/>
      </div>

      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
        <UserContact status='online'  userName='Titi42' image='/test.jpeg' >
          <ClickableIco image='/icons/icon_chat.svg' onClick={()=>alert('test')}/>
          <ClickableIco image='/icons/icon_chat.svg' onClick={()=>alert('test')}/>
        </UserContact> 

        <UserContact status='offline'  userName='Titi42' image='/test.jpeg' >
          <ClickableIco image='/icons/icon_chat.svg' onClick={()=>alert('test')}/>
        </UserContact> 
      </div>



      <div className='flex justify-between items-center my-5 mr-auto ml-auto w-1/2 h-1/2 align-center'>
          <BgShadow className='flex flex-col'>
            <InputWithLabel label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur" ></InputWithLabel>
            <InputWithLabel label="Nom d'utilisateur" placeholder="Entrez votre nom d'utilisateur" ></InputWithLabel>
            <MonTest states="Victoire" users={['user1', 'user2']} ></MonTest>
          </BgShadow>
      </div>
    </div>
  
  )
}

export default App