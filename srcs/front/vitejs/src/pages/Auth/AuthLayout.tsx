
import { Outlet } from 'react-router-dom';
import BgShadow from '../../components/BgShadow';

export default function AuthLayout() {
    return (
        <div className='h-[100vh] flex items-center justify-center'>
            <BgShadow className='max-w-[600px] min-w-[300px]'>
                <Outlet />
            </BgShadow>
        </div>
    )
}
