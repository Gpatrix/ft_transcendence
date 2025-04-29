import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { Link } from "react-router-dom";


const statusVariants = tv({
    base: 'rounded-full w-9/11 h-9/11',
    variants: {
      status: {
        none: 'hidden',
        online: 'bg-green',
        offline: 'bg-offline',
      },
    },
    defaultVariants: {
      status: 'none',
    },
});
  
type ProfilePicProps = {
    className?: string;
    image?: string;
    profileLink: string
    status?: VariantProps<typeof statusVariants>['status'];
    size?: number;
}

export default function ProfilePic({ image, className, profileLink, status='none', size=30 } : ProfilePicProps) {
    console.log("test" + size);
    
    return (
        <Link to={profileLink}
            className={clsx('relative flex flex-col justify-center max-w-fit h-full'
                // + (size>0?(" w-10 h-" + size):""), className)}
                + (size>0?(" w-" + size + " h-" + size):""), className)}
            // className={clsx('relative' + (size>0?(" w-" + size + " h-" + size):""), className)}
        >
        { status != 'none' &&
            <span className="flex absolute right-[-10%] bottom-[10%] justify-center items-center rounded-full w-2/5 h-2/5 bg-grey">
                <div className={statusVariants( {status} )}/>
            </span> }
            {
                // image ? <img src={image} className="w-auto h-full rounded-full" />
                image ? <img src={image} className="rounded-full h-1/1" />
                      : <div className="flex justify-center items-center text-[100%] font-bold rounded-full h-1/1 w-1/1 bg-light-yellow text-grey">T</div>
            }
        </Link>
    );
}