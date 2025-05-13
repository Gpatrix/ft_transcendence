// import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { Link } from "react-router-dom";
import ProfilePic from './ProfilePic.tsx'
// import { HomeIcon } from '@heroicons/react/solid'
import React, { useState } from 'react';
import arrowDown from './down-arrow-box.svg';
import styles from './MatchResult.module.css';
import Player from '../classes/Player.tsx'

  
type MatchResult = {
    className?: string;
    image?: string;
    name?: string;
    states: string;
    users: Player[];
    idMainUser: number;
}

// recuperer toutes les infos de la partie avec l'api
// depuis le parent ?

export default function MatchResult({ states, className, users, idMainUser } : MatchResult) {

    const [expendedItem, setExpendedItem] = useState(false); // pour garder l'élément sélectionné
    
    const toggleMatch = () => {
        console.log(expendedItem);
        setExpendedItem(!expendedItem);
        console.log(styles);
        
    }
    const mainUser = Player.findUserById(users, idMainUser);
    let comptUser : number = 0
    
    
    return (
        <div  className={clsx('relative w-full text-yellow overflow-hidden border-solid border-yellow rounded-sm', states, className, expendedItem?styles.expended:'')}>
            {/* <aside className='border-2 border-solid border-yellow rounded-sm mr-px'>date</aside> */}
            <div className=' transform rotate-10 bg-yellow w-35 h-90 absolute z-1 -mt-5 -ml-10'></div>
            <div className=' flex shadow-2xs border-2 p-[10px]
             w-full relative z-2'>
                <span className='p-[10px] pr-[30px] states text-2xl text-black'>
                    {states}
                </span>
                <span className={clsx('flex justify-center items-baseline  h-min', styles.scores)}>
                    <span className={clsx('flex flex-col', styles.users)}>
                        <div className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 relative', styles.matchRecap)}>
                            <span className='w-[60px]'>
                                <ProfilePic profileLink='https://tailwindcss.com/docs/height' image={mainUser?mainUser.profPicture:''}/>
                            </span>

                            <span className='separator text-5xl h-min self-center'>/</span>
                            <span className='otherUsers  flex'>
                                {
                                    users.map((x, i) =>
                                    {
                                        if (x.id == idMainUser)
                                            return ''
                                        comptUser++;
                                        return <ProfilePic key={i} profileLink='https://www.google.com' image={x.profPicture} className={(comptUser == 1?'':'ml-[-20px] ')+'inline-block w-[60px]'}/>
                                    })
                                }
                            </span>
                            <span className={clsx('placement h-min self-center ml-2')}>
                                {mainUser?.place}/{users.length}
                            </span>
                        </div>
                        {
                            users.map((x, i) =>
                                <div key={i} className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 mt-3', styles.user)}>
                                    <span className='h-min self-center text-xl'>
                                        #{x.place} |
                                    </span>
                                    <span className='w-[60px]'>
                                        <ProfilePic profileLink='https://www.google.com' image={x.profPicture}/>
                                    </span>

                                    <span className='separator h-min self-center'>{x.name}</span>
                                    <span className={clsx('placement h-min self-center ml-2')}>
                                        {x.points}pts
                                    </span>
                                </div>
                            )

                        }
                    </span>

                    
                    <span className={clsx('h-8 ml-2 self-end mb-[15px]', styles.more)}>
                        <img className='w-8' onClick={() => toggleMatch()} src={arrowDown} />
                    </span>
                    
                </span>
                {/* {states? <p>{states}</p> : ""} */}
            </div>
        </div>
    );
}