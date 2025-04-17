import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'px-16 py-1 rounded-lg',
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
    text: string;
    className?: string;
} & VariantProps<typeof variants>;

export default function Button({text, type, className} : ButtonProps) {
    return (
        <button className={clsx(variants({ type }), className)}>{text}</button>
    );
}