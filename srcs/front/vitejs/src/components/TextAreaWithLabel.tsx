import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import TextArea from './TextArea.tsx';

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

type TextAreaWithLabelProps = {
    placeholder: string;
    label: string;
    className?: string;
    value?: string;
    hidechars?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
} & VariantProps<typeof variants>;

export default function TextAreaWithLabel({placeholder, label, type, className, onChange, value, hidechars} : TextAreaWithLabelProps) {
    return (
        <div className={clsx('flex flex-col w-full mt-[8px]', className)}>
            <label className={variants({ type })}>{label}</label>
            <TextArea value={value} hidechars={hidechars} onChange={onChange} placeholder={placeholder} type={type} className='h-40' />
        </div>
    );
}