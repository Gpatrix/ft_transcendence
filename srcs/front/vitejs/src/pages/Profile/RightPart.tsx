import { useEffect, useState } from "react";
import SwitchButton from "./SwitchButton";
import EditParams from "./me/EditParams";
import { ProfileDataType } from "./me/MyProfile";

interface RightPartProps {
    data : ProfileDataType
}

export default function RightPart({data} : RightPartProps) {
    const [menuSwitch, setMenuSwitch] = useState<boolean>(false)

    return (
        <div className="w-full">
            <SwitchButton setState={setMenuSwitch} state={menuSwitch}/>
            { !menuSwitch &&
                <EditParams placeholders={data} />
            }   
        </div>
    )
}