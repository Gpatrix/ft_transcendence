import BgShadow from "../../../../components/BgShadow";

export default function Disconnected() {
    return (
        <BgShadow className="z-100 w-full absolute h-full flex backdrop-blur-xl rounded-none">
            <h2 className=" ml-auto mr-auto text-yellow mt-auto mb-auto animate-bounce">Someone is disconnected...</h2>
        </BgShadow>
    )
}