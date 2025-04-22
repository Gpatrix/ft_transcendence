import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import ProfilePic from './ProfilePic.tsx';
import { use } from 'react';

const variants = tv({
    base: 'flex h-[16px] w-full shadow-xs shadow-purple rounded-full  flex items-center',
    variants: {
      type: {
        nonactive: 'text-light-yellow',
        active: 'text-light-red',
      },
      status: {
        online: 'h-1/1 opacity-100',
        offline: 'h-1/1 opacity-70',
      }
    },
    defaultVariants: {
        type: 'nonactive',
        status: 'offline',
    },
});

type UserContactProps = {
    userName : string,
    status? : string,
    className?: string,
    notifs?: number,
    image?: string
} & VariantProps<typeof variants>;

export default function UserContact({className, userName, status, notifs, image} : UserContactProps) {
    return (
        <div  className={clsx('h-8', variants( {status}) )} >
            <span className='flex items-center h-1/1'>
                <ProfilePic profileLink='test.jpg' image={image} status={status}/>
                {/* <p className='w-fit color'>{userName}</p> */}
            </span>
        </div>
    );
}