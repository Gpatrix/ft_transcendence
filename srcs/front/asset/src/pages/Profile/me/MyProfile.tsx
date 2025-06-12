import { useEffect, useState } from "react"
import LeftPart from "../LeftPart"
import RightPart from "../RightPart"
import { useAuth } from "../../../AuthProvider"
import useAuthChecker from "../../../AuthChecker"

export type ProfileDataType = {
    name: string
    email: string | null
    bio: string | null
    profPicture: string | null
    rank : number
    lang : number | null
    isTwoFactorEnabled : boolean | null
    provider: string | null
}

export default function MyProfile() {
    const [profileData, setProfileData] = useState<ProfileDataType>({
        name: "",
        email: null,
        bio: null,
        profPicture: null,
        rank: 0,
        lang : null,
        isTwoFactorEnabled : null,
        provider: null
    })

    const { fetchWithAuth } = useAuth();
    function getUserParams() {
        fetchWithAuth(`/api/user/get_profile/`)
            .then((response) => response.json())
            .then((json) => {
                const data = json.data
                if (!data) return
                setProfileData(prev => ({
                    ...prev,
                    name: data.name,
                    email: data.email,
                    bio: data.bio,
                    profPicture: data.profPicture,
                    rank: data.rank,
                    lang: data.lang,
                    isTwoFactorEnabled : data.isTwoFactorEnabled,
                    provider: data.provider || null
                }));
            })
            .catch(() => {
            });
    }
    useAuthChecker()

    useEffect(()=>{
        getUserParams()
    }, [])

    return (
        <div className="px-5 w-full ml-auto mr-auto h-fit flex justify-stretch z-1 lg:flex-row flex-col">
          {profileData &&  <LeftPart data={profileData} owner={true}/> }
          {profileData &&  <RightPart data={profileData} owner={true}/>  }
        </div>
    )
}