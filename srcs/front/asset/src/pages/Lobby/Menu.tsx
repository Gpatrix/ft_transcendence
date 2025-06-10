import { Link } from "react-router";
import BgShadow from "../../components/BgShadow";
import AuthLayout from "../Auth/AuthLayout";
import { useState } from "react";
import clsx from "clsx";
import { gpt } from "../../translations/pages_reponses";

interface MenuLinkProps {
    link?: string,
    label: string,
    first?: string
    firstLink?: string
    second?: string
    secondLink?: string
    third?: string
    thirdLink?: string
}

export function MenuLink({link, label} : MenuLinkProps) {
    const [state, setState] = useState<boolean>(false)

    return (
        <Link to={link} 
            onMouseEnter={()=>setState(true)} 
            onFocus={()=>setState(true)}
            onMouseLeave={()=>setState(false)}
            onBlur={()=>setState(false)}
            className="flex items-center"
        >
            <span className="w-[20px] block">
                {state && <img src="/icons/menu_arrow.svg"/> }
            </span>
            <span className={clsx("uppercase font-bold ease-in-out duration-300 text-4xl ", state ? "text-yellow": "text-yellow/50")}>
                {label}
            </span>
        </Link>
    )
}

export function MenuDropDown({ label, first, second, firstLink, secondLink, third, thirdLink }: MenuLinkProps) {
    const [state, setState] = useState<boolean>(false)
    const [fold, setFold] = useState<boolean>(false)
  
    return (

      <span
        onMouseEnter={() => setState(true)}
        onFocus={() => setState(true)}
        onMouseLeave={() => setState(!fold ? false : true)}
        onBlur={() => setState(!fold ? false : true)}
        onClick={() => setFold(!fold)}
        className="flex items-center cursor-pointer select-none"
      >
        <span className="w-[20px] block ">
          {state && (
            <img
              src="/icons/menu_arrow.svg"
              className={clsx(
                "transition-transform duration-300",
                fold ? "rotate-90" : "rotate-0"
              )}
            />
          )}
        </span>
  
        <span className="flex flex-col w-full">
          <span
            className={clsx(
              "uppercase font-bold text-4xl transition-colors duration-300",
              state ? "text-yellow" : "text-yellow/50"
            )}
          >
            {label}
          </span>
  
          <div
            className={clsx(
              "overflow-hidden transition-all duration-500",
              fold ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <Link
              className="block ml-8 uppercase text-yellow/70 hover:text-yellow focus:text-yellow font-bold transition-colors duration-300 text-2xl"
              to={firstLink ?? ""}
            >
              {first}
            </Link>
            <Link
              className="block ml-16 uppercase text-yellow/70 hover:text-yellow focus:text-yellow font-bold transition-colors duration-300 text-2xl"
              to={secondLink ?? ""}
            >
              {second}
            </Link>
            {
              thirdLink && 
              <Link
              className="block ml-24 uppercase text-yellow/70 hover:text-yellow focus:text-yellow font-bold transition-colors duration-300 text-2xl"
              to={thirdLink ?? ""}
            >
              {third}
            </Link>
            }
          </div>
        </span>
      </span>
    )
  }
export default function Menu() {
    return (
        <BgShadow className="flex flex-col gap-8 ">
            <MenuDropDown label={gpt("multiplayer")} 
                          first={gpt("matchmaking")}
                          firstLink="/lobby/matchmaking" 
                          />

            <MenuDropDown label={gpt("local_game")} 
                          first="1 vs 1"
                          firstLink="/play/local" 
                          second={gpt("player_vs_ai")} 
                          secondLink="/play/local?isBot=1"
                          third={gpt("tournament")} 
                          thirdLink="/play/tournament"
                          />


            <MenuLink link="/profile" label={gpt("profile")} />
            <MenuLink link="/chat" label={gpt("social")} />
            
        </BgShadow>
    )
}