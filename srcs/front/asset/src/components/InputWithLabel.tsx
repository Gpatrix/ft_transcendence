import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import Input from './Input.tsx';

const variants = tv({
    base: 'py-2 text-2',
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
    value?: string;
    hidechars?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
} & VariantProps<typeof variants>;

export default function InputWithLabel({placeholder, label, type, className, onChange, value, hidechars, disabled} : InputWithLabelProps) {
    return (
        <div className={clsx('flex flex-col w-full mt-[8px]', className)}>
            <label className={variants({ type })}>{label}</label>
            <Input value={value} hidechars={hidechars} onChange={onChange} placeholder={placeholder} type={type} disabled={disabled} />
        </div>
    );
}