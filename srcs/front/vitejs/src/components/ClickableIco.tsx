import React from 'react';


type ClickableIcoProps = {
    className?: string;
    image: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ClickableIco({image, onClick} : ClickableIcoProps) {
    return (
        <button onClick={onClick} className='h-full cursor-pointer'>
            <img  src={image}/>
        </button>
    );
}