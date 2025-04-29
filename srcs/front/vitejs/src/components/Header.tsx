import { tv, type VariantProps } from 'tailwind-variants'
import { clsx } from 'clsx'

const variants = tv({
    base: 'outline-none',
    variants: {
      type: {
        chat: 'text-yellow ',
        profil: 'text-light-red',
        play: 'text-yellow',
      }
    },
    defaultVariants: {
        type: 'play', 
    },
});

type HeaderProps = {
    className?: string;
    value?: string;
} & VariantProps<typeof variants>;

export default function Header({type, className} : HeaderProps) {
    return (
        <div className={clsx("header", variants({ type }), className)}>
            <button className='border border-yellow px-[30px] py-[15px] border-3 m-3'>Chat</button>
            <button className='border border-yellow px-[30px] py-[15px] border-3 m-3'>Profil</button>
            <button className='border border-yellow px-[30px] py-[15px] border-3 m-3'>Jouer</button>
        </div>
    );
}