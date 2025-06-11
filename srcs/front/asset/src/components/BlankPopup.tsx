import { ReactNode } from "react";
import { SetStateAction } from "react";

export default function BlankPopup({ children, onClose}: { children: ReactNode, onClose: React.Dispatch<SetStateAction<boolean>>; }) {
    // const [isOpen, setIsOpen]= useState<boolean>(true)
    return (
        <div className="w-[100vw] h-[100vh] fixed z-999 top-0 left-0 p-50">
            <div className="fixed z-10 w-1/1 h-1/1 bg-(--dark-transp) top-0 left-0 cursor-pointer" onClick={() => onClose(false)}></div>
            <div className="relative max-w-[100%] w-[500px] z-20 bg-dark border border-yellow rounded-3xl shadow-yellow p-5 absolute top-[50%] left-[50%] translate-[-50%]">
                <button onClick={() => onClose(false)}
                    className="absolute right-3 top-3 border-3 border-yellow    rounded-full w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer">
                    <div className="w-1 h-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                    <div className="h-1 w-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                </button>
                {children}
            </div>
        </div>
    )
}