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
import ChatMessage from './components/ChatMessage.tsx'
import MatchResult from './components/MatchResult.tsx'
import Player from './classes/Player.tsx'

function App()
{

  const players: Player[] = [];
  players.push(new Player(0, "user1", "user1@gmail.com", "https://localhost/test.jpeg", 1200, 0, 1))
  players.push(new Player(1, "user2", "user2@gmail.com", "https://localhost/test.jpeg", 800, 0, 2))
  players.push(new Player(2, "user3", "user3@gmail.com", "https://localhost/test.jpeg", 400, 0, 3))
  players.push(new Player(3, "user4", "user4@gmail.com", "https://famille-de-geek.com/wp-content/uploads/2021/12/pyjama-bebe-bob-eponge.jpg", 100, 0, 4))

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
            <MatchResult states="Victoire" users={players} idMainUser={3} ></MatchResult>
          </BgShadow>
      </div>


      <BgShadow className='flex flex-col w-[50vw] ml-auto mr-auto space-y-[32px]'>

        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aliquet gravida lacinia. Vivamus convallis sit amet nunc sit amet sodales. In molestie ipsum est, id gravida lorem elementum et. Maecenas
        </ChatMessage>

        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
          Quisque lorem felis, dictum eu condimentum eget, aliquet at eros. 
        </ChatMessage>

        <ChatMessage profileIco='/test.jpeg' username='xX_D4rkSh4doW_Xx' profileLink='google.com' hour='13:12' >
          Morbi a erat a ipsum posuere consectetur. Maecenas fermentum euismod lectus sed rhoncus. Praesent placerat sem vehicula sapien pretium facilisis. Aliquam aliquam lacus et faucibus consequat. 
        </ChatMessage>
        <ChatMessage profileIco='/test.jpeg' username='Lichar1337' profileLink='google.com' hour='13:12' >
          Duis aliquet gravida lacinia. sit amet nunc sit amet sodales. 
        </ChatMessage>
        <ChatMessage profileIco='/test.jpeg' username='PepitoDeLaVega35' profileLink='google.com' hour='13:12' >
          Issou
        </ChatMessage>
      </BgShadow>
    </div>
  
  )
}

export default App