import { clsx } from 'clsx'
import { useLocation } from 'react-router-dom';
import Button from './Button';


type HeaderProps = {
    className?: string;
    value?: string;
};

export default function Header({className} : HeaderProps) {

    const location = useLocation();

    // faire la logic de redirection quand on est pas log ?
    
    return (
        <div className={clsx("text-yellow header border border-yellow flex", className)}>
            <h1 className='w-1/1 h-min self-center ml-[20px]'>ft_ranscendance</h1>
            <Button header={location.pathname=="/chat"?'selected':'other'}>Chat</Button>
            <Button header={location.pathname=="/profil"?'selected':'other'}>Profil</Button>
            <Button type="full" header='play'>Jouer</Button>
        </div>
    );
}