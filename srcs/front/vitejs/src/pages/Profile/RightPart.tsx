import { useEffect, useState } from "react";
import SwitchButton from "./SwitchButton";
import EditParams from "./me/EditParams";
import { ProfileDataType } from "./me/MyProfile";
import History from "./History";
import { useParams } from "react-router";

interface RightPartProps {
    data : ProfileDataType
    owner: boolean 
}

export default function RightPart({data, owner} : RightPartProps) {
    const [menuSwitch, setMenuSwitch] = useState<boolean>(false)
    const { id } = useParams();
    return (
        <div className="w-full">
            {owner && <SwitchButton setState={setMenuSwitch} state={menuSwitch}/>}
            { (owner && !menuSwitch) &&
                <EditParams placeholders={data} />
            }
            {
                (!owner || menuSwitch) &&
                <History playerId={Number(id)}/>
            }
        </div>
    )
}       