import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import ProfilePic from './ProfilePic.tsx';
import ClickableIco from './ClickableIco.tsx';

const statusVariants = tv({
    base: 'flex  w-full  rounded-xl  flex items-center',
    variants: {

      status: {
        online: 'h-1/1 opacity-100',
        offline: 'h-1/1 opacity-70',
        none: 'opacity-100',
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
    status?: 'online' | 'offline' | "none",
    type?: 'nonactive' | 'active',
    className?: string,
    notifs?: number,
    image?: string
    nb?: number;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    onClickIcone?: React.MouseEventHandler<HTMLButtonElement>;
    iconeType?: "supp" | "add";
    profileLink?: string;

  } & VariantProps<typeof statusVariants> & VariantProps<typeof typeVariants>;

export default function UserContact({className, userName, status='online', notifs = 0, type, image, children, nb, onClick, onClickIcone, iconeType = "add", profileLink=''} : UserContactProps) {
    
    return (
        <div data-nb={nb} data-status={status} tabIndex={0}
            className={clsx('userContact h-[50px] p-[4px] pink-shadow bg-grey relative', statusVariants( {status} ), typeVariants( {type} ) , className)} onClick={onClick}>
            <span className='flex items-center h-1/1'>
                <ProfilePic profileLink={profileLink} image={image} status={status} className={'h-[42px] w-[42px] min-w-[42px]'}/>
                <p className={clsx('w-fit font-bold ml-[8px]', typeVariants( {type} ) )}>{userName}</p>
            </span>
            {notifs != 0 && <p className='ml-auto mr-[4px] bg-light-red text-white 
                                     h-[30px] w-[30px] shadow-sm  shadow-purple 
                                     font-bold rounded-full 
                                     flex items-center justify-center'>{notifs}</p>}
            {onClickIcone && <ClickableIco image={iconeType == 'add' ? '/icons/circle-plus.svg' : '/icons/error.svg'} onClick={onClickIcone} className="absolute right-1"/>}


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