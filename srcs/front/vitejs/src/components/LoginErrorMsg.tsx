import clsx from "clsx";

type Props = {
    children: React.ReactNode;
    className?: string
};

export default function LoginErrorMsg({children, className}: Props) {
    return (
        <span className={clsx("flex w-full max-w-[350px] mt-5 items-center ml-auto mr-auto h-fit", className)}>
            <img className="h-[30px] mr-[8px]" src={"/icons/error.svg"} alt="error icon" />
            <p className="text-light-red w-full">{children}</p>
        </span>
    )
}