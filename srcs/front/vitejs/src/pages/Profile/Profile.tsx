import { useParams } from "react-router"
import OthersProfile from "./others/OthersProfile"
import MyProfile from "./me/MyProfile"

export default function Profile() {
    const params = useParams()

    return (params.id ? <OthersProfile/> :  <MyProfile/>)
}