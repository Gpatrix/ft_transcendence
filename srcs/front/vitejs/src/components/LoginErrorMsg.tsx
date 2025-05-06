type Props = {
    children: React.ReactNode;
};

export default function LoginErrorMsg({children}: Props) {
    return (
        <span className="flex w-full max-w-[350px] mt-5 items-center ml-auto mr-auto h-fit ">
            <img className="h-[30px] mr-[8px]" src={"/icons/error.svg"} alt="error icon" />
            <p className="text-light-red w-full">{children}</p>
        </span>
    )
}