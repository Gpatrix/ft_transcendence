import LeftPart from "../LeftPart"
import RightPart from "../RightPart"

export default function MyProfile() {
    return (
        <div className="lg:w-full ml-auto mr-auto h-fit flex justify-stretch z-1 lg:flex-row flex-col">
            <LeftPart />
            <RightPart />
        </div>
    )
}