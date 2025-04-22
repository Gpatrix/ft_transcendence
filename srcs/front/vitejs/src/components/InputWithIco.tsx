import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'
import Input from './Input';

const variants = tv({
    base: 'px-4 rounded-lg py-2 text-2 bg-grey placeholder-opacity-0',
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


type InputWithIcoProps = {
    placeholder: string;
    className?: string;
    iconSrc: string;
    value?: string;
  } & VariantProps<typeof variants> & React.FormHTMLAttributes<HTMLFormElement>;
  
export default function InputWithIco({
  iconSrc,
  className,
  placeholder,
  value,
  ...formProps
}: InputWithIcoProps) {
    return (
    <form
        className={clsx('flex py-1 border border-yellow rounded-lg', className)}
        {...formProps}>
        <Input
            type='noborder'
            className='mr-4'
            value={value}
            placeholder={placeholder}   
        />
        <button type='submit' className='ml-auto mr-4 cursor-pointer'>
            <img src={iconSrc} alt="icon" />
        </button>
    </form>
    );
  }