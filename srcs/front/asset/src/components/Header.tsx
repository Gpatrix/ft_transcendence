import { Link, useLocation } from 'react-router-dom';
import Button from './Button';
import { clsx } from 'clsx'
import { gpt } from '../translations/pages_reponses';
import { useWebSocket } from '../pages/Auth/WebSocketComponent';
import { useEffect, useState } from 'react';


type HeaderProps = {
    className?: string;
    value?: string;
};

export default function Header({className} : HeaderProps) {

    const location = useLocation();

    const [notifs, setNotifs] = useState(0);

    useState()

    const { friends } = useWebSocket();

    useEffect(() => {
        setNotifs(friends.reduce((accumulator, currentFriend) => accumulator + currentFriend.nbNotifs, 0));
    }, [friends])

    return (
        <div className={clsx("text-yellow header border border-yellow flex relative z-999 bg-dark", className)}>
            <h1 className='w-1/1 h-min self-center ml-[20px]'>ft_transcendance</h1>
            <Link to="/chat">
                {notifs != 0 && <p className='ml-auto mr-[4px] bg-light-red text-white 
                            h-[30px] w-[30px] shadow-sm  shadow-purple 
                            font-bold rounded-full absolute
                            flex items-center justify-center'>{notifs}</p>}
                <Button tabIndex={-1} style={location.pathname=="/chat"?'selected':'header'}>{gpt("social")} </Button>
            </Link>

            <Link to="/profile">
                <Button tabIndex={-1} style={location.pathname=="/profile"?'selected':'header'}>{gpt("profile")}</Button>
            </Link>

            <Link to="/">
                <Button tabIndex={-1} type="full" style='play'>{gpt("home")} </Button>
            </Link>
        </div>
    );
}