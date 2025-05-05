import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import Input from './Input';

const variants = tv({
    base: 'px-4 rounded-lg py-2 text-2 bg-grey placeholder-opacity-0',
    variants: {
      type: {
        ok: 'text-yellow border border-yellow',
        error: 'text-light-red border border-light-red',
        noborder : 'text-yellow '
      }
    },
    defaultVariants: {
        type: 'ok', 
    },
});


type InputWithIcoProps = {
    placeholder: string;
    className?: string;
    iconSrc: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  } & VariantProps<typeof variants>;
  
export default function InputWithIco({
  iconSrc,
  className,
  placeholder,
  value,
  onChange,
  onSubmit,
  ...formProps
}: InputWithIcoProps) {
    return (
    <form
        onSubmit={onSubmit}
        className={clsx('flex py-1 border border-yellow rounded-lg bg-grey', className)}
        {...formProps}>
        <Input
            type='noborder'
            className='mr-4 w-1/1 placeholder-dark-yellow'
            value={value}
            placeholder={placeholder}
            onChange={onChange}
        />
        <button type='submit' className='ml-auto mr-4 cursor-pointer'>
            <img src={iconSrc} alt="icon" />
        </button>
    </form>
    );
  }