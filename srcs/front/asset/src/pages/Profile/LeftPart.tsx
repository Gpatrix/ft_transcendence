import { useState } from "react"
import { gpt } from "../../translations/pages_reponses"
import { ProfileDataType } from "./me/MyProfile"
import { useParams } from "react-router"
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
    const [statsData, setStatsData] = useState<PlayerStats | null>(null)
    const params = useParams()
    const [newProfPicture, setNewProfPicture] = useState("")
    const [isOnline, setIsOnline] = useState<boolean>(false)

    const MAX_FILE_SIZE = 2000000;

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
        console.log("handleSubmit called with file:", file);
        if (!file) {
            setError(gpt("no_file"));
            setFile(undefined)
            console.error("No file selected");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError(gpt("big_file"));
            setFile(undefined)
            console.error("File size exceeds the limit");
            return;
        }
        const form: FormData = new FormData();
        form.append('file', file as File, file?.name ?? 'upload');
        console.log(file)

        try {
            const response = await fetch ("https://localhost:3000/api/upload/", {
                method: "POST",
                body: form,
            });

            if (response.status == 200) {
                window.location.reload();
            } else {
                const data = await response.json();
                setError(get_server_translation(data.error));
                setFile(undefined)
            }
        } catch (err: any) {
            console.error("Error uploading file:", err);
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
                data.winRate = Math.round(data.winRate)
                setStatsData(data);
            } catch (err) {
                setError(get_server_translation("0500"));
            }
        };

        const fetchUserStatus = async () => { // online / offline
            try {
                const res = await fetchWithAuth(`/api/chat/isconnected/${params.id}`);
                if (res.status == 200) {
                    const data = await res.json()
                    console.log(data)
                    setIsOnline(data.value)
                }
                else {
                    setIsOnline(false)
                }
            } catch (err) {
                setError(get_server_translation("0500"));
            }
        };
    
        fetchStats();

        if (!owner) {
            fetchUserStatus();
            const intervalId = setInterval(fetchUserStatus, 5000);
            return () => clearInterval(intervalId);
        }

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
            <span className="relative">
                <img src={data.profPicture ?? "/default.png"} 
                className={`ml-auto mr-auto rounded-full w-[100px] mb-8 shadow-lg/40 shadow-purple`}/>
                <span className="absolute  right-[115px] flex rounded-full top-[70px] items-center justify-center  w-[40px] h-[40px] bg-grey">
                    <span className="block  rounded-full relative w-5/6 h-5/6"
                    style={{
                        backgroundColor : isOnline ? "green" : "grey"
                    }}>
                    </span>
                </span>

            </span>
            }

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
            <span className="flex-col mt-[32px] w-[350px]">
                <span className="text-yellow w-full">{gpt("bio")}:</span>

                <p className="p-2 px-4 mt-[10px] break-words min-h-[100px] w-1/1 whitespace-pre-line rounded-xl text-ye bg-light-yellow border border-yellow w-full">
                    {data.bio}
                </p>
            </span>}
        </div>
    )
}