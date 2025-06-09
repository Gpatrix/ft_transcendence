import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'px-4 rounded-lg py-2 text-2 bg-grey placeholder-opacity-0 outline-none max-h-[200px] h-[150px] min-h-[100px]',
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

type TextAreaProps = {
    className?: string;
    value?: string;
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    hidechars?: boolean;
} & VariantProps<typeof variants>;

export default function TextArea({type, className, placeholder, onChange, hidechars} : TextAreaProps) {
    return (
        <textarea className={clsx(variants({ type }), className)} type={hidechars ? "password" : "text"} onChange={onChange}  placeholder={placeholder} />
    );
}