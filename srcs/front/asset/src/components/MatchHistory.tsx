import { clsx } from 'clsx';
import { useState, useEffect } from 'react';
import ProfilePic from './ProfilePic.tsx';
import arrowDown from './down-arrow-box.svg';
import styles from './MatchResult.module.css';

interface MatchResultProps {
  match: {
    you: {
      id: number;
      userId: number;
      score: number;
      scoreFromBlockchain: number | undefined;  
    };
    opponents: Array<{
      id: number;
      userId: number;
      score: number;
      scoreFromBlockchain: number | undefined;
    }>;
    gameId: number;
    gameDate: Date;
    playTime: number;
    isWinner: number;
  };
}

export class MatchPlayer {
  userId: number;
  score: number;
  place: number;
  name: string;
  imageUrl: string;
  points: number;

  constructor( userId: number, score: number, name: string, imageUrl: string, place : number) 
  {
    this.userId = userId;
    this.score = score;
    this.name = name;
    this.imageUrl = imageUrl;
    this.points = score;
    this.place = place;
  }

  static async fillFromApi(
    userId: number,
    score: number,
    place: number
  ): Promise<MatchPlayer> {
    const res = await fetch(`/api/user/get_profile/${userId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch user with ID ${userId}`);
    }

    const data = await res.json()
    return new MatchPlayer(
      userId,
      score,
      data.data.name,
      data.data.profPicture,
      place,
    );
  } 

  static findUserById(players: MatchPlayer[], userId: number): MatchPlayer | undefined {
    return players.find(player => player.userId === userId);
  }
}

export default function MatchResult({ match }: MatchResultProps) {
  const [expendedItem, setExpendedItem] = useState(false);
  const [users, setUsers] = useState<MatchPlayer[]>([]);
  const [mainUser, setMainUser] = useState<MatchPlayer | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleMatch = () => setExpendedItem(!expendedItem);

  useEffect(() => {
    setUsers([]);
    setLoading(true);

    const fetchUsers = async () => {
      try {
        const allMatchPlayersRaw = [
          { userId: match.you.userId, score: match.you.score },
          ...match.opponents.map(o => ({ userId: o.userId, score: o.score }))
        ];

        const sorted = [...allMatchPlayersRaw].sort((a, b) => b.score - a.score);

        const userPromises = sorted.map(async (player) => {
          return MatchPlayer.fillFromApi(player.userId, player.score, match.gameId)
        });

        const MatchPlayers = await Promise.all(userPromises);
        setUsers(MatchPlayers);
      } catch (error) {
        // console.error("Error fetching MatchPlayer data:", error);
      } finally {
        setLoading(false);
      }
    };
   
    fetchUsers(); 
  }, [match]);

  useEffect(() => {
    const user = MatchPlayer.findUserById(users, match.you.userId);
    setMainUser(user || null);
  }, [users, match.you.userId]);

  useEffect(()=> {
    match.gameDate = new Date(match.gameDate)
  }, [match])

  const winner = users.find(user => user.place === 1);
  const otherMatchPlayers = users.filter(user => user.place !== 1);

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
                    <ProfilePic profileLink={`/profile/${winner?.userId}`} className='inline-block w-[60px] h-[60px]' image={winner?.imageUrl || ''} />
                  </span>
                  <span className='separator mr-8 ml-8 text-5xl h-min self-center'>/</span>
                  <span className='otherUsers flex'>
                    {otherMatchPlayers.map((MatchPlayer, i) => (
                      <ProfilePic 
                        key={i} 
                        profileLink={`/profile/${MatchPlayer.userId}`} 
                        image={MatchPlayer.imageUrl} 
                        className={(i === 0 ? '' : 'ml-[-20px] ') + 'inline-block w-[60px] h-[60px]'} 
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
                        <ProfilePic profileLink={`/profile/${x.userId}`} className='inline-block w-[60px] h-[60px]' image={x.imageUrl} />
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
