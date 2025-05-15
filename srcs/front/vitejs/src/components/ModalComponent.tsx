import { FormEvent, MouseEvent, ChangeEvent, useEffect, useState, SetStateAction } from "react";
import Button from "./Button";

type ModalComponentProps = {
    onClose: React.Dispatch<SetStateAction<boolean>>;
    message: string;
    option1?: string;
    option2?: string;
    onClickOption1: React.MouseEventHandler<HTMLButtonElement>;
    onClickOption2: React.MouseEventHandler<HTMLButtonElement>;
}

export default function ModalComponent({onClose, message, option1 = "oui", onClickOption1, option2 = "non", onClickOption2} : ModalComponentProps) {

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            window.removeEventListener("keydown", handleKeyDown);
            onClose(false);
        }
    };

    window.addEventListener("keydown", handleKeyDown);

    const handleClickOption1 = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        onClose(false);
        onClickOption1(event);
    }

    const handleClickOption2 = (event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        onClose(false);
        onClickOption2(event);
    }

    return (
        <div className="w-[100vw] h-[100vh] fixed z-999 top-0 left-0">
            <div className="fixed z-10 w-1/1 h-1/1 bg-(--dark-transp) top-0 left-0 cursor-pointer" onClick={() => onClose(false)}></div>
            <div className="relative max-w-[100%] w-[300px] z-20 bg-dark border border-yellow rounded-[1vw] shadow-yellow p-3 absolute top-[50%] left-[50%] translate-[-50%]">
                <button onClick={() => onClose(false)}
                    className="absolute right-3 top-3 border-3 border-yellow rounded-full w-10 h-10 flex items-center justify-center shrink-0 cursor-pointer">
                    <div className="w-1 h-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                    <div className="h-1 w-5 bg-yellow rotate-z-[45deg] absolute rounded-full"></div>
                </button>
                <h2 className="text-yellow text-center text-[1.4rem]">{message}</h2>
                <div className="flex justify-center">
                    <Button type="full" style="popup" className="mt-3 pink-shadow" onClick={(event) => handleClickOption1(event)}>{option1}</Button>
                    <Button type="stroke" style="popup" className="mt-3 shadow-none" onClick={(event) => handleClickOption2(event)}>{option2}</Button>
                </div>
            </div>
        </div>
    )
}
