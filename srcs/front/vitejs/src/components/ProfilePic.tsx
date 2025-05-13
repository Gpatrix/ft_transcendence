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
    size?: number; // a supprimer ?
}

export default function ProfilePic({ image, className, profileLink, status='none'} : ProfilePicProps) {
    return (
        <Link to={profileLink}
            className={clsx('relative max-w-fit h-full', className)}
        >
        { status != 'none' &&
            <span className="flex absolute right-[-10%] bottom-[10%] justify-center items-center rounded-full w-2/5 h-2/5 bg-grey">
                <div className={statusVariants( {status} )}/>
            </span> }
            {
                // image ? <img src={image} className="rounded-full h-1/1" />
                <img src={image ? image : "/default.png"} className="rounded-full h-1/1 inline-block" />

            }
        </Link>
    );
}