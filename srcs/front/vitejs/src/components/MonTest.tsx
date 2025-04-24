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
        <div  className={clsx('relative w-full text-yellow overflow-hidden border-solid border-yellow rounded-sm ' + states, className)}>
            {/* <aside className='border-2 border-solid border-yellow rounded-sm mr-px'>date</aside> */}
            <div className=' transform rotate-10 bg-yellow w-35 h-50 absolute z-1 -mt-5 -ml-5'></div>
            <div className=' flex shadow-2xs border-2 p-[10px]
             w-full relative z-2'>
                <span className='p-[10px] pr-[30px] states text-2xl text-black'>
                    {states}
                </span>
                <span className='scores flex justify-center items-center h-[60px]'>
                    {/* <span className='users'> */}
                        <span className='flex md:gap-8 content-between main-cara max-h-1/1 mr-5'>
                            {/* faire attention a chaque utilisateurs */}
                            <span className='w-[60px]'>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
                            </span>

                            <span className='separator text-5xl h-min self-center'>/</span>
                            {/* faire attention : utiliser le tab passe en parametre */}
                            <span className='otherUsers  flex'>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='inline-block w-[60px]'/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/>
                                <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/>
                            </span>
                            <span className='placement h-min self-center ml-2'>
                                1/4
                            </span>
                        </span>
                    {/* </span> */}

                    
                    <span className='more h-8 ml-2'>
                        <img className='w-8' src={arrowDown} />
                    </span>
                    
                </span>
                {/* {states? <p>{states}</p> : ""} */}
            </div>
        </div>
    );
}



// return (
//     <div  className={clsx('relative w-full text-yellow overflow-hidden border-solid border-yellow rounded-sm ' + states, className)}>
//         {/* <aside className='border-2 border-solid border-yellow rounded-sm mr-px'>date</aside> */}
//         <div className=' transform rotate-10 bg-yellow w-35 h-50 absolute z-1 -mt-5 -ml-5'></div>
//         <div className=' flex shadow-2xs border-2 p-[10px]
//          w-full relative z-2'>
//             <span className='p-[10px] pr-[30px] states text-2xl text-black'>
//                 {states}
//             </span>
//             <span className='scores flex justify-center items-center h-[60px]'>
//                 {/* <span className='users'> */}
//                     <span className='flex md:gap-8 content-between main-cara max-h-1/1 mr-5'>
//                         {/* faire attention a chaque utilisateurs */}
//                         <span className='w-[60px]'>
//                             <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg'/>
//                         </span>

//                         <span className='separator text-5xl h-min self-center'>/</span>
//                         {/* faire attention : utiliser le tab passe en parametre */}
//                         <span className='otherUsers  flex'>
//                             <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='inline-block w-[60px]'/>
//                             <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/>
//                             <ProfilePic profileLink='https://www.google.com' image='https://localhost/test.jpeg' className='ml-[-20px] inline-block w-[60px]'/>
//                         </span>
//                         <span className='placement h-min self-center ml-2'>
//                             1/4
//                         </span>
//                     </span>
//                 {/* </span> */}

                
//                 <span className='more h-8 ml-2'>
//                     <img className='w-8' src={arrowDown} />
//                 </span>
                
//             </span>
//             {/* {states? <p>{states}</p> : ""} */}
//         </div>
//     </div>
// );