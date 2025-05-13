import { clsx } from 'clsx';
import React, { useState } from 'react';
import ProfilePic from './ProfilePic.tsx';
import arrowDown from './down-arrow-box.svg';
import styles from './MatchResult.module.css';
import Player from '../classes/Player.tsx';
import { useEffect } from 'react';

interface MatchResultProps {
  match: {
    you: {
      id: number;
      userId: number;
      score: number;
    };
    opponents: Array<{
      id: number;
      userId: number;
      score: number;
    }>;
    gameId: number;
    gameDate: Date;
    playTime: number;
    isWinner: number;
  };
}

export default function MatchResult({ match }: MatchResultProps) {
  const [expendedItem, setExpendedItem] = useState(false);
  const [users, setUsers] = useState<Player[]>([]);
  const toggleMatch = () => setExpendedItem(!expendedItem);

  // Transformation vers Player[]
  useEffect(() => {
    const fetchUsers = async () => {
      const allPlayers = await Promise.all([
        Player.fillFromApi(
          match.you.userId, 
          match.you.score, 
          match.gameId, 
          match.isWinner === 1 ? 1 : 2
        ),
        ...match.opponents.map((opp, idx) =>
          Player.fillFromApi(
            opp.userId, 
            opp.score, 
            match.gameId, 
            match.isWinner === 1 ? idx + 2 : 1
          )
        )
      ]);
      setUsers(allPlayers);
    };
  
    fetchUsers();
  }, [match]);


  const mainUser = Player.findUserById(users, match.you.userId);
  let comptUser = 0;

  return (
    <div className={clsx('relative w-full text-yellow overflow-hidden border-solid border-yellow rounded-sm', 'bg-neutral-800', expendedItem ? styles.expended : '')}>
      <div className='transform rotate-10 bg-yellow w-35 h-90 absolute z-1 -mt-5 -ml-10'></div>
      <div className='flex shadow-2xs border-2 p-[10px] w-full relative z-2'>
        <span className='p-[10px] pr-[30px] states text-2xl text-black'></span>
        <span className={clsx('flex justify-center items-baseline h-min', styles.scores)}>
          <span className={clsx('flex flex-col', styles.users)}>
            <div className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 relative', styles.matchRecap)}>
              <span className='w-[60px]'>
                <ProfilePic profileLink={mainUser?.imageUrl || ''} image={mainUser?.imageUrl || ''} />
              </span>
              <span className='separator text-5xl h-min self-center'>/</span>
              <span className='otherUsers flex'>
                {
                  users.map((x, i) => {
                    if (x.id === match.you.userId) return null;
                    comptUser++;
                    return <ProfilePic key={i} profileLink={x.imageUrl} image={x.imageUrl} className={(comptUser === 1 ? '' : 'ml-[-20px] ') + 'inline-block w-[60px]'} />;
                  })
                }
              </span>
              <span className={clsx('placement h-min self-center ml-2')}>
                {mainUser?.place}/{users.length}
              </span>
            </div>
            {
              users.map((x, i) =>
                <div key={i} className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 mt-3', styles.user)}>
                  <span className='h-min self-center text-xl'>
                    #{x.place} |
                  </span>
                  <span className='w-[60px]'>
                    <ProfilePic profileLink={x.imageUrl} image={x.imageUrl} />
                  </span>
                  <span className='separator h-min self-center'>{x.name}</span>
                  <span className={clsx('placement h-min self-center ml-2 ml-auto')}>
                    {x.points}pts
                  </span>
                </div>
              )
            }
          </span>

          <span className={clsx('h-8 ml-2 self-end mb-[15px]', styles.more)}>
            <img className='w-8' onClick={toggleMatch} src={arrowDown} />
          </span>
        </span>
      </div>
    </div>
  );
}