import { useEffect } from "react"
import LeftPart from "../LeftPart"
import RightPart from "../RightPart"

function getUserParams() {
    fetch("https://localhost/api/user/get_profile/")
}


export default function MyProfile() {


    useEffect(()=>{
        getUserParams()
    }, [])

    return (
        <div className="lg:w-full ml-auto mr-auto h-fit flex justify-stretch z-1 lg:flex-row flex-col">
            <LeftPart />
            <RightPart />
        </div>
    )
}