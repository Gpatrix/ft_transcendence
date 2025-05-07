import clsx from 'clsx';
import React from 'react';


type ClickableIcoProps = {
    className?: string;
    image: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ClickableIco({image, onClick, className} : ClickableIcoProps) {
    return (
        <button onClick={onClick} className={clsx('h-full cursor-pointer', className)}>
            <img  src={image}/>
        </button>
    );
}