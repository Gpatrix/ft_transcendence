// import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { Link } from "react-router-dom";
import ProfilePic from './ProfilePic.tsx'
// import { HomeIcon } from '@heroicons/react/solid'
import arrowDown from './down-arrow-box.svg';



  
type MonTestProps = {
    className?: string;
    image?: string;
    name?: string;
    states: string;
    users: string[];
}

// recuperer toutes les infos de la partie avec l'api
// depuis le parent ?

export default function MonTest({ states, className } : MonTestProps) {
    return (
        <div  className={clsx('relative w-full text-yellow ' + states, className)}>
            {/* <aside className='border-2 border-solid border-yellow rounded-sm mr-px'>date</aside> */}
            {/* <div className=' transform rotate-10 bg-yellow w-30 h-30'></div> */}
            <div className=' flex shadow-2xs border-2 p-[10px]
            border-solid border-yellow rounded-sm w-full'>
                <span className='p-[20px] states text-2xl'>
                    {states}
                </span>
                <span className='scores flex justify-center items-center'>
                    {/* <span className='users'> */}
                        <span className='flex md:gap-8 content-between main-cara max-h-1/1'>
                            {/* faire attention a chaque utilisateurs */}
                            <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' size={0}/>
                            <span className='separator'>/</span>
                            {/* faire attention : utiliser le tab passe en parametre */}
                            <span className='otherUsers  flex'>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' size={0}/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' size={0} className='ml-[-20px]'/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' size={0} className='ml-[-20px]'/>
                            </span>

                        </span>
                    {/* </span> */}
                    <span className='placement'>
                        1/4
                    </span>
                    <span className='more'>
                        <img className='w-30 h-30' src={arrowDown} />
                    </span>
                    
                </span>
                {/* {states? <p>{states}</p> : ""} */}
            </div>
        </div>
    );
}