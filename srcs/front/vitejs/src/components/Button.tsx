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
      }
    },
    defaultVariants: {
        type: 'stroke',
    },
});

type ButtonProps = {
    children: string | ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & VariantProps<typeof variants>;

export default function Button({children, type, className, onClick} : ButtonProps) {
    return (
        <button onClick={onClick} className={clsx(variants({ type }), className)}>{children}</button>
    );
}