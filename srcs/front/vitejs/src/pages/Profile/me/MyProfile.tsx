import { useEffect, useState } from "react"
import LeftPart from "../LeftPart"
import RightPart from "../RightPart"
import { useAuth } from "../../../AuthProvider"

export type ProfileDataType = {
    name: string
    email: string | null
    bio: string | null
    profPicture: string | null
    rank : number
    lang : number | null
}

export default function MyProfile() {
    const [profileData, setProfileData] = useState<ProfileDataType>({
        name: "",
        email: null,
        bio: null,
        profPicture: null,
        rank: 0,
        lang : null
    })

    const { fetchWithAuth } = useAuth();

    function getUserParams() {
        fetchWithAuth("https://localhost/api/user/get_profile/")
            .then((response) => response.json())
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
                console.error("Error :", error);
            });
    }

    useEffect(() => {
        console.log(profileData)
    }, [profileData]);

    useEffect(()=>{
        getUserParams()
    }, [])

    return (
        <div className="lg:w-full ml-auto mr-auto h-fit flex justify-stretch z-1 lg:flex-row flex-col">
            <LeftPart />
            <RightPart data={profileData}/>
        </div>
    )
}