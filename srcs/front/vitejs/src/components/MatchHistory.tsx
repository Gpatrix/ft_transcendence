import { clsx } from 'clsx';
import React, { useState, useEffect } from 'react';
import ProfilePic from './ProfilePic.tsx';
import arrowDown from './down-arrow-box.svg';
import styles from './MatchResult.module.css';
import Player from '../classes/Player.tsx';

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
  const [mainUser, setMainUser] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleMatch = () => setExpendedItem(!expendedItem);

  useEffect(() => {
    setUsers([]);
    setLoading(true);

    const fetchUsers = async () => {
      try {
        const allPlayersRaw = [
          { userId: match.you.userId, score: match.you.score },
          ...match.opponents.map(o => ({ userId: o.userId, score: o.score }))
        ];

        const sorted = [...allPlayersRaw].sort((a, b) => b.score - a.score);

        const userPromises = sorted.map((player, idx) =>
          Player.fillFromApi(player.userId, player.score, match.gameId, idx + 1)
        );

        const players = await Promise.all(userPromises);
        setUsers(players);
      } catch (error) {
        console.error("Error fetching player data:", error);
      } finally {
        setLoading(false);
      }
    };
    match.gameDate = new Date(match.gameDate)
    fetchUsers();
  }, [match]);

  useEffect(() => {
    const user = Player.findUserById(users, match.you.userId);
    setMainUser(user || null);
  }, [users, match.you.userId]);


  console.log(match.gameDate)
  const winner = users.find(user => user.place === 1);
  const otherPlayers = users.filter(user => user.place !== 1);

  if (loading) {
    return (
      <div className="w-full p-4 bg-neutral-800 border-2 border-yellow rounded-sm text-center">
        Chargement...
      </div>
    );
  }

  return (
    <div className='relative mt-7'>
        <span className='z-1 absolute right-0 top-[-20px] bg-grey px-2 border-yellow border-1 text-yellow'>
        {match.gameDate.toLocaleDateString("fr-FR", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }) + ", " + match.gameDate.toLocaleTimeString("fr-FR", {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).replace(":", "h")}
        </span>

        <div className={clsx('z-0 relative w-full text-yellow overflow-hidden border-solid border-yellow rounded-sm', 'bg-neutral-800', expendedItem ? styles.expended : '')}>
          <div className='transform rotate-10 bg-yellow w-35 h-90 absolute z-1 -mt-5 -ml-10'></div>
          <div className='flex shadow-2xs border-2 p-[10px] w-full relative z-2'>
            <span className='p-[10px] pr-[30px] states text-2xl text-black'></span>
            <span className={clsx('flex h-min w-full', styles.scores)}>
              <span className={clsx('flex flex-col w-full', styles.users)}>
                <div className={clsx('flex  main-cara max-h-1/1 mr-5 relative', styles.matchRecap)}>
                  <span className='w-[60px]'>
                    <ProfilePic profileLink={`/profile/${winner?.id}`} image={winner?.imageUrl || ''} />
                  </span>
                  <span className='separator mr-8 ml-8 text-5xl h-min self-center'>/</span>
                  <span className='otherUsers flex'>
                    {otherPlayers.map((player, i) => (
                      <ProfilePic 
                        key={i} 
                        profileLink={`/profile/${player.id}`} 
                        image={player.imageUrl} 
                        className={(i === 0 ? '' : 'ml-[-20px] ') + 'inline-block w-[60px]'} 
                      />
                    ))}
                  </span>
                  <span className={clsx('placement h-min self-center ml-auto')}>
                    {`${mainUser?.place} / ${users.length}`}
                  </span>
                </div>
                {[...users]
                  .sort((a, b) => a.place - b.place)
                  .map((x, i) =>
                    <div key={i} className={clsx('flex md:gap-8 content-between main-cara max-h-1/1 mr-5 mt-3', styles.user)}>
                      <span className='h-min self-center text-xl text-grey'>
                        #{x.place} |
                      </span>
                      <span className='w-[60px]'>
                        <ProfilePic profileLink={`/profile/${x.id}`} image={x.imageUrl} />
                      </span>
                      <span className='separator h-min self-center'>
                        {x.name}
                      </span>
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
    </div>
  );
}
