import { Outlet } from "react-router"

export default function ProfileBackground() {
    return (
        <div className="z-1 relative justify-evenly shadow-xl/50 shadow-purple flex w-full max-w-[1300px] min-h-[500px] ml-auto mr-auto bg-no-repeat bg-right-top bg-full bg-[url(/rayons.svg)] bx-fixed rounded-[3vw]">
            <span className="z-0 absolute  p-[32px] w-full h-full bg-linear-[19deg,purple_0%,transparent_70%] rounded-[3vw]" />
            <span className="flex w-full h-full md:p-[30px] z-1">
                <Outlet />
            </span>
        </div>
    )
}