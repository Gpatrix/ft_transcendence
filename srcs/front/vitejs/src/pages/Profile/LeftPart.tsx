import TextAreaWithLabel from "../../components/TextAreaWithLabel"
import { get_page_translation } from "../../translations/pages_reponses"
import { ProfileDataType } from "./me/MyProfile"

interface LeftPartProps {
    data : ProfileDataType
}

export default function LeftPart({data}: LeftPartProps) {    
    return (
        <div className="z-1 w-1/1 xl:w-2/3 lg:mr-[32px] flex flex-col 100vh md:h-fit">
            <img src={data.profPicture ?? "/default.png"} className="ml-auto mr-auto rounded-full w-[100px] mb-8 shadow-lg/40 shadow-purple" />
            <span className="ml-auto mr-auto w-fit flex flex-col justify-center">
                <h2 className="w-fit text-light-yellow text-4xl font-bold">{data.name}</h2>
                <span className="text-yellow text-center">TOP #{data.rank}</span>
            </span>
            <span className="flex-col mt-[32px]">
                <span className="text-yellow">{get_page_translation("bio")}:</span>
                <p className="p-2 px-4 mt-[10px] min-h-[100px] whitespace-pre-line rounded-xl text-ye bg-light-yellow border border-yellow">
                    {data.bio ?? ""}
                </p>
            </span>
        </div>
    )
}