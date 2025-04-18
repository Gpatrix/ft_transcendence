// import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { Link } from "react-router-dom";
import ProfilePic from './ProfilePic.tsx'



  
type MonTestProps = {
    className?: string;
    image?: string;
    profileLink: string;
    name?: string;
    states: string;
    users: string[];
}

export default function MonTest({ states, className } : MonTestProps) {
    return (
        <div  className={clsx('relative w-full text-yellow ' + states, className)}>
            {/* <aside className='border-2 border-solid border-yellow rounded-sm mr-px'>date</aside> */}
            {/* <div className=' transform rotate-10 bg-yellow w-30 h-30'></div> */}
            <div className=' flex shadow-2xs border-2 p-[10px]
            border-solid border-yellow rounded-sm w-full p'>
                <span className='states'>
                    {states}
                </span>
                <span className='scores'>
                    <span className='users'>
                        <span className='flex main-cara h-10'>
                            {/* faire attention a chaque utilisateurs */}
                            <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='h-1/1 w-1/1 block'/>
                            <span className='separator'>/</span>
                        </span>
                    </span>
                    
                </span>
                {/* {states? <p>{states}</p> : ""} */}
            </div>
        </div>
    );
}