import ProfilePic from './ProfilePic';
import GameInvite from './GameInvite';

type ChatMessageProps = {
    className?: string;
    profileIco: string;
    username: string;
    profileLink?: string;
    hour: string;
    children: string;
};

export default function ChatMessage({profileLink = "", profileIco, username, hour, children} : ChatMessageProps) {
    if (children.includes("**game:/lobby/friendLoby/waiting-room")) {
        return (<GameInvite link={children} username={username}/>)
    }
    else {
        return (
            <span className='flex flex-col space-y-[8px]'>
                <span className='flex items-center h-[42px] space-x-[16px] text-white'>
                    <ProfilePic profileLink={profileLink} image={profileIco}/>
                    <span className='text-light-yellow'>{username}</span>
                    <span className='bg-light-yellow rounded-full w-[5px] h-[5px]' ></span>
                    <span className='text-white font-thin'>{hour}</span>
                </span>
                <p className='text-white p-[16px] w-fit rounded-xl bg-grey-2 pink-shadow max-w-1/1 wrap-break-word'>
                    {children}
                </p>
            </span>
        );
    }
}