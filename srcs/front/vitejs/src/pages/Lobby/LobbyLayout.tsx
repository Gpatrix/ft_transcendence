import { Outlet } from "react-router"

export default function LobbyLayout() {
    return (
        <div className="z-1 relative justify-evenly shadow-xl/50 shadow-dark-red flex w-full max-w-[1000px]
                        min-h-[500px] ml-auto mr-auto bg-no-repeat bg-right-top bg-full 
                        bg-[url(/rayons_lobby.svg)] bx-fixed rounded-[3vw]">
            <span className="z-0 absolute  p-[32px] w-full h-full bg-[linear-gradient(15deg,rgba(255,0,0,0.3)_1%,transparent_80%)] rounded-[3vw]" />
            <span className="flex w-full h-full md:p-[30px] z-1">
                <Outlet />
            </span>
        </div>
    )
}