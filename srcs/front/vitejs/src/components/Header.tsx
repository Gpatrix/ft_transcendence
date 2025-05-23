import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { clsx } from 'clsx'


type HeaderProps = {
    className?: string;
    value?: string;
};

export default function Header({className} : HeaderProps) {

    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className={clsx("text-yellow header border border-yellow flex relative z-999 bg-dark", className)}>
            <h1 className='w-1/1 h-min self-center ml-[20px]'>ft_transcendance</h1>
            <Link to="/chat">
                <Button style={location.pathname=="/chat"?'selected':'header'}>Chat</Button>
            </Link>

            <Link to="/profile">
                <Button style={location.pathname=="/profil"?'selected':'header'}>Profil</Button>
            </Link>

            <Link to="/play">
                <Button type="full" style='play'>Jouer</Button>
            </Link>
        </div>
    );
}