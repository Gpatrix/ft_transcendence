import { useState } from "react"
import TextAreaWithLabel from "../../components/TextAreaWithLabel"
import { gpt } from "../../translations/pages_reponses"
import { ProfileDataType } from "./me/MyProfile"
import { Form, useParams } from "react-router"
import { useAuth } from "../../AuthProvider"
import LoginErrorMsg from "../../components/LoginErrorMsg"
import { get_server_translation } from "../../translations/server_responses"
import { useEffect } from "react"

interface LeftPartProps {
    data : ProfileDataType
    owner?: boolean
}

interface PlayerStats {
    wins: number;
    looses: number;
    games: number;
    noContests: number;
    winRate: number;
}

export default function LeftPart({ data, owner }: LeftPartProps) {
    const [file, setFile] = useState<File>();
    const [error, setError] = useState<string>("");
    const { fetchWithAuth } = useAuth();
    const [newImageUrl, setNewImageUrl] = useState("")
    const [statsData, setStatsData] = useState<PlayerStats | null>(null)
    const params = useParams()
    const [newProfPicture, setNewProfPicture] = useState("")

    const MAX_FILE_SIZE = 200000;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const validImageTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];

        if (event.target.files) {
            const selectedFile = event.target.files[0]
            if (!validImageTypes.includes(selectedFile.type)) {
                setError(gpt("invalid_format"))
                setFile(undefined)
                return;
            }
            if (selectedFile.size > MAX_FILE_SIZE) {
                setError(gpt("big_file"));
                setFile(undefined)
                return;
            }
            setFile(event.target.files[0]);
            setError("");
            setNewProfPicture(URL.createObjectURL(event.target.files[0]))
        }
    };

    const handleSubmit = async () => {
        if (!file) {
            setError(gpt("no_file"));
            setFile(undefined)
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(gpt("big_file"));
            setFile(undefined)
            return;
        }
        const form = new FormData();
        form.append("image", file);

        try {
            const response = await fetchWithAuth("/api/user/edit", {
                signal: AbortSignal.timeout(5000),
                method: "PUT",
                body: form,
            }); 

            if (response.ok) {
                window.location.reload();
            } else {
                const data = await response.json();
                setError(get_server_translation(data.error));
                setFile(undefined)
            }
        } catch (err: any) {
            if (err.name === "AbortError") {
                setError(gpt("abort_error"));
            } else {
                setError(get_server_translation(err.message || "0500"));
            }
            setFile(undefined)
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetchWithAuth(`/api/game/stats${params.id ? "/" + params.id : ""}`);
                if (!res.ok) 
                    throw new Error("0500");
                const data = await res.json();
                setStatsData(data);
            } catch (err) {
                setError("0500");
            }
        };
    
        fetchStats();
    }, [owner, params.id]);


    return (
        <div className="z-1 w-1/1 xl:w-2/3 lg:mr-[32px] flex flex-col 100vh md:h-fit">
            { owner ?
            <span className="relative">
                <input accept="image/png, image/jpeg, image/webp, image/jpg" onChange={handleFileChange} type="file" className="z-1 absolute inset-x-0 m-auto w-[100px] h-[100px] text-transparent cursor-pointer"/>
                <img onClick={file ? handleSubmit : undefined} src={file ? "/icons/valid.svg" : "/icons/edit.svg"} className={`cursor-pointer absolute bottom-0 h-[100px] w-[40px] inset-x-[55%] z-0 wiggle ${file && "animate-wiggle z-100"}`}/>

                <img src={newProfPicture || data.profPicture || "/default.png"} 
                className={"ml-auto mr-auto rounded-full w-[100px] h-[100px] object-cover mb-8 shadow-lg/40 shadow-purple cursor-pointer"}/>
            </span>
            :
            <img src={data.profPicture ?? "/default.png"} 
            className={`ml-auto mr-auto rounded-full w-[100px] mb-8 shadow-lg/40 shadow-purple`}/>}

            {error && <LoginErrorMsg>{error}</LoginErrorMsg>}

            <span className="w-full flex flex-col justify-center">
                <h2 className="w-fit mr-auto ml-auto text-light-yellow text-4xl font-bold">{data.name}</h2>
                { statsData &&
                <span className="w-full mt-5 ml-auto mr-auto  flex flex-col p-7 rounded-3xl shadow-2xl">
                    <span className="text-yellow text-xl ml-auto mr-auto"> {gpt("victory_rate")} : {statsData.winRate}%</span>
                    <div className="w-full h-[1px] bg-yellow/20 my-4"></div>
                    <span className="flex justify-evenly ">
                        <span className="text-yellow text-bold">{statsData.wins} {gpt("victory")} </span>
                        <span className="mx-8 text-purple">|</span>
                        <span className="text-purple">{statsData.looses} {gpt("loose")}</span>
                    </span>
                </span>
                }
            </span>
            { data.bio &&
            <span className="flex-col mt-[32px]">
                <span className="text-yellow">{gpt("bio")}:</span>

                <p className="p-2 px-4 mt-[10px] min-h-[100px] whitespace-pre-line rounded-xl text-ye bg-light-yellow border border-yellow">
                    {data.bio}
                </p>
            </span>}
        </div>
    )
}