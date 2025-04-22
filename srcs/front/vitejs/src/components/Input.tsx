import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'px-4 rounded-lg py-2 text-2 bg-grey placeholder-opacity-0',
    variants: {
      type: {
        ok: 'text-yellow border border-yellow',
        error: 'text-light-red border border-light-red',
        noborder: 'text-yellow',
      }
    },
    defaultVariants: {
        type: 'ok', 
    },
});

type InputProps = {
    className?: string;
    value: string;
    placeholder: string;
} & VariantProps<typeof variants>;

export default function Input({type, className, placeholder} : InputProps) {
    return (
        <input className={clsx(variants({ type }), className)} placeholder={placeholder}></input>
    );
}