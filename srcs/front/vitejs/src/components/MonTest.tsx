// import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { Link } from "react-router-dom";
import ProfilePic from './ProfilePic.tsx'
// import { HomeIcon } from '@heroicons/react/solid'
import React, { useState } from 'react';
import arrowDown from './down-arrow-box.svg';
import styles from './MonTest.module.css';

  
type MonTestProps = {
    className?: string;
    image?: string;
    name?: string;
    states: string;
    users: string[];
}

// recuperer toutes les infos de la partie avec l'api
// depuis le parent ?

export default function MonTest({ states, className, users } : MonTestProps) {

    const [expendedItem, setExpendedItem] = useState(false); // pour garder l'élément sélectionné

    const toggleMatch = () => {
        console.log(expendedItem);
        setExpendedItem(!expendedItem);
        console.log(styles);
        
    }

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
                    
                        {/* liste : */}

                    <span className={clsx('flex flex-col', styles.users)}>
                        {/* absolute top-2 */}
                        <div className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 relative', styles.matchRecap)}>
                            {/* faire attention a chaque utilisateurs */}
                            <span className='w-[60px]'>
                                <ProfilePic profileLink='https://tailwindcss.com/docs/height' image='https://localhost/test.jpeg'/>
                            </span>

                            <span className='separator text-5xl h-min self-center'>/</span>
                            {/* faire attention : utiliser le tab passe en parametre */}
                            <span className='otherUsers  flex'>
                                {
                                    users.map((x, i) =>
                                    {
                                        if (i == 0)
                                            return ''
                                        console.log(i);
                                        return <ProfilePic key={i} profileLink='https://www.google.com' image='https://localhost/test.jpeg' className={(i == 1?'':'ml-[-20px] ')+'inline-block w-[60px]'}/>
                                    }
                                    )
                                }
                                {/* <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='inline-block w-[60px]'/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/> */}
                            </span>
                            <span className={clsx('placement h-min self-center ml-2', styles.test)}>
                                1/4
                            </span>
                        </div>
                        {
                            users.map((x, i) =>
                                <div key={i} className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 mt-3', styles.user)}>
                                    {/* faire attention a chaque utilisateurs */}
                                    <span className='w-[60px]'>
                                        <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
                                    </span>

                                    <span className='separator h-min self-center'>{x}</span>
                                    <span className={clsx('placement h-min self-center ml-2')}>
                                        pts
                                    </span>
                                </div>
                            )

                        }
                    </span>

                    
                    <span className={clsx('h-8 ml-2', styles.more)}>
                        <img className='w-8' onClick={() => toggleMatch()} src={arrowDown} />
                    </span>
                    
                </span>
                {/* {states? <p>{states}</p> : ""} */}
            </div>
        </div>
    );
}