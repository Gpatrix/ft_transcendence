import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'px-16 rounded-lg py-2 text-24',
    variants: {
      type: {
        full: 'bg-yellow text-grey',
        stroke: 'text-yellow border border-yellow',
      }
    },
    defaultVariants: {
        type: 'stroke',
    },
});

type ButtonProps = {
    children: string;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & VariantProps<typeof variants>;

export default function Button({children, type, className, onClick} : ButtonProps) {
    return (
        <button onClick={onClick} className={clsx(variants({ type }), className)}>{children}</button>
    );
}