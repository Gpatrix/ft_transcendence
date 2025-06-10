import { clsx } from 'clsx'
import { ReactNode } from 'react';

type BgShadowProps = {
    className?: string;
    children: ReactNode;    
  };

export default function BgShadow({children , className} : BgShadowProps) {
    return (
        <div className={clsx('rounded-[5vw]', className)}
        style={{
            boxShadow: "0px 7px 23px 5px rgba(254,254,0,0.5)"
        }}
        >
            {children}
        </div>
    );
}