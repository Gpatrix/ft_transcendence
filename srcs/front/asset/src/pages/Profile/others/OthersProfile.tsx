import { useEffect, useState } from "react"
import LeftPart from "../LeftPart"
import RightPart from "../RightPart"
import { useAuth } from "../../../AuthProvider"
import { useNavigate, useParams } from "react-router"

export type ProfileDataType = {
    name: string
    email: string | null
    bio: string | null
    profPicture: string | null
    rank : number
    lang : number | null
}

export default function OthersProfile() {   
    const [profileData, setProfileData] = useState<ProfileDataType>({
        name: "",
        email: null,
        bio: null,
        profPicture: null,
        rank: 0,
        lang : null
    })
    const { id } = useParams();
    const navigate = useNavigate()

    const { fetchWithAuth } = useAuth();
    function getUserParams() {
        fetchWithAuth(`/api/user/get_profile/${id}`)
            .then((response) => {
                if (response.status != 200) 
                    throw new Error("User not found");
                return (response.json())
                }
            )
            .then((json) => {
                const data = json.data
                setProfileData(prev => ({
                    ...prev,
                    name: data.name,
                    email: data.email,
                    bio: data.bio,
                    profPicture: data.profPicture,
                    rank: data.rank,
                    lang: data.lang
                }));
            })
            .catch((error) => {
                navigate("/page-not-found")
            });
    }   

    useEffect(()=>{
        getUserParams()
    }, [navigate, id])

    return (
        <div className="px-5 w-full ml-auto mr-auto h-fit flex justify-stretch z-1 lg:flex-row flex-col">
            <LeftPart data={profileData} />
            <RightPart data={profileData} owner={false}/>
        </div>
    )
}