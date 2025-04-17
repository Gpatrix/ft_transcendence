import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'px-8 rounded-lg py-2 text-24 bg-grey',
    variants: {
      type: {
        ok: 'text-yellow border border-yellow',
        error: 'text-light-red border border-light-red',
      }
    },
    defaultVariants: {
        type: 'ok', 
    },
});

type InputProps = {
    children: string;
    className?: string;
} & VariantProps<typeof variants>;

export default function Input({children, type, className} : InputProps) {
    return (
        <input className={clsx(variants({ type }), className)} placeholder={children}></input>
    );
}