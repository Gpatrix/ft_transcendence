import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import ProfilePic from './ProfilePic.tsx';

const statusVariants = tv({
    base: 'flex  w-full  rounded-xl  flex items-center',
    variants: {

      status: {
        online: 'h-1/1 opacity-100',
        offline: 'h-1/1 opacity-70',
      }
    },
    defaultVariants: {
        status: 'offline',
    },
});

const typeVariants = tv({
    base: 'flex  w-full  rounded-xl  flex items-center',
    variants: {
      type: {
        nonactive: 'text-light-yellow',
        active: 'bg-light-yellow text-dark',
      }
    },
    defaultVariants: {
        type: 'nonactive',
    },
});

type UserContactProps = {
    userName: string,
    children?: React.ReactNode,
    status?: 'online' | 'offline',
    type?: 'nonactive' | 'active',
    className?: string,
    notifs?: number,
    image?: string
  } & VariantProps<typeof statusVariants> & VariantProps<typeof typeVariants>;

export default function UserContact({className, userName, status='online', notifs, type, image, children} : UserContactProps) {
    return (
        <div  className={clsx('h-[50px] p-[4px] pink-shadow bg-grey', statusVariants( {status} ), typeVariants( {type} ) , className)} >
            <span className='flex items-center h-1/1'>
                <ProfilePic profileLink='test.jpg' image={image} status={status} className='h-1/3 min-w-[42px]'/>
                <p className={clsx('w-fit font-bold ml-[8px]', typeVariants( {type} ) )}>{userName}</p>
            </span>
            {notifs && <p className='ml-auto mr-[4px] bg-light-red text-white 
                                     h-[30px] w-[30px] shadow-sm  shadow-purple 
                                     font-bold rounded-full 
                                     flex items-center justify-center'>{notifs}</p>}

            {children  &&
                <span className='ml-auto mr-[4px]'>
                    <span className='flex'>
                        {children}
                    </span>
                </span>
            }
        </div>
    );
}