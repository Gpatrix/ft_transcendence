import React, { SetStateAction, useState } from 'react';
import clsx from 'clsx';
import MenuFriendsComponent from '../pages/Chat/MenuFriendsComponent';
import Friend from '../classes/Friend';
import User from '../classes/User';

type ButtonMenuProps = {
    className: string;
    friendId: number,
    setFriends: React.Dispatch<SetStateAction<Friend[]>>;
    profileData: User;
};

export default function ButtonMenu({className, setFriends, friendId} : ButtonMenuProps) {

    const [showFriendMenu, setShowFriendMenu] = useState(false);

    const handleOpenMenu = () => {
        setShowFriendMenu(true);
    };
    
    return (
        <div className='absolute top-0 right-0'>
            <button onClick={() => handleOpenMenu()} className={clsx('absolute z-60 rounded-full bg-blue1 w-[40px] h-[40px] flex items-center justify-around blue-shadow-btn cursor-pointer', className)}>
                <div className='rounded-full bg-blue2 w-[8px] h-[8px]'></div>
                <div className='rounded-full bg-blue2 w-[8px] h-[8px]'></div>
                <div className='rounded-full bg-blue2 w-[8px] h-[8px]'></div>
            </button>

            {showFriendMenu && (
                <MenuFriendsComponent setFriends={setFriends} onClose={setShowFriendMenu} friendId={friendId} />
            )}
        </div>
        
    );
}