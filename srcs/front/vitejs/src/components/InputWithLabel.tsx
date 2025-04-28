import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import Input from './Input.tsx';

const variants = tv({
    base: 'py-2 text-2 bg-grey',
    variants: {
      type: {
        ok: 'text-yellow',
        error: 'text-light-red',
      }
    },
    defaultVariants: {
        type: 'ok', 
    },
});

type InputWithLabelProps = {
    placeholder: string;
    label: string;
    className?: string;
} & VariantProps<typeof variants>;

export default function InputWithLabel({placeholder, label, type, className} : InputWithLabelProps) {
    return (
        <div className={clsx('flex flex-col w-full', className)}>
            <label className={variants({ type })}>{label}</label>
            <Input placeholder={placeholder} type={type} />
        </div>
    );
}