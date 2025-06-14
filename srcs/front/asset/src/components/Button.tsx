import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import { ReactNode } from 'react';

const variants = tv({
    base: ' rounded-lg py-3 text-24 cursor-pointer',
    variants: {
        type: {
            full: 'bg-yellow text-grey',
            stroke: 'text-yellow border border-yellow',
            google: 'duration-100 ease-in eate-out text-white border border-white hover:text-grey hover:bg-white px-5 w-fit mt-3 ml-auto mr-auto'
        },
        style: {
            none:'',
            header: 'px-[30px] py-[15px] rounded-md m-3 yellow-shadow-btn',
            popup: 'px-[20px] py-[5px] rounded-md m-3 yellow-shadow-btn',
            selected: 'px-[30px] py-[15px] rounded-md m-3 yellow-shadow-btn border-dark-red text-dark-red',
            play: 'px-[60px] py-[15px] rounded-md m-3 red-shadow-btn',
            add: 'px-[15px] py-[2px] rounded-full m-3 red-shadow-btn',
        },
    },
    defaultVariants: {
        type: 'stroke',
        style:'none',
    },
});

type ButtonProps = {
    children: string | ReactNode;
    className?: string;
    type?: string;
    style?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    tabIndex?: number;
} & VariantProps<typeof variants>;

export default function Button({children, type, style, className, onClick, tabIndex=0} : ButtonProps) {
    return (
        <button tabIndex={tabIndex} onClick={onClick} className={clsx(variants({ type, style }), className)}>{children}</button>
    );
}