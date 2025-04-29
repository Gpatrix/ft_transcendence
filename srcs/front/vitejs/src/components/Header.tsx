import { useLocation } from 'react-router-dom';
import Button from './Button';
import { clsx } from 'clsx'


type HeaderProps = {
    className?: string;
    value?: string;
};

export default function Header({className} : HeaderProps) {

    const location = useLocation();

    // faire la logic de redirection quand on est pas log ?
    
    return (
        <div className={clsx("text-yellow header border border-yellow flex relative z-999 bg-dark", className)}>
            <h1 className='w-1/1 h-min self-center ml-[20px]'>ft_transcendance</h1>
            <Button style={location.pathname=="/chat"?'selected':'header'}>Chat</Button>
            <Button style={location.pathname=="/profil"?'selected':'header'}>Profil</Button>
            <Button type="full" style='play'>Jouer</Button>
        </div>
    );
}