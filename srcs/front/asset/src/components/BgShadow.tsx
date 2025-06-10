import { clsx } from 'clsx'
import { ReactNode } from 'react';

type BgShadowProps = {
    className?: string;
    children: ReactNode;    
  };

export default function BgShadow({children , className} : BgShadowProps) {
    return (
        <div className={clsx('rounded-[5vw]', className)}
        >
            {children}
        </div>
    );
}