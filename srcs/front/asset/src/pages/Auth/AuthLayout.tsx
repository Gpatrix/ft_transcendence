
import { Outlet } from 'react-router-dom';
import BgShadow from '../../components/BgShadow';

export default function AuthLayout() {
    return (
        <div className='h-[100vh] flex flex-col items-center justify-center '>
            <h1 className='text-shadow-lg/40  text-shadow-purple mb-10 center font-extrabold font-title text-yellow text-[5vw] top-15 md:text-3xl mb-[5vh]'>ft_transcendance</h1>
            <img src="/layout_1.svg" className='fixed top-0 left-0 hidden xl:block'/>
            <img src="/layout_2.svg" className='fixed bottom-10 right-0 hidden xl:block'/>
            <BgShadow className='w-[80vw] md:w-[600px] md:px-20  py-10 shadow-none md:shadow-xl/15'>
                <Outlet />
            </BgShadow>
        </div>
    )
}   
