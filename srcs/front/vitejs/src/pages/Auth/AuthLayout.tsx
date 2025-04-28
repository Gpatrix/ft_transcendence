
import { Outlet } from 'react-router-dom';
import BgShadow from '../../components/BgShadow';

export default function AuthLayout() {
    return (
        <div className='h-[100vh]  flex items-center justify-center'>
            <BgShadow className='w-full max-w-[650px] py-10 flex justify-center'>
                <Outlet />
            </BgShadow>
        </div>
    )
}   
